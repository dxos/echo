//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import memdown from 'memdown';

import { Event } from '@dxos/async';
import { KeyRecord, Keyring, KeyStore, KeyType } from '@dxos/credentials';
import { humanize, KeyPair } from '@dxos/crypto';
import { PartyKey } from '@dxos/echo-protocol';
import { FeedStore } from '@dxos/feed-store';
import { ModelFactory } from '@dxos/model-factory';
import { NetworkManager, SwarmProvider } from '@dxos/network-manager';
import { ObjectModel } from '@dxos/object-model';
import { Storage } from '@dxos/random-access-multi-storage';

import { FeedStoreAdapter } from './feed-store-adapter';
import { InvitationDescriptor, SecretProvider } from './invitations';
import { OfflineInvitationClaimer } from './invitations/offline-invitation-claimer';
import { IdentityManager, Party, PartyFactory, PartyFilter, PartyManager, PartyMember } from './parties';
import { HALO_CONTACT_LIST_TYPE } from './parties/halo-party';
import { createRamStorage } from './persistant-ram-storage';
import { ResultSet } from './result';
import { SnapshotStore } from './snapshot-store';

export interface Options {
  readOnly?: false;
  readLogger?: (msg: any) => void;
  writeLogger?: (msg: any) => void;
}

export type Contact = PartyMember;

/**
 * Various options passed to `ECHO.create`.
 */
export interface EchoCreationOptions {
  /**
   * Storage used for feeds. Defaults to in-memory.
   */
  feedStorage?: Storage

  /**
   * Storage used for keys. Defaults to in-memory.
   */
  keyStorage?: any

  /**
   * Storage used for snapshots. Defaults to in-memory.
   */
  snapshotStorage?: Storage

  /**
   * Networking provider. Defaults to in-memory networking.
   */
  swarmProvider?: SwarmProvider,

  /**
   * Whether to save and load snapshots. Defaults to `true`.
   */
  snapshots?: boolean

  /**
   * Number of messages after which snapshot will be created. Defaults to 100.
   */
  snapshotInterval?: number

  readLogger?: (msg: any) => void;
  writeLogger?: (msg: any) => void;
}

/**
 * This is the root object for the ECHO database.
 * It is used to query and mutate the state of all data accessible to the containing node.
 * Shared datasets are contained within `Parties` which consiste of immutable messages within multiple `Feeds`.
 * These feeds are replicated across peers in the network and stored in the `FeedStore`.
 * Parties contain queryable data `Items` which are reconstituted from an ordered stream of mutations by
 * different `Models`. The `Model` also handles `Item` mutations, which are streamed back to the `FeedStore`.
 * When opened, `Parties` construct a pair of inbound and outbound pipelines that connects each `Party` specific
 * `ItemManager` to the `FeedStore`.
 * Messages are streamed into the pipeline (from the `FeedStore`) in logical order, determined by the
 * `Spactime` `Timeframe` (which implements a vector clock).
 */
export class ECHO {
  private readonly _feedStore: FeedStoreAdapter;

  private readonly _keyring: Keyring;

  private readonly _identityManager: IdentityManager;

  private readonly _snapshotStore: SnapshotStore;

  private readonly _networkManager: NetworkManager;

  private readonly _modelFactory: ModelFactory;

  private readonly _partyManager: PartyManager;

  /**
   * Creates a new instance of ECHO.
   *
   * Without any parameters will create an in-memory database.
   */
  constructor ({
    feedStorage = createRamStorage(),
    keyStorage = memdown(),
    snapshotStorage = createRamStorage(),
    swarmProvider = new SwarmProvider(),
    snapshots = true,
    snapshotInterval = 100,
    readLogger,
    writeLogger
  }: EchoCreationOptions = {}) {
    this._feedStore = FeedStoreAdapter.create(feedStorage);

    const keyStore = new KeyStore(keyStorage);
    this._keyring = new Keyring(keyStore);
    this._identityManager = new IdentityManager(this._keyring);

    this._modelFactory = new ModelFactory()
      .registerModel(ObjectModel);

    const options = {
      readLogger,
      writeLogger,
      snapshots,
      snapshotInterval
    };

    this._networkManager = new NetworkManager(this._feedStore.feedStore, swarmProvider);
    this._snapshotStore = new SnapshotStore(snapshotStorage);
    const partyFactory = new PartyFactory(
      this._identityManager,
      this._feedStore,
      this._modelFactory,
      this._networkManager,
      this._snapshotStore,
      options
    );
    this._partyManager = new PartyManager(
      this._identityManager,
      this._feedStore,
      partyFactory,
      this._snapshotStore
    );
  }

  get isOpen () {
    return this._partyManager.opened;
  }

  get identityKey (): KeyRecord | undefined {
    return this._identityManager.identityKey;
  }

  get identityDisplayName (): string | undefined {
    return this._identityManager.displayName;
  }

  get isHaloInitialized (): boolean {
    return !!this._identityManager.halo;
  }

  get modelFactory (): ModelFactory {
    return this._modelFactory;
  }

  /**
   * For devtools.
   */
  get keyring (): Keyring {
    return this._keyring;
  }

  /**
   * For devtools.
   */
  get feedStore (): FeedStore {
    return this._feedStore.feedStore;
  }

  /**
   * For devtools.
   */
  get networkManager (): NetworkManager {
    return this._networkManager;
  }

  toString () {
    return `Database(${JSON.stringify({
      parties: this._partyManager.parties.length
    })})`;
  }

  /**
   * Opens the pary and constructs the inbound/outbound mutation streams.
   */
  async open () {
    await this._keyring.load();
    await this._partyManager.open();
  }

  /**
   * Closes the party and associated streams.
   */
  async close () {
    await this._networkManager.close();
    await this._partyManager.close();
  }

  /**
   * Removes all data and closes this ECHO instance.
   */
  async reset () {
    if (this._feedStore.storage.destroy) {
      await this._feedStore.storage.destroy();
    }

    await this._keyring.deleteAllKeyRecords();

    await this._snapshotStore.clear();

    await this.close();
  }

  /**
   * Create Profile. Add Identity key if public and secret key are provided.
   */
  async createIdentity (keyPair: KeyPair) {
    assert(keyPair.publicKey);
    assert(keyPair.secretKey);

    if (this._identityManager.identityKey) {
      throw new Error('Identity key already exists. Call createProfile without a keypair to only create a halo party.');
    }

    await this._keyring.addKeyRecord({ ...keyPair, type: KeyType.IDENTITY });
  }

  async createHalo (displayName?: string) {
    if (this._identityManager.halo) {
      throw new Error('HALO party already exists');
    }
    if (!this._identityManager.identityKey) {
      throw new Error('Cannot create HALO. Identity key not found.');
    }

    await this._partyManager.createHalo({
      identityDisplayName: displayName || humanize(this._identityManager.identityKey.publicKey)
    });
  }

  /**
   * Creates a new party.
   */
  async createParty (): Promise<Party> {
    await this.open();

    const impl = await this._partyManager.createParty();
    await impl.open();

    return new Party(impl);
  }

  /**
   * Returns an individual party by it's key.
   * @param {PartyKey} partyKey
   */
  getParty (partyKey: PartyKey): Party | undefined {
    assert(this._partyManager.opened, 'Database not open.');

    const impl = this._partyManager.parties.find(party => Buffer.compare(party.key, partyKey) === 0);
    return impl && new Party(impl);
  }

  /**
   * Queries for a set of Parties matching the optional filter.
   * @param {PartyFilter} filter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryParties (filter?: PartyFilter): ResultSet<Party> {
    assert(this._partyManager.opened, 'Database not open.');

    return new ResultSet(this._partyManager.update.discardParameter(), () => this._partyManager.parties.map(impl => new Party(impl)));
  }

  /**
   * Joins a party that was created by another peer and starts replicating with it.
   * @param invitationDescriptor
   * @param secretProvider
   */
  async joinParty (invitationDescriptor: InvitationDescriptor, secretProvider?: SecretProvider): Promise<Party> {
    assert(this._partyManager.opened, 'Database not open.');

    const actualSecretProvider = secretProvider ?? OfflineInvitationClaimer.createSecretProvider(this._partyManager.identityManager);

    const impl = await this._partyManager.joinParty(invitationDescriptor, actualSecretProvider);
    return new Party(impl);
  }

  /**
   * Joins an existing Identity HALO by invitation.
   */
  async joinHalo (invitationDescriptor: InvitationDescriptor, secretProvider: SecretProvider) {
    assert(this._partyManager.opened, 'Database not open.');
    assert(!this._partyManager.identityManager.halo, 'HALO already exists.');

    const impl = await this._partyManager.joinHalo(invitationDescriptor, secretProvider);
    return new Party(impl);
  }

  /**
   * Joins an existing Identity HALO from a recovery seed phrase.
   */
  async recoverHalo (seedPhrase: string) {
    assert(this._partyManager.opened, 'Database not open.');
    assert(!this._partyManager.identityManager.halo, 'HALO already exists.');
    assert(!this._partyManager.identityManager.identityKey, 'Identity key already exists.');

    const impl = await this._partyManager.recoverHalo(seedPhrase);
    return new Party(impl);
  }

  /**
   * Query for contacts.  Contacts represent member keys across all known Parties.
   */
  queryContacts (): ResultSet<Contact> {
    assert(this._partyManager.opened, 'Database not open.');
    assert(this._partyManager.identityManager.halo, 'HALO required.');

    const results = this._partyManager.identityManager.halo.database.queryItems({ type: HALO_CONTACT_LIST_TYPE });

    const getter = () => {
      const [contactListItem] = results.value;
      const contacts = contactListItem?.model.toObject();
      return contacts ? Object.values(contacts) as Contact[] : [];
    };

    const event = new Event();
    results.subscribe(() => {
      event.emit();
    });

    return new ResultSet(event, getter);
  }
}

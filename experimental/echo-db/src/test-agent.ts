import { Agent, JsonObject, Environment } from '@dxos/node-spawner';
import { ModelFactory } from '@dxos/experimental-model-factory';
import { ObjectModel } from '@dxos/experimental-object-model';
import { codec } from './codec';
import { Party, PartyManager } from './parties';
import { Database } from './database';
import { NetworkManager } from '@dxos/network-manager';
import { FeedStore } from '@dxos/feed-store';
import { keyToString, keyToBuffer, randomBytes } from '@dxos/crypto';
import { createReplicationMixin } from './replication';

export default class TestAgent implements Agent {
  private party?: Party;
  private db!: Database;

  constructor (private environment: Environment) {}

  async init (): Promise<void> {
    const { storage, swarmProvider } = this.environment;

    const feedStore = new FeedStore(storage, { feedOptions: { valueEncoding: codec } });

    const networkManager = new NetworkManager(feedStore, swarmProvider);

    const modelFactory = new ModelFactory()
      .registerModel(ObjectModel.meta, ObjectModel);

    const partyManager = new PartyManager(feedStore, modelFactory, {
      replicationMixin: createReplicationMixin(networkManager, feedStore, randomBytes())
    });
    this.db = new Database(partyManager);
    await this.db.open();
  }

  async onEvent (event: JsonObject) {
    if(event.command === 'CREATE_PARTY') {
      this.party = await this.db.createParty();

      const items = await this.party.queryItems();
      items.subscribe(items => {
        this.environment.metrics.set('itemCount', items.length);
      });

      const invitation = this.party.createInvitation();
      this.environment.log('invitation',  {
        partyKey: keyToString(invitation.partyKey as any),
        feeds: invitation.feeds.map(keyToString),
      })
    } else if(event.command === 'ACCEPT_INVITATION') {
      const { response, party } = await this.db.acceptInvitation({
        partyKey: keyToBuffer((event.invitation as any).partyKey),
        feeds: (event.invitation as any).feeds.map(keyToBuffer),
      });
      this.party = party;
      const items = await this.party.queryItems();
      items.subscribe(items => {
        this.environment.metrics.set('itemCount', items.length);
      });

      this.environment.log('invitationResponse', { newFeedKey: keyToString(response.newFeedKey) })
    } else if(event.command === 'FINALIZE_INVITATION') {
      this.party?.finalizeInvitation({
        newFeedKey: keyToBuffer((event.invitationResponse as any).newFeedKey),
      })
    } else {
      this.party!.createItem('wrn://dxos.org/item/document');
    }
  }

  async snapshot () {
    const items = await this.party?.queryItems();
    return {
      items: items?.value.map(item => ({
        id: item.id,
        type: item.type
        // model: JSON.parse(JSON.stringify(item.model)), // TODO(marik-d): Use a generic way to serialize items
      }))
    };
  }

  async destroy (): Promise<void> {
  }
}

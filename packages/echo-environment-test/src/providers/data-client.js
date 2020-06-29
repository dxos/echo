//
// Copyright 2020 DxOS.
//

import { createClient } from '@dxos/client';
import { Keyring, KeyType } from '@dxos/credentials';
// import { createId, createKeyPair, keyToString, randomBytes, sign, verify, SIGNATURE_LENGTH } from '@dxos/crypto';

import { Provider } from './provider';

export class DataClientProvider extends Provider {
  constructor (options = {}) {
    super(options);

    this._firstPeer = true;
  }

  async before () {
    const client = await this._createClient('owner');
    this._party = await client.partyManager.createParty();
    this._topic = this._party.publicKey;
    this._secret = '0000';
    this._peerPartyOwner = client;
    this._greeterSecretProvider = async () => Buffer.from(this._secret);
    this._greeterSecretValidator = async (invitation, secret) => secret && secret.equals(invitation.secret);
    this._inviteeSecretProvider = async () => Buffer.from(this._secret);
  }

  async run (_, peerId) {
    let client = null;

    if (this._firstPeer) {
      this._firstPeer = false;
      client = this._peerPartyOwner;
    } else {
      client = this._createClient(peerId);
    }

    client.networkManager.on('connection', (conn, info) => {
      this.emit('connection', conn, info);
    });

    return {
      client,
      createStream () {}
    };
  }

  async after (network) {
    this.on('connection', (conn, info) => {
      console.log('connection');
      // network.addConnection()
    });

    for (let i = 1; i < network.peers.length; i++) {
      const invitation = await this._peerPartyOwner.partyManager.inviteToParty(this._party.publicKey, this._greeterSecretProvider, this._greeterSecretValidator);
      await network.peers[i].client.partyManager.joinParty(invitation, this._inviteeSecretProvider);
    }
  }

  async _createClient (peerId) {
    const keyring = new Keyring();
    await keyring.createKeyRecord({ type: KeyType.IDENTITY });

    const client = await createClient(this.createStorage(peerId), keyring);
    await client.partyManager.identityManager.initializeForNewIdentity();
    return client;
  }
}

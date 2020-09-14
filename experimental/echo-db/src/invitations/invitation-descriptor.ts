//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import CryptoJS from 'crypto-js';
import stableStringify from 'json-stable-stringify';

import { keyToBuffer, keyToString } from '@dxos/crypto';
import { SwarmKey } from '@dxos/experimental-echo-protocol';

export enum InvitationDescriptorType {
  INTERACTIVE = '1',
  OFFLINE_KEY = '2',
}

interface QueryParameters {
  hash: string
  swarmKey: string
  invitation: string
  identityKey?: string
  type: string
}

// TODO(telackey): Add class description:
// TODO(telackey): Add comment explaining in brief what is going on.
//  e.g. what is hash for?
//  e.g. do we expect users of this class to serialize it themselves?
/**
 * Description of what this class is for goes here.
 */
export class InvitationDescriptor {
  static fromQueryParameters (queryParameters: QueryParameters): InvitationDescriptor {
    const { hash, swarmKey, invitation, identityKey, type } = queryParameters;

    const descriptor = new InvitationDescriptor(type as InvitationDescriptorType, keyToBuffer(swarmKey),
      keyToBuffer(invitation), (identityKey) ? keyToBuffer(identityKey) : undefined);

    if (hash !== descriptor.hash) {
      throw new Error('Invalid hash.');
    }

    return descriptor;
  }

  type: InvitationDescriptorType;

  // TODO(dboreham): Switch back to private member variables since we have encapsulated this class everywhere.
  swarmKey: Buffer;

  invitation: Buffer;

  identityKey?: Buffer;

  constructor (type: InvitationDescriptorType, swarmKey: SwarmKey, invitation: Buffer, identityKey?: Buffer) {
    assert(type);
    assert(Buffer.isBuffer(swarmKey));
    assert(Buffer.isBuffer(invitation));
    if (identityKey) {
      assert(Buffer.isBuffer(identityKey));
    }

    this.type = type;
    this.swarmKey = swarmKey;
    this.invitation = invitation;
    this.identityKey = identityKey;
  }

  get hash () {
    const query = this.toQueryParameters();
    return query.hash;
  }

  /**
   * Exports an InvitationDescriptor to an object suitable for use as query parameters.
   */
  toQueryParameters (): QueryParameters {
    const query: Partial<QueryParameters> = {
      swarmKey: keyToString(this.swarmKey),
      invitation: keyToString(this.invitation),
      type: this.type
    };

    if (this.identityKey) {
      query.identityKey = keyToString(this.identityKey);
    }

    query.hash = ripemd160(stableStringify(query));

    return query as QueryParameters;
  }
}

const ripemd160 = (plaintext: string) => {
  assert(typeof plaintext === 'string');

  return CryptoJS.RIPEMD160(plaintext).toString();
};

//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';
import { OrderedModelData } from './common/OrderedModelData';
import { ModelMessage, ModelData } from './common/ModelMessage';

/**
 * Partially ordered model accepts messages in a sequence of messageId and previousMessageId, allowing non-unique previousMessageIds
 */
export class PartiallyOrderedModel<T extends OrderedModelData> extends Model {
  _messageQueue: ModelMessage[] = [];

  _seenIds = new Set([0]);
  _maxSeenId = 0;

  async processMessages (messages: ModelMessage[]) {
    const messagesWithOrdering = messages
      .filter(
        m => m.data.messageId !== null && m.data.messageId !== undefined &&
        m.data.previousMessageId !== null && m.data.previousMessageId !== undefined
      );
    this._messageQueue.push(...messagesWithOrdering);
    await this.tryApplyQueue();
    this.emit('update', this);
  }

  async tryApplyQueue () {
    const toApply = [];
    while (this._messageQueue.length > 0) {
      const nextMessageCandidates = this._messageQueue
        .filter(m => this._seenIds.has(m.data.previousMessageId))
        .sort((a, b) => this.compareCandidates(a, b));

      if (nextMessageCandidates.length === 0) {
        break; // no messages from the queue could be applied at this time
      }

      toApply.push(...nextMessageCandidates);

      // ...and discards the rest
      this._messageQueue = this._messageQueue.filter(m => !this._seenIds.has(m.data.previousMessageId));

      nextMessageCandidates.forEach(m => {
        this._seenIds.add(m.data.messageId);
        this._maxSeenId = Math.max(this._maxSeenId, m.data.messageId);
      });
    }
    await this.onUpdate(toApply);
  }

  /**
   * @Virtual
   * Comparer used to sort messages forking from a single parent
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compareCandidates (a: ModelMessage, b: ModelMessage) {
    return -1;
  }

  /**
   * @param {ModelMessage[]} messages
   */
  async onUpdate (messages: ModelMessage[]) {
    throw new Error(`Not processed: ${messages.length}`);
  }

  static createGenesis (data: ModelData) {
    return {
      ...data,
      messageId: 1,
      previousMessageId: 0
    };
  }

  appendData (data: Omit<T, 'messageId' | 'previousMessageId'>) {
    super.appendData({
      ...data,
      messageId: this._maxSeenId + 1,
      previousMessageId: this._maxSeenId
    });
  }
}

export class DefaultPartiallyOrderedModel<T extends OrderedModelData> extends PartiallyOrderedModel<T> {
  _messages: ModelMessage[] = [];

  get messages () {
    return this._messages;
  }

  async onUpdate (messages: ModelMessage[]) {
    this._messages = [...this._messages, ...messages];
  }
}

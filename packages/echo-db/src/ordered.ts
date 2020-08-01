//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';
import type { OrderedModelData } from './common/OrderedModelData';
import { ModelMessage } from './common/ModelMessage';

/**
 * Basic ordered log model. Maintains a list of messages in an order of referencing messages to a previous ones.
 * It requires the previousMessageId of the first message (genesis) to be equal '0'
 * It requires every message to have id, and every message (except genesis) to have previousMessageId referencing an existing message's id
 */
export class OrderedModel<T extends OrderedModelData> extends Model {
  _messageQueue: ModelMessage[] = [];

  _orderedMessages: ModelMessage[] = [];

  get orderedMessages () {
    return this._orderedMessages;
  }

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
      const currentMessageId = this._orderedMessages.length === 0 ? 0
        : this._orderedMessages[this._orderedMessages.length - 1].data.messageId;

      const nextMessageCandidates = this._messageQueue
        .filter(m => m.data.previousMessageId === currentMessageId)
        .filter(m => !this._orderedMessages.find(o => o.data.messageId === m.data.messageId)) // make sure message id does not already exist
        .filter(m => this.validateCandidate(this._orderedMessages.length, m)); // apply (optional) strategy

      if (nextMessageCandidates.length === 0) {
        break; // no messages from the queue could be applied at this time
      }

      // the default model picks any candidate...
      const nextMessage = nextMessageCandidates[0];
      this._orderedMessages = [...this._orderedMessages, nextMessage];
      toApply.push(nextMessage);

      // ...and discards the rest
      this._messageQueue = this._messageQueue.filter(m => m.data.previousMessageId !== currentMessageId);
    }
    await this.onUpdate(toApply);
  }

  /**
   * @Virtual
   * When overriding this model, it can be used to apply a custom strategy (e.g. permissions to write messages)
   * @param  {integer} _intendedPosition - 0-indexed position of ordered messages, that the candidate is about to get
   * @param  {object} _message - message candidate
   */
  // eslint-disable-next-line
  validateCandidate(_intendedPosition: number, _message: ModelMessage) {
    return true;
  }

  // eslint-disable-next-line
  async onUpdate(messages: ModelMessage[]) {
    throw new Error(`Not processed: ${messages.length}`);
  }

  static createGenesisMessage (messageData: any) {
    return {
      messageId: 1,
      previousMessageId: 0,
      ...messageData
    };
  }

  appendMessage (message: ModelMessage) {
    // Only the data is passed through.
    const data = {
      ...message.data,
      messageId: this._orderedMessages.length + 1, // first message has id of 1
      previousMessageId: this._orderedMessages.length > 0
        ? this._orderedMessages[this._orderedMessages.length - 1].data.messageId
        : 0
    };

    super.appendMessage(new ModelMessage(data));
  }
}

export class DefaultOrderedModel<T extends OrderedModelData> extends OrderedModel<T> {
  get messages () {
    return this._orderedMessages;
  }

  async onUpdate () {

  }
}

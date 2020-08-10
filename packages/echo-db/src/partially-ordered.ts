//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';

import { Any, createModelMessage } from './common';
import { dxos } from './proto';
import OrderedModelData = dxos.echo.OrderedModelData;
import IModelMessage = dxos.echo.IModelMessage;
import IOrderedModelData = dxos.echo.IOrderedModelData;

const toOrderedData = (message: IModelMessage) => <IOrderedModelData>message.data;

const prevId = (message: IModelMessage) => {
  const { previousMessageId } = toOrderedData(message);
  if (previousMessageId === null || undefined === previousMessageId) {
    throw new Error(`Malformed message: ${JSON.stringify(message)}`);
  }
  return previousMessageId;
};

const msgId = (message: IModelMessage) => {
  const { messageId } = toOrderedData(message);
  if (messageId === null || undefined === messageId) {
    throw new Error(`Malformed message: ${JSON.stringify(message)}`);
  }
  return messageId;
};

/**
 * Partially ordered model accepts messages in a sequence of messageId and previousMessageId, allowing non-unique previousMessageIds
 */
export class PartiallyOrderedModel extends Model {
  _messageQueue: IModelMessage[] = [];

  _seenIds = new Set([0]);
  _maxSeenId = 0;

  async processMessages (messages: IModelMessage[]) {
    const messagesWithOrdering = messages
      .filter(
        m => toOrderedData(m).messageId !== null && toOrderedData(m).messageId !== undefined &&
        toOrderedData(m).previousMessageId !== null && toOrderedData(m).previousMessageId !== undefined
      );
    this._messageQueue.push(...messagesWithOrdering);
    await this.tryApplyQueue();
    this.emit('update', this);
  }

  async tryApplyQueue () {
    const toApply = [];
    while (this._messageQueue.length > 0) {
      const nextMessageCandidates = this._messageQueue
        .filter(m => this._seenIds.has(prevId(m)))
        .sort((a, b) => this.compareCandidates(a, b));

      if (nextMessageCandidates.length === 0) {
        break; // no messages from the queue could be applied at this time
      }

      toApply.push(...nextMessageCandidates);

      // ...and discards the rest
      this._messageQueue = this._messageQueue.filter(m => !this._seenIds.has(prevId(m)));

      nextMessageCandidates.forEach(m => {
        this._seenIds.add(msgId(m));
        this._maxSeenId = Math.max(this._maxSeenId, msgId(m));
      });
    }
    await this.onUpdate(toApply);
  }

  /**
   * @Virtual
   * Comparer used to sort messages forking from a single parent
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compareCandidates (a: IModelMessage, b: IModelMessage) {
    return -1;
  }

  /**
   * @param {IModelMessage[]} messages
   */
  async onUpdate (messages: IModelMessage[]) {
    throw new Error(`Not processed: ${messages.length}`);
  }

  static createGenesisMessage (data: Any) {
    return createModelMessage(OrderedModelData.create({
      messageId: 1,
      previousMessageId: 0,
      data
    }));
  }

  appendMessage (data: Any) {
    const orderedModelData = Any.create(OrderedModelData.create({
      messageId: this._maxSeenId + 1,
      previousMessageId: this._maxSeenId,
      data
    }));

    super.appendMessage(orderedModelData);
  }
}

export class DefaultPartiallyOrderedModel extends PartiallyOrderedModel {
  _messages: IModelMessage[] = [];

  get messages () {
    return this._messages;
  }

  async onUpdate (messages: IModelMessage[]) {
    this._messages = [...this._messages, ...messages];
  }
}

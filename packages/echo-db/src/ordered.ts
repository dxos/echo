//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';
import { dxos } from './proto';
import { createModelMessage } from './common';
import { google } from './proto/gen/echo';
import IModelMessage = dxos.echo.IModelMessage;
import IOrderedModelData = dxos.echo.IOrderedModelData;
import IAny = google.protobuf.IAny;
import OrderedModelData = dxos.echo.OrderedModelData;

const toOrderedData = (message: IModelMessage) => <IOrderedModelData>message.data;

/**
 * Basic ordered log model. Maintains a list of messages in an order of referencing messages to a previous ones.
 * It requires the previousMessageId of the first message (genesis) to be equal '0'
 * It requires every message to have id, and every message (except genesis) to have previousMessageId referencing an existing message's id
 */
export class OrderedModel extends Model {
  _messageQueue: IModelMessage[] = [];

  _orderedMessages: IModelMessage[] = [];

  get orderedMessages () {
    return this._orderedMessages;
  }

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
      const currentMessageId = this._orderedMessages.length === 0 ? 0
        : toOrderedData(this._orderedMessages[this._orderedMessages.length - 1]).messageId;

      const nextMessageCandidates = this._messageQueue
        .filter(m => toOrderedData(m).previousMessageId === currentMessageId)
        .filter(m => !this._orderedMessages.find(o => toOrderedData(o).messageId === toOrderedData(m).messageId)) // make sure message id does not already exist
        .filter(m => this.validateCandidate(this._orderedMessages.length, m)); // apply (optional) strategy

      if (nextMessageCandidates.length === 0) {
        break; // no messages from the queue could be applied at this time
      }

      // the default model picks any candidate...
      const nextMessage = nextMessageCandidates[0];
      this._orderedMessages = [...this._orderedMessages, nextMessage];
      toApply.push(nextMessage);

      // ...and discards the rest
      this._messageQueue = this._messageQueue.filter(m => toOrderedData(m).previousMessageId !== currentMessageId);
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
  validateCandidate(_intendedPosition: number, _message: IModelMessage) {
    return true;
  }

  // eslint-disable-next-line
  async onUpdate(messages: IModelMessage[]) {
    throw new Error(`Not processed: ${messages.length}`);
  }

  static createGenesisMessage (data: IAny) {
    return createModelMessage(OrderedModelData.create({
      messageId: 1,
      previousMessageId: 0,
      data
    }));
  }

  appendMessage (message: IModelMessage) {
    const messageId = this._orderedMessages.length + 1; // first message has id of 1
    const previousMessageId = !this._orderedMessages.length
      ? toOrderedData(this._orderedMessages[this._orderedMessages.length - 1]).messageId : 0;

    // Only the message's data is passed through.
    const data = OrderedModelData.create({
      messageId,
      previousMessageId,
      data: message.data
    });

    super.appendMessage(data);
  }
}

export class DefaultOrderedModel extends OrderedModel {
  get messages () {
    return this._orderedMessages;
  }

  async onUpdate () {
  }
}

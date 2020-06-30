//
// Copyright 2020 DxOS.org
//

import { Model } from '@dxos/model-factory';
import { Doc, applyUpdate } from 'yjs';

export class TextModel extends Model {
  _doc = new Doc()

  constructor (options) {
    super(options);

    this._doc.on('update', this._handleDocUpdated.bind(this));
  }

  get content () {
    return this._doc.getText('content');
  }

  _handleDocUpdated (update, origin) {
    if (origin === this._doc.clientID) {
      console.log('same origin');

      this.appendMessage({ update, origin });

      return;
    }

    applyUpdate(this._doc, update, origin);
  }

  _transact (fn) {
    return this._doc.transact(fn, this._doc.clientID);
  }

  insert (index, text) {
    return this._transact(() => this.content.insert(index, text));
  }

  delete (index, count) {
    return this._transact(() => this.content.delete(index, count));
  }

  async onUpdate (messages) {
    messages.forEach(message => {
      applyUpdate(this._doc, message.update, message.origin);
    });
  }

  async onDestroy () {
    this._doc.off('update', this._handleDocUpdated.bind(this));
  }
}

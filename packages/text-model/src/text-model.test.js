//
// Copyright 2020 DxOS.org
//

import { TextModel } from './text-model';

let model;
beforeEach(() => {
  model = new TextModel();
});

test('Initial', () => {
  expect(model.content.length).toBe(0);
});

test('Insertion', () => {
  const text = 'Testing text';
  model.insert(0, text);

  expect(model.content.length).toBe(text.length);
});

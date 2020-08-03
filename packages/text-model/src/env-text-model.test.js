import { EnvironmentFactory, providers, networkTypes } from '@dxos/echo-environment-test';

import { TextModel, TYPE_TEXT_MODEL_UPDATE } from './text-model';

let env;
let agent;
let models;
let rootModel;

jest.setTimeout(10000);

const buildEnv = async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => console.log('error', err));

  env = await factory.create(new providers.BasicProvider({
    network: {
      type: networkTypes.COMPLETE,
      parameters: [2] // n levels of the binary tree
    }
  }));

  agent = env.addAgent({
    spec: {
      ModelClass: TextModel,
      options: {
        type: TYPE_TEXT_MODEL_UPDATE
      }
    }
  });

  models = [];
  env.peers.forEach((peer) => {
    models.push(agent.createModel(peer));
  });

  rootModel = models[0];
};

beforeEach(async () => {
  await buildEnv();
});

afterEach(async () => {
  await env.destroy();
});

test('insertion', async () => {
  const text = '++TEXT++';
  const otherText = '--OTHER-TEXT';
  const lastText = '--LAST-TEXT';

  models[1].insert(0, text);
  await agent.waitForSync();

  expect(rootModel.textContent).toBe(text);

  models[1].insert(models[1].textContent.length, otherText);
  await agent.waitForSync();

  rootModel.insert(rootModel.textContent.length, lastText);
  await agent.waitForSync();

  expect(models[0].textContent).toBe(text + otherText + lastText);
  expect(rootModel.textContent).toBe(text + otherText + lastText);
});

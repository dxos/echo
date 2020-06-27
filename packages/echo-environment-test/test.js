import { DefaultModel } from '@dxos/model-factory';
import { Suite } from '@dxos/benchmark-suite';
import { STORAGE_CHROME } from '@dxos/random-access-multi-storage';

import { EnvironmentFactory, providers } from './src';

if (typeof window !== 'undefined') {
  process.nextTick = (...args) => {
    if (args.length === 1) {
      return queueMicrotask(args[0]);
    }

    queueMicrotask(() => args[0](...args.slice(1, args.length)));
  };
}

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => {
    console.log(err);
  });

  factory.setProvider(new providers.BasicProvider({
    storageType: STORAGE_CHROME
  }));

  try {
    const env = await factory.create();

    const suite = new Suite();

    const agent = env.addAgent({
      id: 'random-data',
      spec: {
        ModelClass: DefaultModel
      }
    });

    const model = agent.createModel(env.peers[0]);

    [...Array(10000).keys()].map(m => model.appendMessage({ name: 'test' }));

    suite.test('reading first time', () => {
      return agent.waitForModelSync(model);
    });

    suite.test('reading again', async () => {
      const newModel = await agent.resetModel(model);
      return agent.waitForModelSync(newModel);
    });

    suite.print(await suite.run());
  } catch (err) {
    console.log(err);
  }
})();

import { ObjectModel } from '@dxos/echo-db';
import { DefaultModel } from '@dxos/model-factory';
import { Suite } from '@dxos/benchmark-suite';

import { EnvironmentFactory, providers } from './src';

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => console.log('error', err));

  try {
    const env = await factory.create(new providers.DataClientProvider({ peers: 2 }));

    const suite = new Suite();

    const agent = env.addAgent({
      spec: {
        ModelClass: ObjectModel,
        options: {
          type: 'example.com/Test'
        }
      }
    });

    const peer = env.getRandomPeer();

    const model = agent.createModel(env.peers[0]);
    await env.invitePeer({ toPeer: env.peers[1] });
    // await env.peers[0].invitePeer(env.peers[1]);
    agent.createModel(env.peers[1]);

    [...Array(1000).keys()].map(m => model.createItem('example.com/Test', { prop1: 'prop1value' }));

    suite.test('reading first time', async () => {
      console.log(env.stats);
      await agent.waitForSync();
      console.log(env.stats);
    });

    suite.test('reading again', async () => {
      const newModel = agent.createModel(peer);
      return agent.waitForModelSync(newModel);
    });

    suite.print(await suite.run());
  } catch (err) {
    console.log(err);
  }
})();

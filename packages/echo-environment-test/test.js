import { EchoModel } from '@dxos/echo-db';
import { Suite } from '@dxos/benchmark-suite';

import { EnvironmentFactory, providers, networkTypes } from './src';

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => console.log(err));

  factory.setProvider(new providers.DataClientProvider());

  try {
    const env = await factory.create({
      network: {
        type: networkTypes.NO_LINKS,
        parameters: [1]
      }
    });

    const suite = new Suite();

    const agent = env.addAgent({
      spec: {
        ModelClass: EchoModel,
        options: {
          type: 'wrn_dxos_org_test_echo_object'
        }
      }
    });

    const model = agent.createModel(env.getRandomPeer());

    [...Array(2).keys()].map(m => model.createItem('wrn_dxos_org_test_echo_object', { prop1: 'prop1value' }));

    suite.test('reading first time', async () => {
      return agent.waitForModelSync(model);
    });

    suite.test('reading again', async () => {
      const newModel = agent.createModel(env.peers[0]);
      return agent.waitForModelSync(newModel);
    });

    suite.print(await suite.run());
  } catch (err) {
    console.log(err);
  }
})();

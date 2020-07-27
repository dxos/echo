import assert from 'assert';

import { EnvironmentFactory, providers, networkTypes } from '@dxos/echo-environment-test';

import { TextModel } from './text-model';

if (typeof window !== 'undefined' && typeof process !== 'undefined') {
  process.nextTick = function (fn) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }
    }

    queueMicrotask(() => fn(...args));
  };
}

let env;
let agent;
let models;
let rootModel;

const buildEnv = async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => console.log('error', err));

  try {
    env = await factory.create(new providers.BasicProvider({
      network: {
        type: networkTypes.BALANCED_BIN_TREE,
        parameters: [3] // n levels of the binary tree
      }
    }));

    agent = env.addAgent({
      spec: {
        ModelClass: TextModel,
        options: {
          type: 'example.com/Test'
        }
      }
    });

    console.log('> nodes:', env.peers.length, '\n');
    // console.log('> topic:', agent._topic, '\n');

    models = [];
    env.peers.forEach((peer) => {
      models.push(agent.createModel(peer));
    });

    rootModel = models[0];
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  await buildEnv();

  const text = 'Testing update';
  models[3].on('update', messages => console.log('update', messages));
  rootModel.insert(0, text);
  await agent.waitForSync();
  assert(models[3].textContent === text, 'not same content: ' + models[3].content + ' - ' + rootModel.textContent);
})();

// beforeEach(async () => await buildEnv());

// test('start', async () => {
//   // await agent.waitForSync();
//   // expect(rootModel.textContent).toBe('');
//   // expect(env).toBe('alala');
// });

//     await Promise.all([...Array(1000).keys()].map(m => rootModel.createItem('example.com/Test', { prop1: 'prop1value' })));

//     suite.test('reading first time', async () => {
//       console.log('> prev state', JSON.stringify(env.state), '\n');
//       await agent.waitForSync();
//       console.log('> next state', JSON.stringify(env.state), '\n');
//     });

//     suite.test('reading again', async () => {
//       const newModel = agent.createModel(env.getRandomPeer());
//       return agent.waitForModelSync(newModel);
//     });

//     suite.print(await suite.run());

//     await env.destroy();
//   } catch (err) {
//     console.log(err);
//   }
// })();

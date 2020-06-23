import { EnvironmentFactory } from './src/environment';
import { DefaultModel } from '@dxos/model-factory';

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => {
    console.log(err);
  });

  try {
    const env = await factory.create();

    await env.addModels([{
      ModelClass: DefaultModel,
      generator (topic, peerId) {
        return () => ({ value: `msg/${peerId.toString('hex').slice(0, 6)}/${Date.now()}` });
      }
    }]);

    env.on('model-update', ({ topic, peerId, messages }) => {
      console.log(peerId.toString('hex'), messages);
    });

    await env.appendMessages(5);
  } catch (err) {
    console.log(err);
  }
})();

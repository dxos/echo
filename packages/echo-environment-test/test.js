import { EnvironmentFactory, defaultModel, COMPLETE } from './src';

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => {
    console.log(err);
  });

  try {
    const env = await factory.create({
      network: {
        type: COMPLETE,
        parameters: [2]
      }
    });

    env.addModel(defaultModel);

    // env.on('model-update', ({ topic, peerId, messages }) => {
    //   console.log(peerId.toString('hex'), messages.length, env.totalStreamMessages);
    // });

    // env.on('stream-data', () => {
    //   console.log('entra')
    // });

    // await env.appendEnvironmentMessages(10);

    console.log(env.updatedModelMessages);

    const model = env.models[0];

    await env.appendMessages(model, 10);

    await env.waitForEnvironmentSync();

    console.log(env.updatedModelMessages);
  } catch (err) {
    console.log(err);
  }
})();

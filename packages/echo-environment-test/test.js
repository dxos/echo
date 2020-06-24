import { EnvironmentFactory, defaultModel } from './src';

(async () => {
  const factory = new EnvironmentFactory();
  factory.on('error', err => {
    console.log(err);
  });

  try {
    const env = await factory.create();

    await env.addModel(defaultModel);

    env.on('model-update', ({ topic, peerId, messages }) => {
      console.log(peerId.toString('hex'), env.totalMessages);
    });

    await env.appendMessages(5000);

    console.log(env.totalMessages)

    await env.waitForSync();

    console.log(env.totalMessages)
  } catch (err) {
    console.log(err);
  }
})();

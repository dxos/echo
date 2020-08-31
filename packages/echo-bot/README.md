# Echo Bot

## Development

BotFactory running in local-dev mode could be used during Bot development process. This will bypass WNS and IPFS and load bot directly from source. In order to start BotFactory, such command could be used from the root folder of the bot package:

> You could use optional `--reset` argument to prevent restarting of previously spawned bots.

```
$ wire bot factory start --local-dev --reset
```

This will produce output that contains BotFactory topic.

New instance of bot could be spawned using either CLI or Invitation Popup in GUI.

### CLI

In new terminal, use CLI to spawn a bot, using topic from BotFactory output:

```
$ wire bot spawn --bot-id="wrn://dxos/bot/echo" --topic <Bot Factory Topic>
```

This will produce an output that contains unique Bot ID (botUID).

Then, use CLI to create a party:

```
$ wire party create
```

This command will send CLI into interactive mode.
Within the created party, invite bot using topic from BotFactory output:

```
[wire]> bot invite --topic <Bot Factory Topic> --bot-uid <botUID>
```

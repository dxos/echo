import { FeedSetProvider } from './parties/party-processor';
import { FeedStore } from '@dxos/feed-store';
import { Protocol } from '@dxos/protocol';
import { Replicator } from '@dxos/protocol-plugin-replicator';
import { PartyKey, FeedKey } from '@dxos/experimental-echo-protocol';
import { keyToString, discoveryKey } from '@dxos/crypto';

export function createReplicationMixin (networkManager: any, feedStore: FeedStore, peerId: Buffer) {
  return (partyKey: PartyKey, activeFeeds: FeedSetProvider) => {
    const openFeed = async (key: FeedKey) => {
      const topic = keyToString(partyKey);

      // Get the feed if we have it already, else create it.
      // TODO(marik-d): Rethink FeedStore API: Remove openFeed
      return feedStore.getOpenFeed(desc => desc.feed.key.equals(key)) ||
        feedStore.openFeed(`/topic/${topic}/readable/${keyToString(key)}`, { key: Buffer.from(key), metadata: { partyKey } } as any);
    };

    const replicator = new Replicator({
      load: async () => {
        const partyFeeds = await Promise.all(activeFeeds.get().map(feedKey => openFeed(feedKey)));
        return partyFeeds.map((feed) => {
          return { discoveryKey: feed.discoveryKey };
        });
      },
      subscribe: (addFeedToReplicatedSet: (feed: any) => void) => activeFeeds.added.on(async (feedKey) => {
        const feed = await openFeed(feedKey);
        addFeedToReplicatedSet({ discoveryKey: feed.discoveryKey });
      }),
      replicate: async (remoteFeeds: any, info: any) => {
        // We can ignore remoteFeeds entirely, because the set of feeds we want to replicate is dictated by the Party.
        // TODO(telackey): why are we opening feeds? Necessary or belt/braces thinking, or because open party does it?
        return Promise.all(activeFeeds.get().map(feedKey => openFeed(feedKey)));
      }
    });

    networkManager.joinProtocolSwarm(
      partyKey,
      ({ channel }: any) => {
        const protocol = new Protocol({
          streamOptions: {
            live: true
          },
          discoveryToPublicKey: (dk: any) => {
            if (!discoveryKey(partyKey).equals(dk)) {
              return undefined;
            }
            protocol.setContext({ topic: keyToString(partyKey) });
            return partyKey;
          }
        })
          .setSession({ peerId })
          .setExtensions([replicator.createExtension()])
          .init(channel);
        return protocol;
      });
  };
}

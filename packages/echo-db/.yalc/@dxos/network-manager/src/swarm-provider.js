//
// Copyright 2020 DXOS.org
//

// TODO(dboreham): Discuss whether this design makes sense (vs swarm ownership encapsulated entirely within
//   network-manager, or entirely owned outwith network-manager). Also should we plan for hetrogeneous swarms?

import discoverySwarmWebRTC from '@geut/discovery-swarm-webrtc';
import assert from 'assert';
import debug from 'debug';

import { keyToString } from '@dxos/crypto';
import metrics from '@dxos/metrics';
import discoverySwarmMemory from '@wirelineio/discovery-swarm-memory';

// NodeJS requires a native extension for WebRTC, but modern browsers will already have it.
const wrtc = typeof window === 'undefined' ? require('wrtc') : undefined; // eslint-disable-line global-require

const log = debug('dxos:network-manager:swarm');

/**
 * Creates swarm objects for a supplied protocol provider.
 */
export class SwarmProvider {
  /**
   * @param {Object} config - config object for swarm.
   */
  constructor (config = {}) {
    assert(config);
    this._config = config;
    log('Swarm config:', config);
    // TODO(dboreham): Select swarm factory based on config.
    // TODO(dboreham): Hack, if signal or ICE servers are specified, assume WebRTC.
    const swarmType = this._config.signal || this._config.ice;
    this._swarmFactory = swarmType ? discoverySwarmWebRTC : discoverySwarmMemory;
  }

  /**
   * Create a new network swarm object (see: https://github.com/mafintosh/discovery-swarm) of type and with
   * configuration determined by this._config and bound with the supplied ProtocolProvider.
   * @param {ProtocolProvider} protocolProvider
   * @param {ProtocolContext} protocolContext
   * @param {object} [options]
   * @property {object} [options.signal] Implementation of signal client.
   * @return {DiscoverySwarmWebrtc}
   */
  createSwarm (protocolProvider, protocolContext, options = {}) {
    // TODO(dboreham): Config contents should be opaque.
    const { signal, ice } = this._config;

    // https://github.com/geut/discovery-swarm-webrtc#const-sw--swarmopts
    const swarm = this._swarmFactory({
      bootstrap: [signal],
      simplePeer: {
        wrtc,
        config: {
          iceServers: ice
        }
      },
      stream: ({ channel }) => {
        return protocolProvider({ channel, protocolContext }).stream;
      },
      signal: options.signal
    });

    metrics.inc('swarm.create');

    // TODO(burdon): Humanize.
    // TODO(burdon): Extend log.
    const id = keyToString(swarm.id);
    log(`Node ${id} swarm create.`);

    swarm.on('connection', () => {
      log(`Node ${id} swarm connection.`);
      metrics.inc('swarm.connection');
    });

    swarm.on('connection-closed', () => {
      log(`Node ${id} swarm connection closed.`);
      metrics.inc('swarm.connection-closed');
    });

    swarm.on('error', (err) => {
      log(`Node ${id} swarm error: ${err}`);
      metrics.inc('swarm.error');
    });

    swarm.on('close', () => {
      log(`Node ${id} swarm closed.`);
      metrics.inc('swarm.close');
    });

    return swarm;
  }
}

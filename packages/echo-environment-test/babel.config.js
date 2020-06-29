//
// Copyright 2020 DxOS.
//

module.exports = {
  presets: [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    [
      'babel-plugin-inline-import', {
        extensions: [
          '.proto',
          '.txt',
          '.json'
        ]
      }
    ],
    'add-module-exports',
    '@babel/plugin-proposal-export-default-from',
    ['module-resolver', {
      alias: {
        '@geut/discovery-swarm-webrtc': '@dxos/discovery-swarm-memory'
      }
    }]
  ]
};

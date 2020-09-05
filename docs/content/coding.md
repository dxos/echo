# Coding Style

- Avoid setting properties in inline constructor arguments
- Use debug instead of console.log
- Use debug('dxos:...:error') for error logging
- Maintain keys as (typed) buffers (using complex collections) until needed as string. Avoid:
    keyToString(Buffer.from(response.peerFeedKey)) 


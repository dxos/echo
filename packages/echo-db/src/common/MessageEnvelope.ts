export interface MessageFeedInfo {
  key: ArrayBuffer,
  seq: number
}

export interface MessageCredentialsInfo {
  party: ArrayBuffer,
  feed: ArrayBuffer,
  member: ArrayBuffer
}

export interface MessageEnvelope<T> {
  data: T,
  feed?: MessageFeedInfo,
  credentials?: MessageCredentialsInfo
  [key: string]: any
}

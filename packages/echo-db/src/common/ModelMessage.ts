//
// Copyright 2020 DXOS.org
//

export interface ModelData {
  [key: string]: any
}

export interface FeedInfo {
  key: Buffer,
  seq: number
}

export interface CredentialsInfo {
  party: Buffer,
  feed: Buffer,
  member: Buffer
}

export interface ModelMessage {
  data: ModelData,
  feed?: FeedInfo,
  credentials?: CredentialsInfo
  [key: string]: any
}

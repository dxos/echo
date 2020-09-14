import { InvitationDescriptor } from "./invitation-descriptor";

export type SecretProvider = (info: any) => Promise<Buffer>;

export type SecretValidator = (invitation: InvitationDescriptor, secret: Buffer) => Promise<boolean>;

export interface InviteDetails {
  secretProvider: SecretProvider
  secretValidator: SecretValidator
}

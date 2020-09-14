import { Invitation } from "../invitation";

export type SecretProvider = (info: any) => Promise<Buffer>;

export type SecretValidator = (invitation: Invitation, secret: Buffer) => Promise<boolean>;

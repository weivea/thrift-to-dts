import Int64 from "node-int64";

// types
import {
  ErrorType,
  CompressionType,
  KeycenterException,
} from "./keycenter_types";
/* ---include---------*/

/* ---import---------*/

export declare interface KeycenterAgent {
  batchEncrypt(
    sid: string,
    raw: Array<Buffer>,
    userOnlySecret: Buffer,
    compressType: CompressionType,
    callback: (err: any, data: Array<Buffer>) => void
  ): Promise<Array<Buffer>>;
  batchDecrypt(
    sid: string,
    cipher: Array<Buffer>,
    userOnlySecret: Buffer,
    compressType: CompressionType,
    callback: (err: any, data: Array<Buffer>) => void
  ): Promise<Array<Buffer>>;
  encrypt(
    sid: string,
    raw: Buffer,
    userOnlySecret: Buffer,
    compressType: CompressionType,
    callback: (err: any, data: Buffer) => void
  ): Promise<Buffer>;
  decrypt(
    sid: string,
    cipher: Buffer,
    userOnlySecret: Buffer,
    compressType: CompressionType,
    callback: (err: any, data: Buffer) => void
  ): Promise<Buffer>;
  makeSignature(
    sid: string,
    data: Buffer,
    callback: (err: any, data: Buffer) => void
  ): Promise<Buffer>;
  validateSignature(
    sid: string,
    data: Buffer,
    sign: Buffer,
    callback: (err: any, data: boolean) => void
  ): Promise<boolean>;
}
export declare const Client: KeycenterAgent;

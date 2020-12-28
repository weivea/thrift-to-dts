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
    raw: Array<Uint8Array>,
    userOnlySecret: Uint8Array,
    compressType: CompressionType,
    callback: (err: any, data: Array<Uint8Array>) => void
  ): Promise<Array<Uint8Array>>;
  batchDecrypt(
    sid: string,
    cipher: Array<Uint8Array>,
    userOnlySecret: Uint8Array,
    compressType: CompressionType,
    callback: (err: any, data: Array<Uint8Array>) => void
  ): Promise<Array<Uint8Array>>;
  encrypt(
    sid: string,
    raw: Uint8Array,
    userOnlySecret: Uint8Array,
    compressType: CompressionType,
    callback: (err: any, data: Uint8Array) => void
  ): Promise<Uint8Array>;
  decrypt(
    sid: string,
    cipher: Uint8Array,
    userOnlySecret: Uint8Array,
    compressType: CompressionType,
    callback: (err: any, data: Uint8Array) => void
  ): Promise<Uint8Array>;
  makeSignature(
    sid: string,
    data: Uint8Array,
    callback: (err: any, data: Uint8Array) => void
  ): Promise<Uint8Array>;
  validateSignature(
    sid: string,
    data: Uint8Array,
    sign: Uint8Array,
    callback: (err: any, data: boolean) => void
  ): Promise<boolean>;
}
export declare const Client: KeycenterAgent;

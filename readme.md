# thrift-to-dts

为 thrift for nodejs 编译 xxx.thrift 文件 生成的 xxxAgent.js 和xxx_types.js 生成对应的 xxxAgent.d.ts 和xxx_types.d.ts;

方便 ts 调用：


ps:   

该工具编译出来的xxx.d.ts只适用于node端

## install
npm install git+https://github.com/weivea/thrift-to-dts.git

## usage
```javascript
import genDts 'thrift-to-dts'
genDts('thrift/keycenter.thrift', 'gen-nodejs/').catch((e)=>{
  console.log('genThrift.dts ERROR:', e)
})
```

## example

```thrift
#keycenter.thrift
namespace java com.xxx.encrypt.decrypt.agent

enum ErrorType {
    CLIENT_ERROR = 0,
    SERVER_ERROR = 1
}
exception KeycenterException {
    1: required string message;
    2: required string causeStacktrace;
    3: optional ErrorType errorType;
}

enum CompressionType {
    NONE = 0,
    SNAPPY = 1 
}

service KeycenterAgent {


    list<binary> batchEncrypt(1: string sid, 2: list<binary> raw, 3: binary userOnlySecret, 4: CompressionType compressType)
        throws (1: KeycenterException ke);


    list<binary> batchDecrypt(1: string sid, 2: list<binary> cipher, 3: binary userOnlySecret, 4: CompressionType compressType)
        throws (1: KeycenterException ke);


    binary encrypt(1: string sid, 2: binary raw, 3: binary userOnlySecret, 4: CompressionType compressType)
        throws (1: KeycenterException ke);

 
    binary decrypt(1: string sid, 2: binary cipher, 3: binary userOnlySecret, 4: CompressionType compressType)
        throws (1: KeycenterException ke);


    binary makeSignature(1: string sid, 2: binary data)
        throws (1: KeycenterException ke);


    bool validateSignature(1: string sid, 2: binary data, 3: binary sign)
        throws (1: KeycenterException ke);
}

```

```javascript
//KeycenterAgent.d.ts
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




// keycenter_types.d.ts

  import Int64 from 'node-int64';
  import { Thrift } from "thrift";


  /* ---include---------*/
  

  /* ---typedef---------*/
  

  /* ---enum---------*/
  declare enum ErrorType {
      CLIENT_ERROR=0, 
SERVER_ERROR=1, 

    } 

declare enum CompressionType {
      NONE=0, 
SNAPPY=1, 

    } 


  /* ---const---------*/
  

  /* ---struct---------*/
  

  /* ---exception---------*/
  declare const KeycenterException: typeof Thrift.TException

  
```
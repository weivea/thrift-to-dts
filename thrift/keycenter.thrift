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

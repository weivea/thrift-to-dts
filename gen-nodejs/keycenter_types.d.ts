
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

  
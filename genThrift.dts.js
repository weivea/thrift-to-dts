#! /usr/bin/env node

/**
 * 为thrift生成的js文件 生成 *.d.ts 接口描述文件
 */

const fs = require('fs');
const path = require('path');
const thriftParser = require('thrift-parser');


genDts('thrift/tutorial.thrift', 'server/gen-nodejs/').catch((e)=>{
  console.log('genThrift.dts ERROR:', e)
})

/**
 * 
 * @param {*} fileName 
 * @param {*} outdir 
 */
async function genDts( fileName, outdir=__dirname) {
  const filePathName = path.resolve(__dirname, fileName)
  const str = await new Promise((resolve, reject)=>{
    fs.readFile(filePathName, {encoding: 'utf-8'}, (err, data)=>{
      if(err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
  const ast = thriftParser(str);

  const {typesFileName, exportNames} = await genTypesDts(ast, fileName, outdir);


  const serviceNames = await genServiceDts(ast, fileName, typesFileName, exportNames, outdir);

  return {
    typesFileName,
    serviceNames
  };
}

/**
 * 生成 xxx_types.d.tx
 * */ 
async function genTypesDts(ast, fileName, outdir) {
  
  const includeStr = genInclude(ast.include);
  const {
    exportNames: typedeNames,
    str: typedefStr
  } = genTypedef(ast.typedef);
  const {
    exportNames: enumNames,
    str: enumStr
  } = genEnum(ast.enum);
  const {
    exportNames: constNames,
    str: constStr
  } = genConst(ast.const);
  const {
    exportNames: structNames,
    str: structStr
  } = genStruct(ast.struct);
  const re = `
  import Int64 from 'node-int64';

  /* ---include---------*/
  ${includeStr}

  /* ---typedef---------*/
  ${typedefStr}

  /* ---enum---------*/
  ${enumStr}

  /* ---const---------*/
  ${constStr}

  /* ---struct---------*/
  ${structStr}

  `

  const exportNames = [...typedeNames, ...enumNames, ...constNames, ...structNames]

  // const dtsFilePathName =filePathName.replace(/\.thrift$/, '_types.d.ts');
  const typesFileName =fileName.replace(/\.thrift$/, '_types.d.ts').split('/').pop();
  const dtsFilePathName = path.resolve(outdir, typesFileName)
  await new Promise((resolve)=>{
    fs.writeFile(dtsFilePathName,re, (error, data)=>{
      console.log('gen', typesFileName, 'error:', error)
      resolve()
    })
  }) 
  return {typesFileName, exportNames};
}



// include转换
function genInclude (include) {
  if (!include) {
    return ''
  }
  return Object.entries(include).map(([name, {path}])=>{
    let _path = path.split('/').pop();
    if (!new RegExp('^\\.').test(_path) || !new RegExp('^/').test(_path)) {
      _path = "./" + _path
    }
    return `import * as ${name} from '${_path.replace(/\.thrift$/, '_types')}'; \n` 
  }).join('\n')
}

// typedef转换
function genTypedef(typedef) {
  if (!typedef) {
    return {
      exportNames:[],
      str: ''
    }
  }
  const exportNames =[]
  const declare = Object.entries(typedef).map(([name, {type}])=>{
    exportNames.push(name)
    return `export declare type ${name} = ${typeFactory(type)} \n` 
  }).join('\n')

  return {
    exportNames,
    str:declare
  };
}

/**
 * enum 转换
 * @param {*} enum
 */
function genEnum(_enum) {
  if (!_enum) {
    return {
      exportNames:[],
      str: ''
    }
  }
  const exportNames =[]
  const declare = Object.entries(_enum).map(([name, {items=[]}])=>{
    exportNames.push(name)
    return `declare enum ${name} {
      ${items.map(({name, value}, ind)=>{
        return `${name}=${value || ind}, \n`
      }).join('')}
    } \n` 
  }).join('\n')
  return {
    exportNames,
    str:declare
  };
}

/**
 * 转换 const
 * @param {*} _const 
 */
function genConst(_const) {
  if (!_const) {
    return {
      exportNames:[],
      str: ''
    }
  }
  const exportNames =[]

  const declare =  Object.entries(_const).map(([name, {type, value}])=>{
    exportNames.push(name)
    return `export const ${name}:${typeFactory(type)} = ${valueFactory(type, value)} ;\n` 
  }).join('\n')

  return {
    exportNames,
    str:declare
  };
}

/**
 * 转换 struct
 * @param {*} struct 
 */
function genStruct(struct) {
  if (!struct) {
    return {
      exportNames:[],
      str: ''
    }
  }
  const exportNames =[]

  const declare =  Object.entries(struct).map(([name, props=[]])=>{
    exportNames.push(name)

    return `export declare class ${name} {
      ${props.map(({name, type})=>{
        return `${name}: ${typeFactory(type)}`
      }).join('; \n')}
    } \n` 
  }).join('\n')
  return {
    exportNames,
    str:declare
  };
}


/**
 * 生成 xxService.d.ts
 * @param {*} ast 
 * @param {*} typesFileName 
 * @param {*} outdir 
 */
async function genServiceDts(ast, selfFileName, typesFileName, exportNames, outdir) {
  const service = ast.service
  if (!service) {
    return ''
  }

  const includeStr = await genInclude(ast.include);
  const importStr = await genImport(ast.include, selfFileName, outdir);

  const hStr = `
  import Int64 from "node-int64";

  // types
  import {${exportNames.join(', ')}} from './${typesFileName.replace(/\.d\.ts$/, '').split('/').pop()}';
  /* ---include---------*/
  ${includeStr}

  /* ---import---------*/
  ${importStr}
  
  `


  const names = await Promise.all(Object.entries(service).map(async ([name, {extends:_extends, functions={}}])=>{
    let re = `export declare interface ${name} ${_extends ? `extends ${_extends.split('.').pop()}`: ''} {
      ${
        Object.entries(functions).map(([key, {name, args, type, oneway}])=>{
          return `${name}(${genArgs(args)} ${(args && args.length && !oneway) ? ',': ''} ${genCallback(oneway, type)}): void;`
        }).join(' \n')
      }
    } \n` 
    re +=  `export declare const Client: ${name}; \n`

    re = hStr + re;

    const outFileName = `${name}.d.ts`;
    const outFilePathName = path.resolve(outdir, outFileName)
    // 写入文件
    await new Promise((resolve)=>{
      fs.writeFile(outFilePathName,re, (error, data)=>{
        console.log('gen', outFileName, 'error:', error)
        resolve()
      })
    })
    return name
  }))

  return names
}

async function genImport(include, selfFileName, outdir) {
  if (!include) {
    return ''
  }

  const dir = path.parse(selfFileName).dir

  return (await Promise.all(Object.entries(include).map( async ([name, {path:_path}])=>{
    const {serviceNames} = await genDts(path.resolve(dir, _path), outdir)
    const re = serviceNames.map((name)=>{
      return `import {${name}} from './${name}'; \n`
    }).join('')
    return re;
  }))).join('\n')
}

function genArgs(args) {
  return args.map(({type, name})=>{
    return `${name}:${typeFactory(type)}`
  }).join(', ')
}
function genCallback(oneway, type) {
  if (oneway) {
    return ''
  }
  return ` callback: (err:any, data:${typeFactory(type)})=>void`
}


function typeFactory(type) {
  const name = type.name || type;
  if (typeNamePap[name]) {
    return typeNamePap[name](type);
  } else {
    return type
  }
}

const typeNamePap = {
  list: function({valueType}) {
    return `Array<${typeFactory(valueType)}>`
  },
  set: function({valueType}) {
    return `Array<${typeFactory(valueType)}>`
  },
  map: function({keyType, valueType}) {
    return `{[key:string]: ${typeFactory(valueType)}}`
  },
  bool: ()=> 'boolean' ,
  byte: ()=> 'number' ,
  i16: ()=> 'number'  ,
  i32 : ()=> 'number' ,
  i64: ()=> 'Int64'  ,
  double: ()=> 'number'  ,
  string: ()=> 'string' ,
  binary: ()=> 'Uint8Array' ,
}

function valueFactory(type, value) {
  const name = type.name || type;
  if (typeValueMap[name]) {
    return typeValueMap[name](type, value);
  } else {
    return value
  }
}

const typeValueMap = {
  string:(_, value) => `'${value}'`,
  list: function({valueType},value) {
    return `[
      ${value.map((item)=>{
        return valueFactory(valueType, item);
      }).join(', \n')}
    ]`
  },
  map: function({valueType}, value) {
    return `{
      ${value.map(({key, value})=>{
        return `${key}: ${valueFactory(valueType, value)}`
      }).join(', \n')}
    }`
  },
  set: function({valueType},value) {
    return `[
      ${value.map((item)=>{
        return valueFactory(valueType, item);
      }).join(', \n')}
    ]`
  },
}
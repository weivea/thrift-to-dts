//.eslintrc.js
module.exports={
  root: true,
  "env": {
    "es6": true, // 支持新的 ES6 全局变量，同时自动启用 ES6 语法支持
    "node": true // 启动node环境
  },
  "parser": "babel-eslint",
  // "plugins": ["prettier"],
  "extends": ['eslint:recommended'/* , "plugin:prettier/recommended" */],
  "rules": {
    "no-unused-vars": "warn"
  }
}
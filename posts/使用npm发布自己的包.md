---
title: 使用npm发布自己的包
date: 2026-08-27
tags:
  - npm
  - nodejs
  - package
---

## 发布包

### 创建 npm 账号

先去[npm官网](https://www.npmjs.com/)创建一个账户用来维护我们的npm包

创建一个token,并配置读写权限，勾选绕过2FA，或者也可以使用OTP

![image-20260827155924184](https://files.seeusercontent.com/2026/08/27/f2Sg/image-20260827155924184.png)

### 创建 npm 包

新建一个目录，运行`pnpm init`（当然可以用其他包管理器）

包名要唯一，其他的按需填写

```json
{
  "name": "npm-helloworld-lorlike",
  "version": "1.0.0",
  "description": "test npm package release",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["npm","hello-world"],
  "author": "lorlike",
  "license": "ISC",
  "type": "module"
}
```

```js
console.log("hello world")
```

### npm 包上传 Github（可选） 

上[github](https://github.com)创建一个仓库上传即可，后续步骤可以写到github的workflow里进行CI/CD

### npm 包发布

1. 检查 npm源，如果修改了源，则需要改回 npm官方源

   ```bash
   pnpm config get registry
   # https://registry.npmmirror.com/
   
   pnpm config set registry https://registry.npmjs.org/
   ```

2. 登陆自己npm账户，配置token，发布

   ```bash
   pnpm login
   
   pnpm config set //registry.npmjs.org/:_authToken=你的令牌
   
   pnpm publish
   ```
   
   ```bash
   📦 npm-helloworld-lorlike@1.0.0 → https://registry.npmjs.org/
   ✅ Published package npm-helloworld-lorlike@1.0.0
   ```

### npm 包使用

```bash
pnpm init
pnpm add npm-helloworld-lorlike
```

```js
import "npm-helloworld-lorlike"
```

```bash
node index.js
# hello world
```

成功输出

### 更新 npm 包

修改版本号后重新发布

```bash
pnpm version xxx # 显性指定版本号
pnpm version patch # 自动添加小版本号
pnpm publish
```

### 删除npm包

因为依赖问题，npm不鼓励删除包，如果一个包不维护了官方更推荐使用弃用而非删除，所以对删除有一些限制

- 删除的版本24小时后方可重发

- 只有发布72小时之内的包可以删除

可以到官网里找到自己的包在settings进行删除

![image-20260827162048118](https://files.seeusercontent.com/2026/08/27/3sdB/image-20260827162048118.png)

```bash
pnpm rm npm-helloworld-lorlike
pnpm store prune # 刷新缓存
pnpm add npm-helloworld-lorlike
# [ERR_PNPM_UNPUBLISHED_PKG] No versions available for npm-helloworld-lorlike because it was unpublished
```

### 作用域包

- 没有作用域的包是公共的
- 私有包一定有作用域
- 有作用域的包默认是私有的，想要创建有作用域的公共包必须使用`--access public`标志

在package里的包名添加作用域前缀，再进行发布

```json
{
  "name": "@lorlike/npm-helloworld-lorlike",
  "version": "1.0.0",
  "description": "test npm package release",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "hello-world"
  ],
  "author": "lorlike",
  "license": "ISC",
  "type": "module"
}
```

```bash
pnpm publish --access public
📦 @lorlike/npm-helloworld-lorlike@1.0.0 → https://registry.npmjs.org/
✅ Published package @lorlike/npm-helloworld-lorlike@1.0.0
```


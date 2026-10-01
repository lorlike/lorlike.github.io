---
title: mise管理项目级开发工具及环境
date: 2026-10-01
tags:
  - env
  - dev
---

## 快速入门

到[官网](https://mise.jdx.dev/)下载mise，我使用nix安装，全局的工具版本我都通过nix文件来管理了，文章只涉及项目级管理

我的zsh使用了mise的hook脚本`mise activate zsh`，这使我cd进目录后会自动探查mise配置文件并加载但不会直接安装缺失版本

```bash
mise exec node@24 -- node --version
```

运行上面命令会自动安装node 24，并执行`node --version`显示版本信息

```bash
mise use node@24
```

这会创建一个文件mise.toml，并写入版本信息，你也可以接着添加环境变量，例如`NODE_ENV`

```toml
[tools]
node = "24"

[env]
NODE_ENV = "development"
```

> 当然你也可以使用.env文件来管理环境变量

```bash
[tasks.hello]
description = "Print the project's Node.js version and environment"
run = '''node -e "console.log(process.version, process.env.NODE_ENV)"'''
```

添加上面那段使用`mise run hello`能够执行一段shell命令，官方称其为任务

```bash
mise install
```

运行这条命令就能完全安装并应用项目的mise配置了

> 如果项目配置文件版本不在mise已安装的列表里，那么mise不会使用可用的版本进行替代进行使用

```bash
mise registry # 查看mise支持的工具
mise use ripgrep # 安装并使用riggrep
mise exec -- rg --version # 
```

mise不只支持开发工具，根据需要选择工具来打造一个尽可能相似的环境


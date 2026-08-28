---
title: 安装Windows包管理器scoop
date: 2026-08-28
tags:
  - package
  - windows
---

## 使用环境变量指定安装路径

右键**此电脑**，选**属性**，在打开的窗口点击**环境变量**进行设置`SCOOP`和`SCOOP_GLOBAL`（两个不同目录）

## 安装scoop

到[官网](https://scoop.sh/)查找安装方式，确保powershell版本在5.1以上

```powershell
$PSVersionTable.PSVersion
```

运行下面的命令安装

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

连不上就设置环境变量`HTTP_PROXY`和`HTTPS_PROXY`使用代理

## 设置镜像源

```powershell
scoop config SCOOP_REPO "https://gitee.com/scoop-installer/scoop" 
scoop update
```

## 代理设置

```powershell
scoop config proxy 127.0.0.1:7897 # 设置代理
scoop config rm proxy # 取消代理
```


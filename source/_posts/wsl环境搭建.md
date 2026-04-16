---
title: wsl环境搭建
date: 2026-04-16 13:23:10
tags: 
  - 环境配置
  - linux
---

# wsl环境搭建

## 我的环境参数

Windows 11 家庭中文版 23H2

任务管理器 -> 性能 -> CPU -> 虚拟化：已启用

更新时间：2026年3月10日

## 打开WSL功能

### 打开设置

Win+S快捷键

### 系统->可选功能->更多Windows功能 勾选3项

![image-20260310124514887](https://files.seeusercontent.com/2026/03/10/n9sH/20260310124527.png)

按提示重启电脑

## 配置WSL

打开

### 更新WSL

```powershell
wsl --update
```

### 查看版本信息

```powershell
wsl --version
```

### 设置默认的WSL默认的Linux分发版本

```powershell
wsl --set-default-version
```

### 查看可用Linux发行版(默认为Ubuntu)

```powershell
wsl -l -o
```

访问不了可以配置代理或修改hosts使自己能访问github

## 安装Linux

```powershell
wsl --install # 安装默认版本
wsl --install -d <发行版本> # 可选选项，安装指定发行版本
```

下载完成会自动启动，配置用户名和密码

## 启动

shell中输入

```powershell
wsl
```

## 配置apt包管理器镜像

### 备份原来的源

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
sudo cp -r /etc/apt/sources.list.d/ /etc/apt/sources.list.d.backup/
```

### 加入阿里云镜像

打开文件

```
sudo nano /etc/apt/sources.list
```

加入阿里云镜像

```
deb https://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
```

ctrl+X,Y,Enter保存

## WSL管理

### 指令

```powershell
wsl -l --running # 查看运行中的Linux，访问bash和linux的文件就会自动启动，退出后自动关闭
# 创建备份当快照用
wsl --export <Linux版本> <存放路径> # 导出备份
wsl --unregister <Linux版本> # 删除系统
wsl --import <Linux版本> <存放路径> <备份路径> # 恢复备份
wsl --shutdown # 关闭所有运行中的Linux
```

### 文件管理

```
/mnt # linux->Windows
\\wsl$\<Linux版本> # Windows->linux	
```

## 设置默认终端

Win+I搜索终端

终端里把**让Windows决定**改为**Windows终端**

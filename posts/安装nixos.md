---
title: 安装nixos
date: 2026-08-30
tags:
  - os
  - linux
published: false
---

## 下载ISO镜像

官网下载喵

## 验证启用UEFI 

```bash
ls /sys/firmware/efi/efivars  # 列出 EFI 变量
```

## 配置root用户密码

```bash
sudo -i # 进入root用户
passwd # 设置root用户密码
```

## 网络配置

我使用的有线网络，直接能连上

```bash
ping www.baidu.com -c 4 #测试网络
```

## 使用ssh工具连接

```bash
ip a # 查看ip
```

之后使用ssh工具登录root账号，我用的**MobaXterm**

## 分区

```bash
lsblk # 查看磁盘信息，我的是sda
cfdisk /dev/sda # 进入tui进行分区，选择gpt模式
```

建三个分区，分别是boot，swap，root

- boot：给1G，设置**Type**为**EFI System**
- swap：根据内存的大小设置大小，设置**Type**为**Linux Swap**
- root：主要分区，默认就是**Linux filesystem**类型

**选择write，输入yes设置来应用设置**

再次输入`lsblk`检查更改

PS：如果需要用户数据与系统分离，可以在设置一个文件系统分区挂载到home目录上

## 格式化分区

```bash
mkfs.fat -F 32 -n boot /dev/sda1 # 格式化boot分区，-n代表设置Label
mkswap -L swap /dev/sda2 # 格式化swap分区，-L代表设置Label
mkfs.ext4 -L nixos /dev/sda3 # 格式化root分区，-L代表设置Label
```

## 挂载分区

```bash
mount /dev/disk/by-label/nixos /mnt
mkdir -p /mnt/boot
mount /dev/disk/by-label/boot /mnt/boot
swapon /dev/disk/by-label/swap

lsblk # 查看挂载情况
```

## 配置系统

```bash
nixos-generate-config --root /mnt # 生成配置文件
vim /mnt/etc/nixos/configuration.nix # 编辑配置文件
```

## 安装系统

使用下面其中一条命令进行安装

```bash
nixos-install # 从官方进行安装
nixos-install --option substituters https://mirrors.ustc.edu.cn/nix-channels/store # 使用中科大源安装
```

完成后会提示设置root密码，设置一下即可

## 设置用户密码

```bash
nixos-enter --root /mnt -c "passwd lorlike" # 这里lorlike是我的用户名
```

## 重启完成安装

```bash
reboot
```

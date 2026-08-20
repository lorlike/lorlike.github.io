---
title: Go文件嵌入embed
date: 2026-03-24 23:35:33
tags: Go
---

## 作用

go:embed可以把文件打包到二进制文件中，通过读取内存的方式获取内容

## 嵌入单文件

```
│  hello.txt
│  main.go
```

上面是目录结构

```go
package main

import (
	_ "embed"
	"fmt"
)

//go:embed hello.txt
var s string

func main() {
	fmt.Println(s)
}

// Hello World!
```

这里的注释标记把`hello.txt`的内容存到s中，所以注释不能删

也可以把数据解析成字节切片`[]byte`

```go
package main

import (
	_ "embed"
	"fmt"
)

//go:embed hello.txt
var s []byte

func main() {
	fmt.Println(s)
}

// [72 101 108 108 111 32 87 111 114 108 100 33]
```

## 嵌入文件夹

目录结构

```
│  main.go
│      
└─test
        hello.txt
```

```go
package main

import (
	"embed"
	"fmt"
	"io"
)

//go:embed test
var f embed.FS

func main() {
	open, err := f.Open("test/hello.txt")
	if err != nil {
		panic(err)
	}
	defer open.Close()
	all, err := io.ReadAll(open)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(all))
}

// Hello World!
```


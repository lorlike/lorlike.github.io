---
title: Go日志logrus
date: 2026-03-24 18:47:17
tags: Go
---

## 安装

```bash
go get github.com/sirupsen/logrus
```

## 使用

```go
package main

import (
  "github.com/sirupsen/logrus"
)

func main() {
  logrus.SetLevel(logrus.TraceLevel)

  logrus.Trace("trace msg")
  logrus.Debug("debug msg")
  logrus.Info("info msg")
  logrus.Warn("warn msg")
  logrus.Error("error msg")
  logrus.Fatal("fatal msg")
  logrus.Panic("panic msg")
}


//time="2026-03-24T18:46:26+08:00" level=trace msg="trace msg"
//time="2026-03-24T18:46:26+08:00" level=debug msg="debug msg"
//time="2026-03-24T18:46:26+08:00" level=info msg="info msg"
//time="2026-03-24T18:46:26+08:00" level=warning msg="warn msg"
//time="2026-03-24T18:46:26+08:00" level=error msg="error msg"
//time="2026-03-24T18:46:26+08:00" level=fatal msg="fatal msg"
```

- `Panic`：记录日志，然后`panic`。

- `Fatal`：致命错误，出现错误时程序无法正常运转。输出日志后，程序退出；

- `Error`：错误日志，需要查看原因；

- `Warn`：警告信息，提醒程序员注意；

- `Info`：关键操作，核心流程的日志；

- `Debug`：一般程序中输出的调试信息；

- `Trace`：很细粒度的信息，一般用不到；

`logrus.SetLevel`设置输出级别，默认的级别为`InfoLevel`

### 输出文件名

`logrus.SetReportCaller(true)`

### 添加字段

`logrus.WithField`和`logrus.WithFields`，接受`logrus.Fields`参数，这是一个map，`map[string]interface{}`

```go
package main

import (
  "github.com/sirupsen/logrus"
)

func main() {
  logrus.WithFields(logrus.Fields{
    "name": "dj",
    "age": 18,
  }).Info("info msg")
}

// time="2026-03-24T18:51:47+08:00" level=info msg="info msg" age=18 name=dj
```

### 重定向

`logrus.SetOutput`接受一个`io.Writer`参数作为日志的输出对象，使用`io.MultiWriter`可以实现多个输出

```go
package main

import (
	"bytes"
	"io"
	"log"
	"os"

	"github.com/sirupsen/logrus"
)

func main() {
	writer1 := &bytes.Buffer{}
	writer2 := os.Stdout
	writer3, err := os.OpenFile("log.txt", os.O_WRONLY|os.O_CREATE, 0755)
	if err != nil {
		log.Fatalf("create file log.txt failed: %v", err)
	}

	logrus.SetOutput(io.MultiWriter(writer1, writer2, writer3))
	logrus.Info("info msg")
}
```

### 设置输出格式

json

```go
logrus.SetFormatter(&logrus.JSONFormatter{})
```


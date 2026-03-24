---
title: Go使用viper编写配置文件
date: 2026-03-24 17:33:09
tags: Go
---

## 安装

```go
go get github.com/spf13/viper
```

## 读取配置文件

支持JSON、TOML、YAML、HCL、envfile和Java properties格式

```

│  main.go  
└─config
        config.go
        config.yml
```

比如我的目录像上面那样

```yaml
# config.yml

app: # 应用基本配置
  env: local # 环境名称
  port: 8888 # 服务监听端口号
  app_name: demo # 应用名称
  app_url: http://localhost # 应用访问地址

PostgreSQL:
  host: localhost
  port: 5432
  user: postgres
  password: 123456
  db_name: demo
```

## 通过文件读取配置信息

可以通过SetConfigName设置识别的配置文件名（不包括扩展名），AddConfigPath添加扫描的配置路径，可以多次调用扫描多个目录，键名对大小写不敏感

```go
package main

import (
	"fmt"

	"github.com/spf13/viper"
)


func main() {
	viper.SetConfigName("config")
	viper.AddConfigPath("./config")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
	fmt.Printf("%+v\n", viper.AllSettings())
	get := viper.Get("PostgreSQL.user")
	fmt.Println(get.(string))
	fmt.Println(viper.GetString("postgresql.user"))
}

// map[app:map[app_name:demo app_url:http://localhost env:local port:8888] postgresql:map[db_name:demo host:localhost password:123456 port:5432 user:postgres]]
// postgres
// postgres
```

## 将配置封装成对象

这样做的原因是因为通过字符串寻找配置项不能通过ide进行补全，容易写错

这里有个[在线工具](https://zhwt.github.io/yaml-to-go/)可以把yaml格式的配置信息转成结构体，无需手动编写

```go
package config

type Config struct {
	App struct {
		Env     string `yaml:"env"`
		Port    int    `yaml:"port"`
		AppName string `yaml:"app_name"`
		AppURL  string `yaml:"app_url"`
	} `yaml:"app"`
	PostgreSQL struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		User     string `yaml:"user"`
		Password int    `yaml:"password"`
		DbName   string `yaml:"db_name"`
	} `yaml:"PostgreSQL"`
}

```

```go
package main

import (
	"comfig/config"
	"fmt"

	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigName("config")
	viper.AddConfigPath("./config")
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
	var cfg config.Config
	err = viper.Unmarshal(&cfg)
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s \n", err))
	}
	fmt.Println(cfg)
	fmt.Println(cfg.PostgreSQL.DbName)
}

// {{local 8888 demo http://localhost} {localhost 5432 postgres 123456 demo}}
// demo
```

yaml文件的字段不能用_，否则不能解析

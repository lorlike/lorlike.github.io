---
title: Go令牌jwt
date: 2026-03-24 19:06:26
tags: Go
---

## 前言

jwt是一种用于用户认证的数字签名解决方案，形式为`header.payload.signature`，数据用base64进行编码，`signature`是把前面的数据与密钥结合进行计算hash的结果，下面是一种hash算法计算`signature`的方式

```
HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret
)
```

`payload`可以添加数据，在校验时会据此有不同的处理，比如可以加入时间戳限定有效期，加入用户名等标识进行用户认证

## 安装

```go
go get github.com/golang-jwt/jwt/v5
```

## 使用

```go
package main

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(name string) (string, error) {
	claims := jwt.RegisteredClaims{
		// 设置过期时间，这里设置一个小时后过期
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
		// 颁发时间
		IssuedAt: jwt.NewNumericDate(time.Now()),
		//主题: 标识 Token 的主体，通常是用户 ID 或用户名
		Subject: name,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(signKey)
}

func ParseToken(tokenStr string) (jwt.RegisteredClaims, error) {
	var claims jwt.RegisteredClaims
	//第一个值是token
	//第二个值是我们之后需要把解析的数据存放的指针
	//第三个是回调函数，用于返回验证的秘钥，因为秘钥可以是与claims的内容相关的
	token, err := jwt.ParseWithClaims(tokenStr, &claims, func(token *jwt.Token) (interface{}, error) {
		return signKey, nil
	})
	if err != nil && !token.Valid {
		err = errors.New("invalid Token")
	}
	return claims, err
}

var signKey = []byte("AllYourBase")

func main() {

	token, err := GenerateToken("admin")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(token)
	parseToken, err := ParseToken(token)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Printf("%+v", parseToken)

}
```

可以自定义Claims，只要嵌入jwt.RegisteredClaims，就实现了这个结构体的接口，可以添加更多的属性到payload里

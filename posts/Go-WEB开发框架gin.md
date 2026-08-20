---
title: Go WEB开发框架gin
date: 2026-03-24 23:52:29
tags: Go
---

## 安装

```bash
go get github.com/gin-gonic/gin
```

## 路由

### HTTP方法

常用的GET，POST，PUT，DELETE都支持，还支持一些不常用的方法

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	//使用gin.H，其实就是一个map映射map[string]any，可以快速创建一个json格式的数据作为响应的结果
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

type User struct {
	ID   uint
	Name string
}

func posting(c *gin.Context) {
	// 也可以是一个结构体，也能被转换成json形式作为响应结果
	c.JSON(http.StatusOK, User{
		ID:   1,
		Name: "Tom",
	})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// 创建一个默认路由
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// 默认监听8080端口
	router.Run()
	// router.Run(":3000") 指定端口
}

```


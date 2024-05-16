# Awam-Stock

一套基于 TypeScript 的股市工具
自用自主开发，退坑股市，分享出来交流学习（不会维护和更新）
部分股软交互和接口使用 Python 第三方库

## 特点

+ TypeScript 全栈项目，尽可能的复用数据结构和代码，90%以上的类型化
+ 完善的工程体系：打包、lint、类型化、运行时，个人稳定运行2年多
+ websocket实现数据实时的推送
+ 个人股市学习的工具化，面向短线操作

## 项目结构

使用 pnpm 进行项目管理，muti-repo项目结构

### shared

项目公共依赖，包含配置系统、公共类型、工具函数

#### 配置系统

可以从配置目录，了解可配置变量，基本思路是从环境变量和环境变量配置文件中读取，参考[dotenv](https://www.npmjs.com/package/dotenv)
dotenv
packages\shared\src\config\index.ts

### model

尝试从data出发，创建随处可用的 model

### db

+ 数据来源于公开接口，这同时代表着不稳定

### server

Next.js

## 使用

所有子项目的dev, build, start 参考package.json

## 说明

- xxx

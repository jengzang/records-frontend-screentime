# 屏幕使用时间

手机和电脑屏幕使用时间分析平台前端

## 项目简介

本项目是个人数据分析平台的屏幕使用时间模块，用于分析和可视化手机和电脑的屏幕使用时间数据。

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 数据说明

### 数据来源
- Vivo X90 手机屏幕使用时间
- 平板屏幕使用时间
- ManiTime（电脑屏幕使用时间）

### 数据存储
- SQLite数据库
- WAL模式开启

## 核心功能（规划中）

1. 手机屏幕使用时间统计
2. 电脑屏幕使用时间统计
3. 应用使用时长分析
4. 时间维度分析
5. 使用习惯分析
6. 数据可视化展示

## 运行方式

### 开发环境
```bash
npm install
npm run dev
```

### 生产构建
```bash
npm run build
npm run preview
```

## 部署说明

- 部署路径：record.yzup.top/screentime
- 基础路径配置：/screentime/

## 更新日志

### 2026-02-19
- 初始化项目结构
- 配置 React + TypeScript + Tailwind CSS
- 创建基础项目框架

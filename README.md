# newapi-help · 客户接入文档站

面向 NewAPI 用户的静态接入文档站，介绍如何调用平台上的各类大模型接口（Claude / GPT / Gemini / 图片 / 视频 / TTS）。
内容源自 [`kjapi-customer-usage-2026-06-01.md`](./kjapi-customer-usage-2026-06-01.md)。

## 目录结构

```
newapi-help/
├── kjapi-customer-usage-2026-06-01.md   # 内容源文档（不部署）
└── site/                                # ← 部署根目录
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

`site/` 是纯静态、零依赖的可部署产物，**部署时只需上传 `site/` 这一个文件夹**。

## 功能

- 单页文档站，左侧固定导航，滚动自动高亮当前章节
- 代码示例支持 cURL / Python 等 Tab 切换
- 每个代码块一键复制
- 深色 / 浅色主题切换（记忆偏好，首次跟随系统）
- 响应式，移动端抽屉式导航

## 本地预览

直接用浏览器打开 `site/index.html` 即可（无需构建、无需服务器）。

## 部署到 Cloudflare Pages（直接上传，最简单）

1. 登录 <https://pages.cloudflare.com/> → 创建项目 → 选择 **直接上传（Direct Upload）**。
2. 把 **`site/` 文件夹**整个拖入页面上传（根目录需含 `index.html`）。
3. Cloudflare 立即部署，生成预览域名。
4. 在 **自定义域名** 中绑定目标域名；域名已托管在 Cloudflare 时会自动添加 DNS，保存后等 1–5 分钟 SSL 生效。
5. 将该域名链接到 NewAPI 后台的「文档」按钮。

> 后续内容更新：编辑 `site/` 下文件后，重新上传该文件夹覆盖即可。

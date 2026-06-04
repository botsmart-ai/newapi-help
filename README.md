# 大模型 API 接入文档站

面向 API 用户的静态接入文档，介绍如何调用平台上的各类大模型接口（Claude / GPT / Gemini / 图片 / 视频 / TTS）。
单页、零依赖、可直接静态托管。

## 复用 / 多平台部署

页面主体**不含任何域名或品牌**。base url 默认取**当前访问域名**（`window.location.origin`），所以同一份代码部署到不同域名即自动适配，源码层面零关联。

通过 `site/js/config.js` 可选覆盖：

```js
window.SITE_CONFIG = {
  baseUrl: "",          // 留空 = 自动用当前访问域名（同域反代，推荐）；或显式填 API 域名
  brandName: "",        // 留空 = 只显示中性文案，不强调任何品牌
  title: "API 接入文档",
  footerText: "客户接入文档"
};
```

> **同域前提：** 文档示例里的 base url 是给客户复制去调用的，因此该访问域名必须能承接 API 请求 —— 需在此域名上把 `/v1/*`、`/v1beta/*` 等路径反代到真实上游网关。否则 `baseUrl` 请显式填写独立的 API 域名。
>
> 若希望两个站点对外**没有关联**，请用两个相互独立的仓库分别部署。

## 目录结构

```
site/                  ← 部署根目录
├── index.html
├── css/style.css
└── js/
    ├── config.js      站点配置（域名 / 品牌，按部署各自维护）
    └── main.js        交互逻辑
```

## 功能

- 单页文档，左侧固定导航 + 滚动高亮
- cURL / Python 等 Tab 切换、代码一键复制
- 深 / 浅色主题切换（记忆偏好，首次跟随系统）
- 响应式，移动端抽屉式导航

## 本地预览

直接用浏览器打开 `site/index.html`（无需构建、无需服务器）。

## 部署到 Cloudflare Pages

- **连接 Git：** 构建命令留空，**输出目录（Build output directory）设为 `site`**。
- **或直接上传：** 把 `site/` 文件夹整个拖入 Direct Upload。
- 部署后在「自定义域」绑定域名，HTTPS 自动签发。

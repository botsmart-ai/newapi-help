/* ============================================================
   站点配置 — 每个部署各自维护，互不关联
   ------------------------------------------------------------
   originMap：访问域名 → API base URL 的显式映射表。
     key   = 文档站的访问 origin（完整，含协议，不含末尾斜杠）
     value = 该站对应的 API base URL
   未在表中命中时，自动把访问域名的二级子域替换为 api。
   例：https://apihelp.chinarouter.net → https://api.chinarouter.net
   本地 file:// 预览时使用占位 https://api.example.com。
   ============================================================ */
window.SITE_CONFIG = {
  originMap: {
    "https://apihelp.botsmart.net":   "https://kjapi.botsmart.net",
    "https://apihelp.chinarouter.net": "https://api.chinarouter.net"
  },
  platformMap: {
    "https://apihelp.botsmart.net":   "kjapi",
    "https://apihelp.chinarouter.net": "overseas"
  },
  defaultPlatform: "kjapi",
  brandName:  "",
  title:      "API 接入文档",
  footerText: "客户接入文档"
};

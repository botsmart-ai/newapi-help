# ChinaRouter Seedance 2.0 调用说明

**接口地址：** `https://chinarouter.net`

## 模型

| 模型名 | 特点 |
|--------|------|
| `doubao-seedance-2-0-260128` | 标准版，画质更好 |
| `doubao-seedance-2-0-fast-260128` | 快速版，生成更快 |

---

## 调用流程

视频生成是**异步任务**，分两步：提交 → 轮询。

---

### 第一步：提交生成任务

```bash
curl https://chinarouter.net/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "一个中国男孩在挥舞一把宝剑",
    "resolution": "720p",
    "ratio": "16:9",
    "duration": 4,
    "generate_audio": false
  }'
```

**返回：**
```json
{
  "id": "task_tWMn92G8XyCXXPjAayw9KaxJQGCroxze",
  "task_id": "task_tWMn92G8XyCXXPjAayw9KaxJQGCroxze",
  "status": "queued"
}
```

---

### 第二步：轮询任务状态

```bash
curl https://chinarouter.net/v1/video/generations/{task_id} \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**生成中：**
```json
{
  "data": {
    "status": "IN_PROGRESS",
    "progress": "50%"
  }
}
```

**生成完成：**
```json
{
  "data": {
    "status": "SUCCESS",
    "progress": "100%",
    "result_url": "https://data.yourouter.ai/ark-video/.../task.mp4?sign=..."
  }
}
```

拿到 `result_url` 直接下载即可，链接有效期约 7 天。

---

## 参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | 模型名，见上表 |
| `prompt` | string | 视频描述，中英文均可 |
| `resolution` | string | `480p` / `720p` / `1080p` |
| `ratio` | string | `16:9` / `9:16` / `1:1` |
| `duration` | int | 时长（秒），建议 4–8 |
| `generate_audio` | bool | 是否生成背景音（默认 false） |

---

## 典型耗时参考

| 视频长度 | 标准版 | 快速版 |
|----------|--------|--------|
| 4 秒 | ~2–3 分钟 | ~1–2 分钟 |
| 8 秒 | ~4–5 分钟 | ~2–3 分钟 |

建议每隔 **30 秒**轮询一次，最多等待 10 分钟超时。

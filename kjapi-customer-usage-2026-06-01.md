# KJAPI 客户接入说明（2026-06-01）

本文档面向技术接入方，以及会自动生成接入代码的 AI 助手。

文档内容基于 2026-05-28 至 2026-06-01 对 `https://kjapi.botsmart.net` 的实际测试结果整理。为了降低接入歧义，本文档对每类模型只给出一个调用方法。

## 1. 基本信息

- Base URL：`https://kjapi.botsmart.net`
- Bearer Key：`<YOUR_API_KEY>`
- 模型列表接口：`GET /v1/models`
- 本文档适用路径：`via-kjapi`

说明：

- 同一个 API Key 可访问当前账号下全部已开放模型。
- 接入时请直接按本文档给出的方式调用。
- 如果只是想先验证 key 是否可用，建议先调用 `/v1/models`。

## 2. 快速连通性测试

```bash
curl "https://kjapi.botsmart.net/v1/models" \
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

返回 `success: true` 且能看到 `data` 数组，说明 key 和平台链路正常。

## 3. 模型分类与接入方式

### 3.1 Claude 模型

以下 Claude 模型使用 **Anthropic 协议**：

- `claude-haiku-4-5-20251001`
- `claude-opus-4-6`
- `claude-opus-4-7`
- `claude-sonnet-4-6`

接口：

- `POST /v1/messages`

### 3.2 GPT / DeepSeek / GLM / Kimi / Qwen 文本模型

以下文本模型使用 **OpenAI 协议**：

- `gpt-5.2`
- `gpt-5.3-codex`
- `gpt-5.4`
- `gpt-5.5`
- `DeepSeek-V4-Flash`
- `DeepSeek-V4-Pro`
- `glm-4.7`
- `glm-5`
- `GLM-5.1`
- `GLM-5V-Turbo`
- `Kimi-K2.6`
- `qwen3.6-flash`
- `qwen3.6-max-preview`
- `qwen3.6-plus`

接口：

- `POST /v1/chat/completions`

### 3.3 Gemini 模型

以下 Gemini 模型使用 **Gemini 原生协议**：

- `gemini-3-flash-preview`
- `gemini-3-pro-preview`
- `gemini-3.5-flash`
- `gemini-3.1-pro-preview`

接口：

- `POST /v1beta/models/{model}:generateContent`

以下 Gemini 图像相关模型使用 **Gemini 原生协议**：

- `gemini-3-pro-image-preview`
- `gemini-3.1-flash-image-preview`

接口：

- `POST /v1beta/models/{model}:generateContent`

### 3.4 图片模型

以下图片模型使用 **OpenAI Images 协议**：

- `gpt-image-2`

接口：

- `POST /v1/images/generations`

### 3.5 视频模型

以下视频模型使用 **视频任务接口**：

- `happyhorse-1.0-t2v`
- `happyhorse-1.0-i2v`
- `happyhorse-1.0-r2v`
- `happyhorse-1.0-video-edit`

接口：

- `POST /v1/videos`
- `GET /v1/videos/{task_id}`

### 3.6 TTS 模型

以下 TTS 模型使用 **OpenAI Audio Speech 协议**：

- `qwen3-tts-flash`
- `MiniMax/speech-2.8-turbo`
- `MiniMax/speech-2.8-hd`

接口：

- `POST /v1/audio/speech`

## 4. 调用示例

### 4.1 Claude：Anthropic 协议

#### cURL

```bash
curl "https://kjapi.botsmart.net/v1/messages" \
  -H "x-api-key: <YOUR_API_KEY>" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "请用一句话介绍你自己"}
    ]
  }'
```

#### Python

```python
import requests

resp = requests.post(
    "https://kjapi.botsmart.net/v1/messages",
    headers={
        "x-api-key": "<YOUR_API_KEY>",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    },
    json={
        "model": "claude-sonnet-4-6",
        "max_tokens": 1024,
        "messages": [
            {"role": "user", "content": "请用一句话介绍你自己"}
        ],
    },
    timeout=120,
)

resp.raise_for_status()
print(resp.json()["content"][0]["text"])
```

### 4.2 GPT / DeepSeek / GLM / Kimi / Qwen 文本：OpenAI 协议

#### cURL

```bash
curl "https://kjapi.botsmart.net/v1/chat/completions" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4",
    "messages": [
      {"role": "user", "content": "请用一句话介绍你自己"}
    ],
    "max_tokens": 512
  }'
```

#### Python（OpenAI SDK）

```python
from openai import OpenAI

client = OpenAI(
    api_key="<YOUR_API_KEY>",
    base_url="https://kjapi.botsmart.net/v1",
)

resp = client.chat.completions.create(
    model="gpt-5.4",
    messages=[
        {"role": "user", "content": "请用一句话介绍你自己"}
    ],
    max_tokens=512,
)

print(resp.choices[0].message.content)
```

部分推理模型会消耗较多输出 token。如果使用 `DeepSeek-V4-Pro` 等模型，建议设置足够的 `max_tokens`。

切换到其他同类模型时，只需替换 `model`，例如：

- `DeepSeek-V4-Flash`
- `GLM-5.1`
- `Kimi-K2.6`
- `qwen3.6-plus`

### 4.3 Gemini：Gemini 原生协议

#### cURL

```bash
curl "https://kjapi.botsmart.net/v1beta/models/gemini-3.5-flash:generateContent" \
  -H "x-goog-api-key: <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "请用一句话介绍你自己"}
        ]
      }
    ]
  }'
```

#### Python

```python
import requests

resp = requests.post(
    "https://kjapi.botsmart.net/v1beta/models/gemini-3.5-flash:generateContent",
    headers={
        "x-goog-api-key": "<YOUR_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "contents": [
            {
                "parts": [
                    {"text": "请用一句话介绍你自己"}
                ]
            }
        ]
    },
    timeout=120,
)

resp.raise_for_status()
print(resp.json()["candidates"][0]["content"]["parts"][0]["text"])
```

### 4.4 图片生成

#### GPT 图片模型：OpenAI Images 协议

```bash
curl "https://kjapi.botsmart.net/v1/images/generations" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "画一个极简红苹果图标",
    "size": "1024x1024"
  }'
```

#### Gemini 图片模型：Gemini 原生协议

```bash
curl "https://kjapi.botsmart.net/v1beta/models/gemini-3.1-flash-image-preview:generateContent" \
  -H "x-goog-api-key: <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "生成一张极简蓝色圆形图标，白色背景"}
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"]
    }
  }'
```

返回结构说明：

- 图片 base64 返回在 `candidates[0].content.parts[*].text` 字段中。
- 不要按 Gemini 官方 `inlineData.data` 方式解析。
- 需要保存图片时，取出对应 `text` 字段内容后自行做 base64 解码。

示例（伪结构）：

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "<image_base64>"
          }
        ]
      }
    }
  ]
}
```

#### Python（GPT 图片模型）

```python
import base64
import requests

resp = requests.post(
    "https://kjapi.botsmart.net/v1/images/generations",
    headers={
        "Authorization": "Bearer <YOUR_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "model": "gpt-image-2",
        "prompt": "画一个极简红苹果图标",
        "size": "1024x1024",
    },
    timeout=180,
)

resp.raise_for_status()
image_b64 = resp.json()["data"][0]["b64_json"]

with open("output.png", "wb") as f:
    f.write(base64.b64decode(image_b64))
```

### 4.5 视频生成：`/v1/videos`

视频生成是异步任务。创建任务后会返回 `id` 或 `task_id`，客户端需要通过查询接口轮询任务结果。

#### 文生视频

```bash
curl -X POST "https://kjapi.botsmart.net/v1/videos" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "happyhorse-1.0-t2v",
    "input": {
      "prompt": "一匹白色小马在草原上奔跑，阳光明媚，电影感镜头"
    },
    "parameters": {
      "resolution": "720P",
      "duration": 5,
      "ratio": "16:9",
      "watermark": false
    }
  }'
```

#### 图生视频

图片必须通过公网可访问 URL 提供。

```bash
curl -X POST "https://kjapi.botsmart.net/v1/videos" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "happyhorse-1.0-i2v",
    "input": {
      "prompt": "让图片中的人物自然挥手，背景保持稳定",
      "media": [
        {
          "type": "input_image",
          "url": "https://example.com/input.jpg"
        }
      ]
    },
    "parameters": {
      "resolution": "720P",
      "duration": 5,
      "watermark": false
    }
  }'
```

#### 参考图生视频

参考图片必须通过公网可访问 URL 提供。

```bash
curl -X POST "https://kjapi.botsmart.net/v1/videos" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "happyhorse-1.0-r2v",
    "input": {
      "prompt": "[Image 1]中的人物向镜头挥手，保持人物特征一致",
      "media": [
        {
          "type": "reference_image",
          "url": "https://example.com/reference-1.jpg"
        },
        {
          "type": "reference_image",
          "url": "https://example.com/reference-2.jpg"
        }
      ]
    },
    "parameters": {
      "resolution": "720P",
      "duration": 3,
      "ratio": "16:9",
      "watermark": false
    }
  }'
```

#### 视频编辑

输入视频必须通过公网可访问 URL 提供。

```bash
curl -X POST "https://kjapi.botsmart.net/v1/videos" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "happyhorse-1.0-video-edit",
    "duration": 3,
    "input": {
      "prompt": "将视频调整为电影感暖色调，保持主体动作自然",
      "media": [
        {
          "type": "video",
          "url": "https://example.com/input.mp4"
        }
      ]
    },
    "parameters": {
      "resolution": "720P",
      "watermark": false,
      "audio_setting": "origin"
    }
  }'
```

`duration` 放在顶层，用于计费用时；`media.type` 使用 `video`，`media.url` 填写输入视频 URL。

#### 查询任务

```bash
curl "https://kjapi.botsmart.net/v1/videos/<task_id>" \
  -H "Authorization: Bearer <YOUR_API_KEY>"
```

创建任务响应示例：

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "task_id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "model": "happyhorse-1.0-video-edit",
  "status": "queued",
  "created_at": 1779381684
}
```

任务完成响应示例：

```json
{
  "id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "task_id": "task_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "model": "happyhorse-1.0-video-edit",
  "status": "completed",
  "progress": 100,
  "metadata": {
    "url": "https://example.com/generated-video.mp4"
  },
  "error": null
}
```

结果视频地址在 `metadata.url`。状态包括 `queued`、`in_progress`、`completed`、`failed`、`cancelled`。

素材 URL 要求：必须公网可访问，应该是图片或视频文件直链；不支持本地文件路径，不建议使用 base64，不要使用需要登录、Cookie 或内网访问的地址。

### 4.6 TTS：`/v1/audio/speech`

以下模型统一使用这个接口：

- `qwen3-tts-flash`
- `MiniMax/speech-2.8-turbo`
- `MiniMax/speech-2.8-hd`

#### cURL

```bash
curl "https://kjapi.botsmart.net/v1/audio/speech" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3-tts-flash",
    "input": "你好，这是一个测试。",
    "voice": "Cherry"
  }' \
  --output speech.wav
```

#### Python

```python
import requests

resp = requests.post(
    "https://kjapi.botsmart.net/v1/audio/speech",
    headers={
        "Authorization": "Bearer <YOUR_API_KEY>",
        "Content-Type": "application/json",
    },
    json={
        "model": "qwen3-tts-flash",
        "input": "你好，这是一个测试。",
        "voice": "Cherry",
    },
    timeout=180,
)

resp.raise_for_status()
with open("speech.wav", "wb") as f:
    f.write(resp.content)
```

可用 voice 示例：

- `qwen3-tts-flash`：`Cherry`
- `MiniMax/speech-2.8-turbo`：`male-qn-qingse`
- `MiniMax/speech-2.8-hd`：`male-qn-qingse`

可选参数：

- `response_format`：指定音频格式，例如 `mp3`
- `speed`：调整语速

## 5. Claude thinking 使用说明

如果客户需要 Claude thinking，可以在 Anthropic 接口里传入 `thinking` 参数。

示例：

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 4096,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 8192
  },
  "messages": [
    {
      "role": "user",
      "content": "证明根号 2 是无理数，并写出完整步骤"
    }
  ]
}
```

说明：

- `claude-sonnet-4-6` 可返回 thinking/signature。
- `claude-opus-4-7` 如需使用 thinking，建议先单独验证业务请求。
- 如果客户只是普通聊天，不需要传 `thinking`。

## 6. 模型接入方式汇总

| 模型类型 | 接入方式 |
|---|---|
| Claude | Anthropic `/v1/messages` |
| GPT / DeepSeek / GLM / Kimi / Qwen 文本 | OpenAI `/v1/chat/completions` |
| Gemini 文本 | Gemini 原生 `POST /v1beta/models/{model}:generateContent` |
| Gemini 图像相关模型 | Gemini 原生 `POST /v1beta/models/{model}:generateContent` |
| 图片生成 | `/v1/images/generations` |
| 视频生成 | `/v1/videos` |
| TTS | `/v1/audio/speech` |

## 7. 接入注意事项

1. `GET /v1/models` 返回的是当前 key 可见模型集合，接入前建议先拉一次。
2. 接入时请直接采用本文档对应模型的接口与请求格式。
3. Gemini 系列使用本文档中的原生接口与请求格式。
4. 视频接口为异步任务接口，不能按普通文本接口理解。
5. TTS 返回的是音频二进制内容，客户端要按文件流保存。

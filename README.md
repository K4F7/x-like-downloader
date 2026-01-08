# X Likes 下载器 (X Likes Downloader)

一个 Tampermonkey 用户脚本：在 X/Twitter 的 Likes 页面批量下载推文媒体（图片、GIF、视频），并打包为 ZIP。

## 功能概览

- 批量扫描点赞列表并自动滚动加载
- 支持图片 / GIF / 视频，按需勾选
- 下载完成后自动更新标记点，只下载新点赞
- 打包为 `[Xlike]YYYY-MM-DD.zip`

## 安装

1. 安装 Tampermonkey（Chrome / Firefox / Edge / Safari）。
2. 打开 Tampermonkey → 新建脚本 → 粘贴 `x-likes-downloader.user.js` → 保存。
3. 访问 `https://x.com` 或 `https://twitter.com` 的 Likes 页面。

## 使用方式（下载 Likes 媒体）

1. 登录 X，进入个人主页 → `Likes`。
2. 打开 Tampermonkey 菜单，点击「打开 X Likes 下载器」。
3. 首次使用：点击「自动设置（第一条）」或「手动选择推文」设定标记点。
4. 选择下载类型（图片 / GIF / 视频），点击「开始扫描」。
5. 扫描完成后点击「下载全部」，浏览器将保存 ZIP。

## 媒体获取策略

- 优先通过 X API 提取媒体信息。
- 视频与 GIF：优先选择最高码率的 `video/mp4`。
- API 不可用时回退到页面 DOM 解析；若 DOM 未加载完整视频，可能只拿到缩略图或低质量资源。

## 标记点机制（只下载新点赞）

标记点用于记录“上次下载到哪里”。扫描时遇到标记点会停止，下次只下载新点赞。

- 自动设置：以当前第一条点赞为标记点  
- 手动选择：进入选择模式后点任意推文  
- 清除标记：需要重新设置后才能继续扫描

## 输出与命名

- ZIP 文件名：`[Xlike]YYYY-MM-DD.zip`
- 文件命名示例：  
  - 图片：`{tweetId}_img_{index}.jpg`  
  - GIF：`{tweetId}_gif_{index}.gif.mp4`  
  - 视频：`{tweetId}_video_{index}.mp4`

## 常见问题

- 下载失败：原推文被删除、网络受限或 API 受限。  
- 扫描不停止：标记点已丢失，请重新设置。  
- 视频不完整：建议先滚动让视频加载，再开始扫描。

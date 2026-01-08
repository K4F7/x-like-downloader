# X Likes 下载器 (X Likes Downloader)

在 X (Twitter) 的点赞列表中，批量下载推文媒体（图片、GIF、视频），并打包为 ZIP。

## 如何下载点赞列表的媒体

1. 安装 Tampermonkey，并导入 `x-likes-downloader.user.js`。
2. 登录 X，进入个人主页 → `Likes`。
3. 打开 Tampermonkey 菜单，点击「打开 X Likes 下载器」。
4. 选择要下载的类型（图片 / GIF / 视频），点击「开始扫描」。
5. 扫描完成后点击「下载全部」，浏览器会保存一个 ZIP。

脚本会优先通过 X 的 API 获取媒体信息：  
- 图片下载原图质量（`pbs.twimg.com/media/...:orig`）  
- 视频会选择最高码率的 `video/mp4`  
当 API 不可用时，会回退到页面 DOM 解析。

## 标记点机制（只下载新点赞）

标记点用于记录“上次下载到哪里”。下次扫描会从最新点赞开始，遇到标记点即停止。

- 自动设置：点击「自动设置（第一条）」将当前第一条点赞设为标记点  
- 手动选择：点击「选择」后点任意推文  
- 清除标记：点击「清除」

## 安装方式

1. 安装 Tampermonkey（Chrome / Firefox / Edge / Safari）。
2. 手动安装：打开 Tampermonkey → 新建脚本 → 粘贴 `x-likes-downloader.user.js` → 保存。
3. 进入 `https://x.com` 或 `https://twitter.com` 的 Likes 页面使用。

## 文件命名规则

- 图片：`{tweetId}_img_{index}.jpg`  
- GIF：`{tweetId}_gif_{index}.gif.mp4`  
- 视频：`{tweetId}_video_{index}.mp4`

## 常见问题

- 下载失败：可能是原推文被删除或网络受限。  
- 扫描不停止：标记点已丢失，请重新设置。  
- 视频不完整：建议先滚动让视频加载，再开始扫描。

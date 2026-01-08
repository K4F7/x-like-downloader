# X Likes 下载器 (X Likes Downloader)

一键下载你在 X (Twitter) 上点赞的图片、GIF 和视频，打包成 ZIP 文件。

## ✨ 功能特点

- 📸 **批量下载** - 一键下载所有点赞内容中的媒体文件
- 🖼️ **多格式支持** - 支持图片、GIF、视频
- 📦 **ZIP 打包** - 自动打包成 ZIP 文件，方便管理
- 🔖 **智能标记** - 记住上次下载位置，只下载新内容
- 🎯 **手动选择** - 支持手动选择标记点

## 📥 安装方法

### 第一步：安装 Tampermonkey

Tampermonkey 是一个浏览器扩展，用于运行用户脚本。

| 浏览器 | 安装链接 |
|--------|----------|
| Chrome | [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Firefox 附加组件](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Edge | [Edge 外接程序](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Safari | [Mac App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |

### 第二步：安装脚本

**方法一：从 Greasyfork 安装（推荐）**

访问 [Greasyfork 页面](https://greasyfork.org/scripts/xxx) 点击安装

**方法二：手动安装**

1. 点击浏览器右上角的 Tampermonkey 图标
2. 选择「添加新脚本」
3. 删除编辑器中的所有内容
4. 复制本仓库中的 `x-likes-downloader.user.js` 文件内容并粘贴
5. 按 `Ctrl+S` 保存

## 🚀 使用方法

### 首次使用

1. 打开 [X.com](https://x.com) 并登录
2. 进入你的个人主页，点击「Likes」标签
3. 点击浏览器右上角的 Tampermonkey 图标
4. 选择「打开 X Likes 下载器」
5. 点击「自动设置（第一条）」设置标记点
6. 选择要下载的类型（图片/GIF/视频）
7. 点击「开始扫描」

### 日常使用

1. 打开你的 Likes 页面
2. 点击 Tampermonkey 图标 → 「打开 X Likes 下载器」
3. 点击「开始扫描」
4. 扫描完成后点击「下载全部」

脚本会自动记住上次下载的位置，只下载新点赞的内容！

## 📖 功能说明

### 标记点

标记点用于记录你上次下载到哪里了。下次扫描时，脚本会从最新的点赞开始扫描，直到遇到标记点自动停止。

- **自动设置**：点击「自动设置（第一条）」，会将当前第一条点赞设为标记点
- **手动选择**：点击「选择」按钮，然后点击任意一条推文将其设为标记点
- **清除标记**：点击「清除」按钮清除当前标记点

### 下载类型

- **图片**：下载推文中的静态图片（原图质量）
- **GIF**：下载动态 GIF（实际下载的是缩略图）
- **视频**：下载推文中的视频

## ❓ 常见问题

**Q: 为什么有些图片下载失败？**

A: 可能是网络问题或者图片已被删除。失败的文件会在下载完成后显示数量。

**Q: 为什么扫描不会停止？**

A: 请确保标记点仍然存在于你的点赞列表中。如果原推文被删除，请重新设置标记点。

**Q: 视频下载不完整？**

A: 视频需要在页面上加载播放后才能获取完整链接。建议先手动滚动浏览一遍。

**Q: 下载的文件在哪里？**

A: 下载的 ZIP 文件会保存到浏览器默认的下载目录，文件名格式为 `[Xlike]2024-01-08.zip`。

## 🛠️ 技术信息

- 使用 [fflate](https://github.com/101arrowz/fflate) 进行 ZIP 打包
- 支持 X.com 和 Twitter.com
- 需要 Tampermonkey 的 GM_* API 权限

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

如果这个脚本对你有帮助，请给个 ⭐ Star！

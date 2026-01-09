# Repository Guidelines

## 项目结构与模块组织
- `x-likes-downloader.user.js` 是主脚本，包含 UI、扫描逻辑、下载与打包流程。
- `README.md` 提供安装与使用说明。
- 本仓库为单文件脚本项目，无单独的测试、构建或资源目录。

## 构建、测试与本地开发命令
- 无构建步骤，脚本即发布文件。
- 手动开发流程示例：
  - 安装 Tampermonkey。
  - 新建脚本并粘贴 `x-likes-downloader.user.js` 内容。
  - 访问 `https://x.com/<user>/likes`，通过菜单运行脚本。

## 代码风格与命名约定
- 缩进：4 空格，不使用 Tab。
- JavaScript 风格：分号结尾、单引号、`camelCase` 命名。
- 倾向使用小而清晰的辅助函数（例如 `extractTweetId`、`fetchMedia`）。
- 保持 userscript 头部元数据准确（`@version`、`@match`、`@grant`、`@require`）。

## 测试指南
- 未配置自动化测试框架。
- 通过浏览器手动验证：
  - 打开 Likes 页面。
  - 验证扫描进度、标记点设置/清除、ZIP 下载流程。
  - 检查图片/GIF/视频三类媒体与文件命名格式。

## 提交与 Pull Request 规范
- 提交信息遵循 Conventional Commits（如 `feat:`、`chore:`）。
- PR 需包含：
  - 行为变更说明。
  - 复现/验证步骤（手动测试记录）。
  - 如涉及 UI 变更，附截图或短视频。

## 安全与配置建议
- 避免新增不必要的网络域名；如有需要请同步更新 `@connect`。
- 不记录或持久化用户凭据，仅使用 `GM_*` 存储标记点。
- 修改 API 调用时需验证 X/Twitter 端点稳定性与错误处理。

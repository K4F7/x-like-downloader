// ==UserScript==
// @name         X Likes 下载器
// @namespace    https://github.com/K4F7/x-like-downloader
// @version      1.2.2
// @description  下载 X (Twitter) 点赞列表中的图片、GIF和视频
// @author       You
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_download
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @connect      abs.twimg.com
// @connect      *
// @require      https://unpkg.com/fflate@0.8.2/umd/index.js
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ========== 样式 ==========
    GM_addStyle(`
        .xld-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }
        .xld-overlay.active {
            display: block;
        }
        .xld-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 360px;
            background: #15202b;
            border-radius: 16px;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #e7e9ea;
        }
        .xld-panel.active {
            display: block;
        }
        .xld-header {
            padding: 16px 20px;
            border-bottom: 1px solid #38444d;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .xld-title {
            font-size: 18px;
            font-weight: 700;
        }
        .xld-close {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: #e7e9ea;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .xld-close:hover {
            background: rgba(239, 243, 244, 0.1);
        }
        .xld-body {
            padding: 20px;
        }
        .xld-section {
            margin-bottom: 20px;
        }
        .xld-label {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #8b98a5;
        }
        .xld-date-row {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .xld-select, .xld-date-input {
            flex: 1;
            padding: 10px 12px;
            background: #273340;
            border: 1px solid #38444d;
            border-radius: 8px;
            color: #e7e9ea;
            font-size: 14px;
        }
        .xld-select:focus, .xld-date-input:focus {
            outline: none;
            border-color: #1d9bf0;
        }
        .xld-checkbox-group {
            display: flex;
            gap: 16px;
        }
        .xld-checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
        }
        .xld-checkbox-label input {
            width: 18px;
            height: 18px;
            accent-color: #1d9bf0;
        }
        .xld-btn {
            width: 100%;
            padding: 12px;
            border-radius: 9999px;
            border: none;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s;
        }
        .xld-btn-primary {
            background: #1d9bf0;
            color: #fff;
        }
        .xld-btn-primary:hover {
            background: #1a8cd8;
        }
        .xld-btn-primary:disabled {
            background: #1d9bf0;
            opacity: 0.5;
            cursor: not-allowed;
        }
        .xld-btn-secondary {
            background: transparent;
            color: #1d9bf0;
            border: 1px solid #536471;
            margin-top: 10px;
        }
        .xld-btn-secondary:hover {
            background: rgba(29, 155, 240, 0.1);
        }
        .xld-status {
            margin-top: 16px;
            padding: 12px;
            background: #273340;
            border-radius: 8px;
            font-size: 13px;
            text-align: center;
            display: none;
        }
        .xld-status.active {
            display: block;
        }
        .xld-progress {
            margin-top: 8px;
            height: 4px;
            background: #38444d;
            border-radius: 2px;
            overflow: hidden;
        }
        .xld-progress-bar {
            height: 100%;
            background: #1d9bf0;
            width: 0%;
            transition: width 0.3s;
        }
        .xld-date-custom {
            display: none;
            margin-top: 10px;
        }
        .xld-date-custom.active {
            display: flex;
            gap: 10px;
        }
        .xld-marker-info {
            padding: 12px;
            background: #273340;
            border: 1px solid #38444d;
            border-radius: 8px;
            font-size: 13px;
            color: #e7e9ea;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .xld-marker-thumb {
            width: 48px;
            height: 48px;
            border-radius: 6px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .xld-marker-text {
            flex: 1;
            overflow: hidden;
        }
        .xld-marker-title {
            font-size: 13px;
            color: #e7e9ea;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
        }
        .xld-marker-id {
            font-size: 11px;
            color: #8b98a5;
        }
        .xld-marker-empty {
            color: #8b98a5;
        }
        .xld-marker-hint {
            margin-top: 8px;
            font-size: 12px;
            color: #8b98a5;
        }
        .xld-marker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .xld-marker-actions {
            display: flex;
            gap: 8px;
        }
        .xld-btn-small {
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 9999px;
            border: 1px solid #536471;
            background: transparent;
            color: #8b98a5;
            cursor: pointer;
            transition: all 0.2s;
        }
        .xld-btn-small:hover {
            background: rgba(239, 243, 244, 0.1);
            color: #e7e9ea;
        }
        .xld-btn-danger:hover {
            border-color: #f4212e;
            color: #f4212e;
        }
        .xld-btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 16px;
        }
        .xld-select-mode-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #1d9bf0;
            color: #fff;
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .xld-select-mode-bar span {
            font-size: 14px;
            font-weight: 500;
        }
        .xld-select-mode-bar button {
            padding: 6px 16px;
            border-radius: 9999px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: #fff;
            font-size: 13px;
            cursor: pointer;
        }
        .xld-select-mode-bar button:hover {
            background: rgba(255,255,255,0.3);
        }
        .xld-tweet-selectable {
            cursor: pointer !important;
            transition: outline 0.2s;
        }
        .xld-tweet-selectable:hover {
            outline: 3px solid #1d9bf0;
            outline-offset: -3px;
        }
        .xld-init-notice {
            padding: 12px;
            background: rgba(29, 155, 240, 0.1);
            border: 1px solid rgba(29, 155, 240, 0.3);
            border-radius: 8px;
            font-size: 13px;
            color: #8b98a5;
            margin-bottom: 12px;
            line-height: 1.5;
        }
    `);

    // ========== 状态 ==========
    let isScanning = false;
    let collectedMedia = [];

    // ========== UI ==========
    function createPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'xld-overlay';
        overlay.addEventListener('click', closePanel);

        const panel = document.createElement('div');
        panel.className = 'xld-panel';
        panel.innerHTML = `
            <div class="xld-header">
                <span class="xld-title">X Likes 下载器</span>
                <button class="xld-close">✕</button>
            </div>
            <div class="xld-body">
                <div class="xld-section">
                    <div class="xld-marker-header">
                        <div class="xld-label" style="margin-bottom:0">标记点</div>
                        <div class="xld-marker-actions" id="xld-marker-actions" style="display:none">
                            <button class="xld-btn-small" id="xld-select-marker-btn">选择</button>
                            <button class="xld-btn-small xld-btn-danger" id="xld-clear-marker-btn">清除</button>
                        </div>
                    </div>
                    <div class="xld-marker-info" id="xld-marker-info">
                        <span class="xld-marker-empty">未设置标记点</span>
                    </div>
                    <div class="xld-marker-hint">
                        扫描到标记点会自动停止，只下载新内容
                    </div>
                </div>
                <div class="xld-section" id="xld-init-section" style="display:none">
                    <div class="xld-init-notice">
                        首次使用，请先设置标记点。这会记住当前位置，之后只下载新点赞的内容。
                    </div>
                    <button class="xld-btn xld-btn-primary" id="xld-init-btn">自动设置（第一条）</button>
                    <button class="xld-btn xld-btn-secondary" id="xld-init-select-btn">手动选择推文</button>
                </div>
                <div class="xld-section">
                    <div class="xld-label">下载类型</div>
                    <div class="xld-checkbox-group">
                        <label class="xld-checkbox-label">
                            <input type="checkbox" id="xld-type-image" checked>
                            图片
                        </label>
                        <label class="xld-checkbox-label">
                            <input type="checkbox" id="xld-type-gif" checked>
                            GIF
                        </label>
                        <label class="xld-checkbox-label">
                            <input type="checkbox" id="xld-type-video">
                            视频
                        </label>
                    </div>
                </div>
                <div class="xld-btn-group">
                    <button class="xld-btn xld-btn-primary" id="xld-scan-btn">开始扫描</button>
                    <button class="xld-btn xld-btn-primary" id="xld-download-btn" style="display:none">
                        下载全部
                    </button>
                </div>
                <div class="xld-status" id="xld-status">
                    <span id="xld-status-text">准备就绪</span>
                    <div class="xld-progress">
                        <div class="xld-progress-bar" id="xld-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // 事件绑定
        panel.querySelector('.xld-close').addEventListener('click', closePanel);
        panel.querySelector('#xld-scan-btn').addEventListener('click', startScan);
        panel.querySelector('#xld-download-btn').addEventListener('click', downloadAll);
        panel.querySelector('#xld-clear-marker-btn').addEventListener('click', clearMarker);
        panel.querySelector('#xld-init-btn').addEventListener('click', initMarker);
        panel.querySelector('#xld-init-select-btn').addEventListener('click', () => enterSelectMode());
        panel.querySelector('#xld-select-marker-btn').addEventListener('click', () => enterSelectMode());

        // 初始化标记状态显示
        updateMarkerDisplay();

        return { overlay, panel };
    }

    let panelElements = null;

    function openPanel() {
        if (!panelElements) {
            panelElements = createPanel();
        }
        panelElements.overlay.classList.add('active');
        panelElements.panel.classList.add('active');
    }

    function closePanel() {
        if (panelElements) {
            panelElements.overlay.classList.remove('active');
            panelElements.panel.classList.remove('active');
        }
    }

    function updateMarkerDisplay() {
        const markerInfo = document.getElementById('xld-marker-info');
        const markerActions = document.getElementById('xld-marker-actions');
        const initSection = document.getElementById('xld-init-section');
        const scanBtn = document.getElementById('xld-scan-btn');
        const savedMarker = GM_getValue('markerTweetId', null);

        if (savedMarker && savedMarker.id) {
            // 显示缩略图和标题
            let thumbHtml = '';
            if (savedMarker.thumbnail) {
                thumbHtml = `<img class="xld-marker-thumb" src="${savedMarker.thumbnail}" alt="缩略图">`;
            }

            const displayText = savedMarker.text || '(无文字内容)';
            const shortId = savedMarker.id.substring(0, 8) + '...';

            markerInfo.innerHTML = `
                ${thumbHtml}
                <div class="xld-marker-text">
                    <div class="xld-marker-title" title="${savedMarker.text || ''}">${displayText}</div>
                    <div class="xld-marker-id">ID: ${shortId}</div>
                </div>
            `;

            if (markerActions) markerActions.style.display = 'flex';
            if (initSection) initSection.style.display = 'none';
            if (scanBtn) scanBtn.style.display = 'block';
        } else {
            markerInfo.innerHTML = `<span class="xld-marker-empty">未设置标记点</span>`;
            if (markerActions) markerActions.style.display = 'none';
            if (initSection) initSection.style.display = 'block';
            if (scanBtn) scanBtn.style.display = 'none';
        }
    }

    function clearMarker() {
        if (confirm('确定要清除标记点吗？需要重新设置才能使用。')) {
            GM_setValue('markerTweetId', null);
            updateMarkerDisplay();
            updateStatus('标记点已清除');
        }
    }

    // ========== 选择模式 ==========
    let isSelectMode = false;
    let selectModeBar = null;

    function enterSelectMode() {
        // 检查是否在likes页面
        const currentUrl = window.location.href;
        if (!currentUrl.includes('/likes')) {
            const username = getCurrentUsername();
            if (username) {
                alert('请先打开你的 Likes 页面，然后再选择标记点');
                window.location.href = `https://x.com/${username}/likes`;
                return;
            } else {
                alert('请先登录');
                return;
            }
        }

        isSelectMode = true;
        closePanel();

        // 创建顶部提示条
        selectModeBar = document.createElement('div');
        selectModeBar.className = 'xld-select-mode-bar';
        selectModeBar.innerHTML = `
            <span>点击任意推文将其设为标记点</span>
            <button id="xld-cancel-select">取消</button>
        `;
        document.body.appendChild(selectModeBar);

        selectModeBar.querySelector('#xld-cancel-select').addEventListener('click', exitSelectMode);

        // 给所有推文添加可选样式和点击事件
        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        tweets.forEach(tweet => {
            tweet.classList.add('xld-tweet-selectable');
            tweet.addEventListener('click', handleTweetSelect, true);
        });

        // 监听新加载的推文
        startTweetObserver();
    }

    function exitSelectMode() {
        isSelectMode = false;

        // 移除顶部提示条
        if (selectModeBar) {
            selectModeBar.remove();
            selectModeBar = null;
        }

        // 移除推文的可选样式和事件
        const tweets = document.querySelectorAll('.xld-tweet-selectable');
        tweets.forEach(tweet => {
            tweet.classList.remove('xld-tweet-selectable');
            tweet.removeEventListener('click', handleTweetSelect, true);
        });

        // 停止监听
        stopTweetObserver();

        // 重新打开面板
        openPanel();
    }

    function handleTweetSelect(event) {
        if (!isSelectMode) return;

        event.preventDefault();
        event.stopPropagation();

        const tweet = event.currentTarget;
        const markerData = extractTweetInfo(tweet);

        if (markerData.id) {
            GM_setValue('markerTweetId', markerData);
            exitSelectMode();
            updateMarkerDisplay();
            updateStatus('标记点已设置');
        } else {
            alert('无法获取该推文的ID，请选择其他推文');
        }
    }

    let tweetObserver = null;

    function startTweetObserver() {
        tweetObserver = new MutationObserver((mutations) => {
            if (!isSelectMode) return;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const tweets = node.querySelectorAll ? node.querySelectorAll('[data-testid="tweet"]') : [];
                        tweets.forEach(tweet => {
                            if (!tweet.classList.contains('xld-tweet-selectable')) {
                                tweet.classList.add('xld-tweet-selectable');
                                tweet.addEventListener('click', handleTweetSelect, true);
                            }
                        });
                        // 检查节点本身是否是推文
                        if (node.matches && node.matches('[data-testid="tweet"]') && !node.classList.contains('xld-tweet-selectable')) {
                            node.classList.add('xld-tweet-selectable');
                            node.addEventListener('click', handleTweetSelect, true);
                        }
                    }
                });
            });
        });

        tweetObserver.observe(document.body, { childList: true, subtree: true });
    }

    function stopTweetObserver() {
        if (tweetObserver) {
            tweetObserver.disconnect();
            tweetObserver = null;
        }
    }

    async function initMarker() {
        const initBtn = document.getElementById('xld-init-btn');
        initBtn.disabled = true;
        initBtn.textContent = '正在初始化...';

        // 检查是否在likes页面
        const currentUrl = window.location.href;
        if (!currentUrl.includes('/likes')) {
            const username = getCurrentUsername();
            if (username) {
                updateStatus('请先打开你的 Likes 页面');
                initBtn.disabled = false;
                initBtn.textContent = '初始化标记点';
                window.location.href = `https://x.com/${username}/likes`;
                return;
            } else {
                updateStatus('请先登录');
                initBtn.disabled = false;
                initBtn.textContent = '初始化标记点';
                return;
            }
        }

        // 等待页面加载
        await sleep(1000);

        // 获取第一条推文
        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        if (tweets.length > 0) {
            const firstTweet = tweets[0];
            const markerData = extractTweetInfo(firstTweet);

            if (markerData.id) {
                GM_setValue('markerTweetId', markerData);
                updateMarkerDisplay();
                updateStatus('初始化成功！标记点已设置，现在可以开始扫描');
            } else {
                updateStatus('无法获取推文ID，请刷新页面重试');
            }
        } else {
            updateStatus('未找到推文，请确保页面已加载完成');
        }

        initBtn.disabled = false;
        initBtn.textContent = '初始化标记点';
    }

    // 提取推文的完整信息（ID、文本、缩略图）- 用于显示和保存
    function extractTweetInfo(tweet) {
        const id = extractTweetId(tweet);

        // 提取推文作者名
        let authorName = '';
        // 方法1: 从用户头像旁边的链接获取
        const userNameEl = tweet.querySelector('[data-testid="User-Name"]');
        if (userNameEl) {
            // 第一个 span 通常是显示名称
            const nameSpan = userNameEl.querySelector('a span');
            if (nameSpan) {
                authorName = nameSpan.textContent.trim();
            }
        }

        // 提取推文文本（完整版用于匹配）
        let fullText = '';
        let text = '';
        const tweetTextEl = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetTextEl) {
            fullText = tweetTextEl.textContent.trim();
            text = fullText;
            // 显示用的截断版本
            if (text.length > 50) {
                text = text.substring(0, 50) + '...';
            }
        }

        // 如果没有文字内容，用作者名填充
        if (!text && authorName) {
            text = `@${authorName} 的推文`;
            fullText = text;
        }

        // 提取缩略图URL（用于显示）
        let thumbnail = '';
        // 提取媒体ID（用于匹配）
        let mediaId = '';
        const img = tweet.querySelector('[data-testid="tweetPhoto"] img');
        if (img && img.src) {
            // 使用小尺寸缩略图用于显示
            thumbnail = img.src.replace(/&name=\w+/, '&name=small');
            // 提取媒体ID用于匹配
            const mediaMatch = img.src.match(/\/media\/([A-Za-z0-9_-]+)/);
            if (mediaMatch) {
                mediaId = mediaMatch[1];
            }
        }

        return { id, text, fullText, thumbnail, mediaId, authorName };
    }

    function updateStatus(text, progress = null) {
        const statusDiv = document.getElementById('xld-status');
        const statusText = document.getElementById('xld-status-text');
        const progressBar = document.getElementById('xld-progress-bar');

        statusDiv.classList.add('active');
        statusText.textContent = text;

        if (progress !== null) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // ========== 日期工具 ==========
    function getSelectedTypes() {
        return {
            image: document.getElementById('xld-type-image').checked,
            gif: document.getElementById('xld-type-gif').checked,
            video: document.getElementById('xld-type-video').checked
        };
    }

    // ========== 扫描逻辑 ==========
    let firstTweetInfo = null; // 记录本次扫描的第一条推文信息，用于设置新标记

    async function startScan() {
        if (isScanning) return;

        // 检查是否在likes页面
        const currentUrl = window.location.href;
        if (!currentUrl.includes('/likes')) {
            const username = getCurrentUsername();
            if (username) {
                updateStatus('正在跳转到 Likes 页面...');
                window.location.href = `https://x.com/${username}/likes`;
                return;
            } else {
                updateStatus('请先登录或手动打开 Likes 页面');
                return;
            }
        }

        isScanning = true;
        collectedMedia = [];
        firstTweetInfo = null;

        const scanBtn = document.getElementById('xld-scan-btn');
        const downloadBtn = document.getElementById('xld-download-btn');

        scanBtn.disabled = true;
        scanBtn.textContent = '扫描中...';
        downloadBtn.style.display = 'none';

        const types = getSelectedTypes();
        const savedMarker = GM_getValue('markerTweetId', null);

        updateStatus(savedMarker ? '开始扫描（到标记点停止）...' : '开始扫描...', 0);

        try {
            const reachedMarker = await scanLikes(types, savedMarker);

            if (reachedMarker) {
                updateStatus(`扫描完成！找到 ${collectedMedia.length} 个新文件（已到达标记点）`, 100);
            } else {
                updateStatus(`扫描完成！找到 ${collectedMedia.length} 个文件`, 100);
            }

            if (collectedMedia.length > 0) {
                downloadBtn.style.display = 'block';
                downloadBtn.textContent = `下载全部 (${collectedMedia.length} 个文件)`;
            } else {
                updateStatus('没有找到新的媒体文件', 100);
            }
        } catch (error) {
            updateStatus(`扫描出错: ${error.message}`, 0);
            console.error('扫描错误:', error);
        }

        isScanning = false;
        scanBtn.disabled = false;
        scanBtn.textContent = '重新扫描';
    }

    function getCurrentUsername() {
        // 尝试从页面获取当前登录用户名
        const accountSwitcher = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
        if (accountSwitcher) {
            const spans = accountSwitcher.querySelectorAll('span');
            for (const span of spans) {
                if (span.textContent.startsWith('@')) {
                    return span.textContent.slice(1);
                }
            }
        }
        return null;
    }

    async function scanLikes(types, savedMarker) {
        const seenUrls = new Set();
        const seenTweetIds = new Set();
        let noNewContentCount = 0;
        let reachedMarker = false;
        let totalScanned = 0;
        let lastSeenCount = 0;

        console.log('[XLD] ========== 开始扫描 ==========');
        console.log('[XLD] 标记点信息:', JSON.stringify(savedMarker, null, 2));

        while (noNewContentCount < 8 && !reachedMarker) {
            // 获取当前可见的推文
            const tweets = document.querySelectorAll('[data-testid="tweet"]');

            for (const tweet of tweets) {
                const tweetId = extractTweetId(tweet);

                // 如果无法提取ID，跳过
                if (!tweetId) continue;

                // 【关键】无论是否处理过，都要检查是否是标记点
                if (savedMarker) {
                    const isMarker = isMarkerTweet(tweet, savedMarker);
                    if (isMarker) {
                        console.log('[XLD] ✓✓✓ 找到标记点！停止扫描 ✓✓✓');
                        reachedMarker = true;
                        break;
                    }
                }

                // 跳过已处理的推文（只用于媒体收集）
                if (seenTweetIds.has(tweetId)) continue;
                seenTweetIds.add(tweetId);
                totalScanned++;

                // 每处理10条推文输出一次日志
                if (totalScanned % 10 === 0) {
                    console.log(`[XLD] 已扫描 ${totalScanned} 条推文，找到 ${collectedMedia.length} 个媒体`);
                }

                // 记录第一条推文信息（最新的点赞）
                if (!firstTweetInfo) {
                    firstTweetInfo = extractTweetInfo(tweet);
                    console.log('[XLD] 第一条推文:', firstTweetInfo.id, firstTweetInfo.text);
                }

                // 提取媒体
                const mediaItems = extractMediaFromTweet(tweet, types);
                for (const item of mediaItems) {
                    if (!seenUrls.has(item.url)) {
                        seenUrls.add(item.url);
                        collectedMedia.push(item);
                    }
                }

                updateStatus(`已扫描 ${totalScanned} 条推文，找到 ${collectedMedia.length} 个文件...`, null);
            }

            if (reachedMarker) break;

            // 【关键改进】逐步滚动，而不是直接到底部
            const scrollStep = window.innerHeight * 0.8; // 每次滚动80%屏幕高度
            window.scrollBy(0, scrollStep);
            await sleep(800); // 等待推文加载

            // 检查是否有新推文加载
            const currentSeenCount = seenTweetIds.size;
            if (currentSeenCount === lastSeenCount) {
                noNewContentCount++;
                console.log(`[XLD] 没有新推文 (${noNewContentCount}/8)`);
            } else {
                noNewContentCount = 0;
            }
            lastSeenCount = currentSeenCount;
        }

        console.log('[XLD] ========== 扫描结束 ==========');
        console.log(`[XLD] 共扫描 ${totalScanned} 条，找到 ${collectedMedia.length} 个媒体，到达标记点: ${reachedMarker}`);
        return reachedMarker;
    }

    function extractMediaFromTweet(tweet, types) {
        const media = [];
        const tweetId = extractTweetId(tweet);

        // 图片
        if (types.image || types.gif) {
            const images = tweet.querySelectorAll('[data-testid="tweetPhoto"] img');
            images.forEach((img, index) => {
                let url = img.src;

                // 获取原图质量
                if (url.includes('pbs.twimg.com/media/')) {
                    url = url.replace(/\?format=\w+/, '?format=jpg')
                             .replace(/&name=\w+/, '&name=orig');
                    if (!url.includes('?format=')) {
                        url = url.split('?')[0] + '?format=jpg&name=orig';
                    }
                }

                // 判断是否为GIF
                const isGif = img.closest('[data-testid="tweetPhoto"]')?.querySelector('video') != null ||
                              url.includes('tweet_video_thumb');

                if (isGif && types.gif) {
                    media.push({
                        type: 'gif',
                        url: url,
                        filename: `${tweetId}_gif_${index}.jpg`,
                        tweetId
                    });
                } else if (!isGif && types.image) {
                    media.push({
                        type: 'image',
                        url: url,
                        filename: `${tweetId}_img_${index}.jpg`,
                        tweetId
                    });
                }
            });
        }

        // 视频
        if (types.video) {
            const videos = tweet.querySelectorAll('video');
            videos.forEach((video, index) => {
                let url = video.src;
                if (url && url.includes('video.twimg.com')) {
                    media.push({
                        type: 'video',
                        url: url,
                        filename: `${tweetId}_video_${index}.mp4`,
                        tweetId
                    });
                }
            });
        }

        return media;
    }

    function extractTweetId(tweet) {
        // 方法1：从推文时间戳链接提取（最可靠）
        // 时间戳链接通常是 /username/status/123456 格式，且在推文主体内
        const timeLink = tweet.querySelector('time')?.closest('a[href*="/status/"]');
        if (timeLink) {
            const match = timeLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        // 方法2：从推文内的所有status链接中找到属于推文作者的
        const links = tweet.querySelectorAll('a[href*="/status/"]');
        for (const link of links) {
            // 排除引用推文（通常在一个嵌套的article或特定容器内）
            const isQuoteTweet = link.closest('[data-testid="tweet"]') !== tweet;
            if (!isQuoteTweet) {
                const match = link.href.match(/\/status\/(\d+)/);
                if (match) return match[1];
            }
        }

        // 方法3：兜底，使用第一个找到的
        const anyLink = tweet.querySelector('a[href*="/status/"]');
        if (anyLink) {
            const match = anyLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        return null; // 不再返回时间戳，返回null表示提取失败
    }

    // 提取推文的完整信息用于标记点匹配
    function extractFullTweetInfo(tweet) {
        const id = extractTweetId(tweet);

        // 提取完整推文文本（不截断，用于匹配）
        let fullText = '';
        const tweetTextEl = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetTextEl) {
            fullText = tweetTextEl.textContent.trim();
        }

        // 提取缩略图的媒体ID（从URL中提取，更稳定）
        let mediaId = '';
        const img = tweet.querySelector('[data-testid="tweetPhoto"] img');
        if (img && img.src) {
            // 从 pbs.twimg.com/media/xxxxx 提取媒体ID
            const mediaMatch = img.src.match(/\/media\/([A-Za-z0-9_-]+)/);
            if (mediaMatch) {
                mediaId = mediaMatch[1];
            }
        }

        // 提取推文作者用户名
        let authorUsername = '';
        const authorLink = tweet.querySelector('a[href^="/"][role="link"]');
        if (authorLink) {
            const usernameMatch = authorLink.href.match(/x\.com\/([^\/]+)/);
            if (usernameMatch) {
                authorUsername = usernameMatch[1];
            }
        }

        return { id, fullText, mediaId, authorUsername };
    }

    // 检查是否是标记点推文（多重验证）
    function isMarkerTweet(tweet, savedMarker) {
        if (!savedMarker) return false;

        const currentInfo = extractFullTweetInfo(tweet);
        let matchScore = 0;
        let matchReasons = [];

        // 1. ID精确匹配（权重最高）
        if (currentInfo.id && savedMarker.id && currentInfo.id === savedMarker.id) {
            matchScore += 3;
            matchReasons.push('ID匹配');
        }

        // 2. 媒体ID匹配（非常可靠，媒体ID是唯一的）
        if (currentInfo.mediaId && savedMarker.mediaId && currentInfo.mediaId === savedMarker.mediaId) {
            matchScore += 2;
            matchReasons.push('媒体ID匹配');
        }

        // 3. 文本匹配（检查是否包含，因为保存时可能被截断）
        if (currentInfo.fullText && savedMarker.fullText) {
            // 如果保存的文本是完整文本的前缀，或者完全相同
            if (currentInfo.fullText === savedMarker.fullText ||
                currentInfo.fullText.startsWith(savedMarker.fullText) ||
                savedMarker.fullText.startsWith(currentInfo.fullText)) {
                matchScore += 1;
                matchReasons.push('文本匹配');
            }
        }

        // 判断逻辑：
        // - ID匹配 → 直接认定（分数>=3）
        // - 媒体ID + 文本匹配 → 认定（分数>=3）
        // - 仅媒体ID匹配 → 认定（分数>=2，媒体ID本身就很可靠）
        const isMatch = matchScore >= 2;

        // 调试：显示每个推文的匹配情况（只显示有部分匹配的）
        if (matchScore > 0 || currentInfo.id === savedMarker.id) {
            console.log(`[XLD] 匹配检查: ID=${currentInfo.id}, 分数=${matchScore}, 原因=[${matchReasons.join(',')}]`);
            console.log(`[XLD]   当前: mediaId=${currentInfo.mediaId}, text=${currentInfo.fullText?.substring(0,30)}`);
            console.log(`[XLD]   标记: mediaId=${savedMarker.mediaId}, text=${savedMarker.fullText?.substring(0,30)}`);
        }

        return isMatch;
    }

    // ========== 下载逻辑 ==========
    async function downloadAll() {
        if (collectedMedia.length === 0) {
            updateStatus('没有可下载的文件');
            return;
        }

        const downloadBtn = document.getElementById('xld-download-btn');
        downloadBtn.disabled = true;

        // 生成文件名：[Xlike]2024-01-08.zip
        const dateStr = new Date().toISOString().split('T')[0];
        const zipFileName = `[Xlike]${dateStr}.zip`;

        let completed = 0;
        let failed = 0;

        // 检查 fflate 是否可用
        if (typeof fflate === 'undefined') {
            updateStatus('fflate 未加载，请刷新页面重试');
            downloadBtn.disabled = false;
            return;
        }

        const files = {};

        updateStatus(`正在下载文件...`, 0);

        // 第一步：下载所有文件到内存
        for (const item of collectedMedia) {
            try {
                updateStatus(`下载中 (${completed + 1}/${collectedMedia.length}): ${item.filename}`, (completed / collectedMedia.length) * 70);

                const blob = await fetchMedia(item.url);
                if (blob && blob.size > 0) {
                    // 转换 Blob 为 Uint8Array
                    const arrayBuffer = await blob.arrayBuffer();
                    files[item.filename] = new Uint8Array(arrayBuffer);
                } else {
                    failed++;
                }
            } catch (error) {
                console.error(`下载失败: ${item.url}`, error);
                failed++;
            }

            completed++;
        }

        if (Object.keys(files).length === 0) {
            updateStatus('所有文件下载失败，请检查网络');
            downloadBtn.disabled = false;
            return;
        }

        // 第二步：使用 fflate 生成 ZIP
        updateStatus(`正在打包 ${Object.keys(files).length} 个文件...`, 75);

        try {
            // fflate.zipSync 同步打包（不压缩，速度快）
            const zipped = fflate.zipSync(files, { level: 0 });

            // 转换为 Blob
            const blob = new Blob([zipped], { type: 'application/zip' });

            updateStatus('正在保存 ZIP 文件...', 90);

            // 第三步：下载 ZIP
            const blobUrl = URL.createObjectURL(blob);

            // 使用 a 标签下载（更可靠）
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = zipFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 延迟释放 URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

            // 更新标记点
            if (firstTweetInfo && firstTweetInfo.id) {
                GM_setValue('markerTweetId', firstTweetInfo);
                updateMarkerDisplay();
            }

            const failMsg = failed > 0 ? ` (${failed} 个失败)` : '';
            updateStatus(`下载完成！已保存为 ${zipFileName}${failMsg}`, 100);

        } catch (error) {
            updateStatus(`打包失败: ${error.message}`, 0);
            console.error('ZIP生成错误:', error);
        }

        downloadBtn.disabled = false;
    }

    function fetchMedia(url) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('下载超时'));
            }, 30000); // 30秒超时

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                timeout: 30000,
                onload: function(response) {
                    clearTimeout(timeout);
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    clearTimeout(timeout);
                    reject(error);
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // ========== 工具函数 ==========
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========== API 相关 ==========
    function getCookies() {
        const cookies = {};
        document.cookie.split(';').filter(n => n.indexOf('=') > 0).forEach(n => {
            n.replace(/^([^=]+)=(.+)$/, (match, name, value) => {
                cookies[name.trim()] = value.trim();
            });
        });
        return cookies;
    }

    async function fetchTweetByApi(tweetId) {
        const baseUrl = 'https://x.com/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId';
        const variables = {
            'tweetId': tweetId,
            'with_rux_injections': false,
            'includePromotedContent': true,
            'withCommunity': true,
            'withQuickPromoteEligibilityTweetFields': true,
            'withBirdwatchNotes': true,
            'withVoice': true,
            'withV2Timeline': true
        };
        const features = {
            'articles_preview_enabled': true,
            'c9s_tweet_anatomy_moderator_badge_enabled': true,
            'communities_web_enable_tweet_community_results_fetch': false,
            'creator_subscriptions_quote_tweet_preview_enabled': false,
            'creator_subscriptions_tweet_preview_api_enabled': false,
            'freedom_of_speech_not_reach_fetch_enabled': true,
            'graphql_is_translatable_rweb_tweet_is_translatable_enabled': true,
            'longform_notetweets_consumption_enabled': false,
            'longform_notetweets_inline_media_enabled': true,
            'longform_notetweets_rich_text_read_enabled': false,
            'premium_content_api_read_enabled': false,
            'profile_label_improvements_pcf_label_in_post_enabled': true,
            'responsive_web_edit_tweet_api_enabled': false,
            'responsive_web_enhance_cards_enabled': false,
            'responsive_web_graphql_exclude_directive_enabled': false,
            'responsive_web_graphql_skip_user_profile_image_extensions_enabled': false,
            'responsive_web_graphql_timeline_navigation_enabled': false,
            'responsive_web_media_download_video_enabled': false,
            'responsive_web_twitter_article_tweet_consumption_enabled': true,
            'rweb_tipjar_consumption_enabled': true,
            'rweb_video_screen_enabled': false,
            'standardized_nudges_misinfo': true,
            'tweet_awards_web_tipping_enabled': false,
            'tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled': true,
            'tweetypie_unmention_optimization_enabled': false,
            'verified_phone_label_enabled': false,
            'view_counts_everywhere_api_enabled': true
        };

        const url = encodeURI(`${baseUrl}?variables=${JSON.stringify(variables)}&features=${JSON.stringify(features)}`);
        const cookies = getCookies();
        const headers = {
            'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': cookies.lang || 'en',
            'x-csrf-token': cookies.ct0
        };

        if (cookies.ct0 && cookies.ct0.length === 32) {
            headers['x-guest-token'] = cookies.gt;
        }

        const response = await fetch(url, { headers });
        const json = await response.json();

        if (json.errors) {
            throw new Error(json.errors[0].message);
        }

        const tweetResult = json.data?.tweetResult?.result;
        return tweetResult?.tweet || tweetResult;
    }

    function extractMediaFromApi(tweetData) {
        const media = [];
        const tweet = tweetData.legacy;
        const user = tweetData.core?.user_results?.result?.legacy;
        const extendedMedia = tweet?.extended_entities?.media || [];

        extendedMedia.forEach((item, index) => {
            if (item.type === 'photo') {
                media.push({
                    type: 'image',
                    url: item.media_url_https + ':orig',
                    filename: `${tweet.id_str}_img_${index}.jpg`
                });
            } else if (item.type === 'video' || item.type === 'animated_gif') {
                // 获取最高码率的视频
                const variants = item.video_info?.variants || [];
                const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                const bestVariant = mp4Variants.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

                if (bestVariant) {
                    const ext = item.type === 'animated_gif' ? 'gif.mp4' : 'mp4';
                    media.push({
                        type: item.type === 'animated_gif' ? 'gif' : 'video',
                        url: bestVariant.url.split('?')[0], // 移除查询参数
                        bitrate: bestVariant.bitrate,
                        filename: `${tweet.id_str}_${item.type === 'animated_gif' ? 'gif' : 'video'}_${index}.${ext}`
                    });
                }
            }
        });

        return {
            user: user ? `${user.name} (@${user.screen_name})` : 'Unknown',
            text: tweet?.full_text?.substring(0, 100) || '',
            media
        };
    }

    // ========== 初始化 ==========
    GM_registerMenuCommand('打开 X Likes 下载器', openPanel);

})();

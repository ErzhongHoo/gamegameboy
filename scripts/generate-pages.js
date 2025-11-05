#!/usr/bin/env node

/**
 * HTML5 Game Platform - 批量页面生成脚本
 * 基于游戏信息自动生成HTML页面
 *
 * 使用方法：
 * node scripts/generate-pages.js
 */

const fs = require('fs');
const path = require('path');

// 游戏数据配置
const gamesData = [
    // Monster Survivors
    {
        title: "Monster Survivors",
        description: "在无尽的怪物浪潮中生存，测试你的战斗技巧！对抗恐怖的怪物波次，成为最终的生存者。",
        category: "action",
        categoryName: "动作游戏",
        iframeUrl: "https://cloud.onlinegames.io/games/2025/unity/monster-survivors/index-og.html",
        screenshotUrl: "assets/images/games/monster-survivors.jpg",
        controls: [
            { key: "W,A,S,D", action: "移动角色" },
            { key: "鼠标", action: "瞄准" },
            { key: "左键", action: "射击" }
        ],
        tags: ["生存", "动作", "怪物", "战斗", "射击"],
        difficulty: "中等"
    }
];

// 相关游戏映射
function getRelatedGames(currentGame, allGames, limit = 4) {
    return allGames
        .filter(game => game.category === currentGame.category && game.title !== currentGame.title)
        .slice(0, limit);
}

// 生成操作说明HTML
function generateControlsHTML(controls) {
    return controls.map(control =>
        `<li><span class="control-key">${control.key}</span> ${control.action}</li>`
    ).join('');
}

// 生成相关游戏HTML
function generateRelatedGamesHTML(games) {
    return games.map(game => `
        <a href="${game.category}/${game.title.toLowerCase().replace(/\s+/g, '-')}.html" class="related-game-card">
            <div class="related-game-thumbnail">
                <img src="${game.screenshotUrl}" alt="${game.title}" onerror="this.src='../assets/images/default-game.jpg'">
            </div>
            <div class="related-game-card-content">
                <div class="related-game-title">${game.title}</div>
                <div class="related-game-category">${game.categoryName}</div>
            </div>
        </a>
    `).join('');
}

// 生成游戏页面HTML
function generateGamePage(game) {
    const relatedGames = getRelatedGames(game, gamesData);
    const controlsHTML = generateControlsHTML(game.controls);
    const relatedGamesHTML = generateRelatedGamesHTML(relatedGames);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${game.title} - 免费${game.categoryName} | GameBoy</title>
    <meta name="description" content="${game.description}">
    <meta name="keywords" content="${game.tags.join(', ')}, ${game.categoryName}, HTML5游戏, 在线游戏">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${game.title} - 免费${game.categoryName}">
    <meta property="og:description" content="${game.description}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${game.screenshotUrl}">

    <!-- CSS -->
    <link rel="stylesheet" href="../../assets/css/style.css">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../../assets/images/favicon.ico">

    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="../../index.html" class="logo">🎮 GameBoy</a>

                <ul class="nav-menu" id="navMenu">
                    <li><a href="../../index.html">首页</a></li>
                    <li><a href="../action/index.html">动作游戏</a></li>
                    <li><a href="../puzzle/index.html">益智游戏</a></li>
                    <li><a href="../strategy/index.html">策略游戏</a></li>
                    <li><a href="../sports/index.html">体育游戏</a></li>
                    <li><a href="../racing/index.html">竞速游戏</a></li>
                    <li><a href="../adventure/index.html">冒险游戏</a></li>
                </ul>

                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-box" id="searchBox" placeholder="搜索游戏...">
                </div>

                <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <div class="container">
            <div class="game-container">
                <!-- 游戏头部信息 -->
                <div class="game-header">
                    <h1 class="game-title">${game.title}</h1>
                    <p class="game-description">${game.description}</p>
                    <div class="game-meta">
                        <span class="game-category">${game.categoryName}</span>
                        <span>🎮 ${game.difficulty}难度</span>
                        <span>⭐ 免费游戏</span>
                    </div>
                </div>

                <!-- 游戏iframe容器 -->
                <div class="game-iframe-container">
                    <div class="loading" id="gameLoader">
                        <div class="loading-spinner"></div>
                        <p>游戏加载中...</p>
                    </div>
                    <iframe
                        class="game-iframe"
                        id="gameFrame"
                        src="${game.iframeUrl}"
                        loading="lazy"
                        onload="hideLoader()"
                        frameborder="0"
                        allowfullscreen>
                    </iframe>
                </div>

                <!-- 游戏信息区 -->
                <div class="game-info">
                    <!-- 游戏介绍 -->
                    <div class="game-info-section">
                        <h3>🎯 游戏介绍</h3>
                        <p>${game.description}</p>
                        <div class="mt-1">
                            <strong>分类：</strong> ${game.categoryName}<br>
                            <strong>类型：</strong> HTML5休闲游戏<br>
                            <strong>难度：</strong> ${game.difficulty}<br>
                            <strong>标签：</strong> ${game.tags.join(' · ')}
                        </div>
                    </div>

                    <!-- 操作说明 -->
                    <div class="game-info-section">
                        <h3>🎮 操作说明</h3>
                        <ul class="controls-list">
                            ${controlsHTML}
                        </ul>
                        <div class="mt-1">
                            <p><strong>提示：</strong>游戏支持触摸屏操作，手机平板都能玩！</p>
                        </div>
                    </div>
                </div>

                <!-- 社交分享 -->
                <div class="social-share">
                    <a href="#" class="share-btn share-twitter" id="shareTwitter">
                        🐦 分享到Twitter
                    </a>
                    <a href="#" class="share-btn share-facebook" id="shareFacebook">
                        👍 分享到Facebook
                    </a>
                    <a href="#" class="share-btn share-reddit" id="shareReddit">
                        🤖 分享到Reddit
                    </a>
                </div>

                <!-- 相关游戏推荐 -->
                <div class="related-games">
                    <h3>🎲 你可能喜欢的游戏</h3>
                    <div class="related-games-grid">
                        ${relatedGamesHTML}
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>🎮 GameBoy</h4>
                    <p>最好的HTML5在线游戏平台</p>
                </div>
                <div class="footer-section">
                    <h4>游戏分类</h4>
                    <ul>
                        <li><a href="../action/index.html">动作游戏</a></li>
                        <li><a href="../puzzle/index.html">益智游戏</a></li>
                        <li><a href="../strategy/index.html">策略游戏</a></li>
                        <li><a href="../sports/index.html">体育游戏</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>关于我们</h4>
                    <ul>
                        <li><a href="#about">关于平台</a></li>
                        <li><a href="#contact">联系我们</a></li>
                        <li><a href="#privacy">隐私政策</a></li>
                        <li><a href="#terms">使用条款</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>关注我们</h4>
                    <div class="social-links">
                        <a href="#" aria-label="Twitter">🐦</a>
                        <a href="#" aria-label="Facebook">📘</a>
                        <a href="#" aria-label="Reddit">🤖</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 GameBoy. 保留所有权利。</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="../../assets/js/main.js"></script>
    <script>
    // 游戏页面专用脚本
    function hideLoader() {
        const loader = document.getElementById('gameLoader');
        const gameFrame = document.getElementById('gameFrame');

        setTimeout(() => {
            loader.style.display = 'none';
            gameFrame.style.display = 'block';
        }, 500);
    }

    // 社交分享功能
    document.addEventListener('DOMContentLoaded', function() {
        const gameTitle = '${game.title}';
        const gameUrl = window.location.href;
        const gameDescription = '${game.description}';

        // Twitter分享
        document.getElementById('shareTwitter').addEventListener('click', function(e) {
            e.preventDefault();
            const twitterUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(gameTitle + ' - ' + gameDescription)}&url=\${encodeURIComponent(gameUrl)}\`;
            window.open(twitterUrl, '_blank', 'width=550,height=420');
        });

        // Facebook分享
        document.getElementById('shareFacebook').addEventListener('click', function(e) {
            e.preventDefault();
            const facebookUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(gameUrl)}\`;
            window.open(facebookUrl, '_blank', 'width=580,height=400');
        });

        // Reddit分享
        document.getElementById('shareReddit').addEventListener('click', function(e) {
            e.preventDefault();
            const redditUrl = \`https://reddit.com/submit?url=\${encodeURIComponent(gameUrl)}&title=\${encodeURIComponent(gameTitle)}\`;
            window.open(redditUrl, '_blank', 'width=600,height=500');
        });

        // 保存到游戏历史
        if (window.GamePlatform && window.GamePlatform.storage) {
            window.GamePlatform.storage.saveGameHistory(gameUrl, gameTitle);
        }
    });

    // 游戏加载失败处理
    document.getElementById('gameFrame').addEventListener('error', function() {
        const loader = document.getElementById('gameLoader');
        loader.innerHTML = '<p>❌ 游戏加载失败，请刷新页面重试</p>';
    });
    </script>
</body>
</html>`;
}

// 生成分类页面HTML
function generateCategoryPage(category) {
    const categoryGames = gamesData.filter(game => game.category === category);
    const categoryInfo = {
        'action': { title: '动作游戏', description: '刺激的动作游戏，考验你的反应和技巧！', icon: '⚔️' },
        'puzzle': { title: '益智游戏', description: '锻炼思维的益智游戏，适合休闲娱乐！', icon: '🧩' },
        'strategy': { title: '策略游戏', description: '需要智慧和规划的策略游戏！', icon: '♟️' },
        'sports': { title: '体育游戏', description: '模拟各种体育运动，体验竞技乐趣！', icon: '⚽' },
        'racing': { title: '竞速游戏', description: '速度与激情的竞速游戏！', icon: '🏁' },
        'adventure': { title: '冒险游戏', description: '探索未知世界的冒险游戏！', icon: '🗺️' }
    };

    const info = categoryInfo[category];

    const gameCards = categoryGames.map(game => `
        <div class="game-card" data-url="${game.title.toLowerCase().replace(/\s+/g, '-')}.html">
            <div class="game-thumbnail">
                <img src="../../${game.screenshotUrl}" alt="${game.title}" onerror="this.src='../../assets/images/default-game.jpg'">
                <div class="game-overlay">
                    <span class="play-button">▶️ 立即玩</span>
                </div>
            </div>
            <div class="game-card-content">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <span class="game-category">${game.categoryName}</span>
                    <span class="game-tags">${game.tags.slice(0, 2).join(' · ')}</span>
                </div>
            </div>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${info.title} - 免费在线${info.title} | GameBoy</title>
    <meta name="description" content="${info.description}">
    <meta name="keywords" content="${info.title}, HTML5游戏, 在线游戏, 免费${info.title}">

    <!-- CSS -->
    <link rel="stylesheet" href="../../assets/css/style.css">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../../assets/images/favicon.ico">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <a href="../../index.html" class="logo">🎮 GameBoy</a>

                <ul class="nav-menu" id="navMenu">
                    <li><a href="../../index.html">首页</a></li>
                    <li><a href="../action/index.html">动作游戏</a></li>
                    <li><a href="../puzzle/index.html">益智游戏</a></li>
                    <li><a href="../strategy/index.html">策略游戏</a></li>
                    <li><a href="../sports/index.html">体育游戏</a></li>
                    <li><a href="../racing/index.html">竞速游戏</a></li>
                    <li><a href="../adventure/index.html">冒险游戏</a></li>
                </ul>

                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" class="search-box" id="searchBox" placeholder="搜索游戏...">
                </div>

                <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <div class="container">
            <!-- Category Header -->
            <div class="category-header">
                <div class="category-hero">
                    <div class="category-icon-large">${info.icon}</div>
                    <h1 class="category-title">${info.title}</h1>
                    <p class="category-description">${info.description}</p>
                    <div class="category-stats">
                        <span>🎮 ${categoryGames.length} 款游戏</span>
                        <span>⭐ 全部免费</span>
                        <span>📱 支持移动端</span>
                    </div>
                </div>
            </div>

            <!-- Games Grid -->
            <div class="game-grid">
                ${gameCards}
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>🎮 GameBoy</h4>
                    <p>最好的HTML5在线游戏平台</p>
                </div>
                <div class="footer-section">
                    <h4>游戏分类</h4>
                    <ul>
                        <li><a href="../action/index.html">动作游戏</a></li>
                        <li><a href="../puzzle/index.html">益智游戏</a></li>
                        <li><a href="../strategy/index.html">策略游戏</a></li>
                        <li><a href="../sports/index.html">体育游戏</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>关于我们</h4>
                    <ul>
                        <li><a href="#about">关于平台</a></li>
                        <li><a href="#contact">联系我们</a></li>
                        <li><a href="#privacy">隐私政策</a></li>
                        <li><a href="#terms">使用条款</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>关注我们</h4>
                    <div class="social-links">
                        <a href="#" aria-label="Twitter">🐦</a>
                        <a href="#" aria-label="Facebook">📘</a>
                        <a href="#" aria-label="Reddit">🤖</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 GameBoy. 保留所有权利。</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="../../assets/js/main.js"></script>
    <script>
    // 分类页面专用脚本
    document.addEventListener('DOMContentLoaded', function() {
        // 游戏卡片点击事件
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', function() {
                const gameUrl = this.dataset.url;
                if (gameUrl) {
                    window.location.href = gameUrl;
                }
            });
        });
    });
    </script>
</body>
</html>`;
}

// 确保目录存在
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// 主函数
function main() {
    console.log('🚀 开始生成HTML5游戏平台页面...\n');

    // 创建所有必要的目录
    const categories = ['action', 'puzzle', 'strategy', 'sports', 'racing', 'adventure'];

    categories.forEach(category => {
        const categoryPath = path.join(__dirname, '..', 'games', category);
        ensureDirectoryExists(categoryPath);
        console.log(`✅ 创建目录: ${categoryPath}`);
    });

    // 生成分类页面
    console.log('\n📁 生成分类页面...');
    categories.forEach(category => {
        const categoryPageHTML = generateCategoryPage(category);
        const categoryPagePath = path.join(__dirname, '..', 'games', category, 'index.html');

        fs.writeFileSync(categoryPagePath, categoryPageHTML, 'utf8');
        console.log(`✅ 生成分类页面: games/${category}/index.html`);
    });

    // 生成游戏页面
    console.log('\n🎮 生成游戏页面...');
    gamesData.forEach(game => {
        const gamePageHTML = generateGamePage(game);
        const gameFileName = game.title.toLowerCase().replace(/\s+/g, '-') + '.html';
        const gamePagePath = path.join(__dirname, '..', 'games', game.category, gameFileName);

        fs.writeFileSync(gamePagePath, gamePageHTML, 'utf8');
        console.log(`✅ 生成游戏页面: games/${game.category}/${gameFileName}`);
    });

    // 创建默认游戏图片
    console.log('\n🖼️  创建默认资源文件...');
    const defaultGameImagePath = path.join(__dirname, '..', 'assets', 'images', 'default-game.jpg');
    if (!fs.existsSync(defaultGameImagePath)) {
        // 这里应该放置一个默认的游戏图片
        // 由于我们无法生成实际图片，创建一个占位符文件
        fs.writeFileSync(defaultGameImagePath, '', 'utf8');
        console.log('✅ 创建默认游戏图片占位符');
    }

    console.log('\n🎉 页面生成完成！');
    console.log('\n📋 生成统计:');
    console.log(`   - 分类页面: ${categories.length} 个`);
    console.log(`   - 游戏页面: ${gamesData.length} 个`);
    console.log(`   - 总计页面: ${categories.length + gamesData.length} 个`);

    console.log('\n📝 下一步操作:');
    console.log('1. 替换 gamesData 中的 iframeUrl 为实际的游戏链接');
    console.log('2. 添加真实的游戏截图到 assets/images/games/ 目录');
    console.log('3. 根据需要调整游戏信息和操作说明');
    console.log('4. 测试所有页面链接是否正常工作');

    console.log('\n🌐 本地预览:');
    console.log('   - 首页: open index.html');
    console.log('   - 或使用本地服务器: python -m http.server 8000');
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = {
    generateGamePage,
    generateCategoryPage,
    gamesData
};
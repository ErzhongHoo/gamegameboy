// =================================
// HTML5 Game Platform - Main JavaScript
// Mobile-First Interactive Features
// =================================

// 游戏数据库 - 这里可以替换为你的实际游戏数据
const gamesDatabase = [
    // Monster Survivors
    {
        title: "Monster Survivors",
        category: "action",
        description: "在无尽的怪物浪潮中生存，测试你的战斗技巧！",
        url: "monster-survivors.html",
        thumbnail: "assets/images/games/monster-survivors.jpg",
        tags: ["生存", "动作", "怪物", "战斗"]
    },
    // Mechanical Bull
    {
        title: "Mechanical Bull",
        category: "action",
        description: "体验机械牛骑行的刺激挑战！测试你的平衡能力和反应速度，看看你能坚持多久！",
        url: "mechanical-bull.html",
        thumbnail: "assets/images/games/mechanical-bull.jpg",
        tags: ["平衡", "动作", "挑战", "反应"]
    }
];

// DOM 元素
let navMenu, mobileMenuToggle, searchBox, searchResults;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    navMenu = document.getElementById('navMenu');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    searchBox = document.getElementById('searchBox');

    // 初始化移动端菜单
    initMobileMenu();

    // 初始化搜索功能
    initSearchFunction();

    // 初始化游戏卡片
    initGameCards();

    // 添加页面加载动画
    addLoadingAnimations();
});

// 移动端菜单切换
function initMobileMenu() {
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // 切换菜单图标
            if (navMenu.classList.contains('active')) {
                mobileMenuToggle.textContent = '✕';
            } else {
                mobileMenuToggle.textContent = '☰';
            }
        });
    }

    // 点击菜单外部关闭菜单
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
}

// 搜索功能
function initSearchFunction() {
    if (!searchBox) return;

    // 创建搜索结果容器
    searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchBox.parentElement.appendChild(searchResults);

    // 实时搜索
    let searchTimeout;
    searchBox.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length < 2) {
            hideSearchResults();
            return;
        }

        // 防抖处理
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // 点击搜索框外部关闭结果
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSearchResults();
        }
    });

    // 键盘导航
    searchBox.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        } else if (e.key === 'Escape') {
            hideSearchResults();
            this.blur();
        }
    });
}

// 执行搜索
function performSearch(query) {
    const results = gamesDatabase.filter(game => {
        const searchTerms = [
            game.title.toLowerCase(),
            game.description.toLowerCase(),
            game.category.toLowerCase(),
            ...game.tags.map(tag => tag.toLowerCase())
        ];

        return searchTerms.some(term => term.includes(query.toLowerCase()));
    });

    displaySearchResults(results, query);
}

// 显示搜索结果
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <p>😔 没有找到相关游戏</p>
                <p>试试其他关键词吧</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(game => `
            <div class="search-result-item" onclick="goToGame('${game.url}')">
                <div class="search-result-thumbnail">
                    <img src="${game.thumbnail}" alt="${game.title}" onerror="this.src='assets/images/default-game.jpg'">
                </div>
                <div class="search-result-content">
                    <h4>${highlightMatch(game.title, query)}</h4>
                    <p>${game.description}</p>
                    <span class="search-result-category">${getCategoryName(game.category)}</span>
                </div>
            </div>
        `).join('');
    }

    searchResults.style.display = 'block';
}

// 高亮匹配文本
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 获取分类中文名
function getCategoryName(category) {
    const categories = {
        'action': '动作游戏'
    };
    return categories[category] || '动作游戏';
}

// 隐藏搜索结果
function hideSearchResults() {
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// 跳转到游戏页面
function goToGame(url) {
    hideSearchResults();
    searchBox.value = '';
    window.location.href = url;
}

// 初始化游戏卡片点击事件
function initGameCards() {
    document.addEventListener('click', function(event) {
        const gameCard = event.target.closest('.game-card');
        if (gameCard && gameCard.dataset.url) {
            window.location.href = gameCard.dataset.url;
        }
    });
}

// 页面加载动画
function addLoadingAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有游戏卡片
    document.querySelectorAll('.game-card').forEach(card => {
        observer.observe(card);
    });
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：获取随机游戏
function getRandomGames(count = 5) {
    const shuffled = [...gamesDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// 工具函数：获取相关游戏
function getRelatedGames(currentCategory, currentTitle, count = 4) {
    return gamesDatabase
        .filter(game => game.category === currentCategory && game.title !== currentTitle)
        .slice(0, count);
}

// 本地存储功能
const storage = {
    // 保存用户游戏偏好
    saveFavoriteGame: function(gameUrl, gameTitle) {
        const favorites = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
        if (!favorites.find(fav => fav.url === gameUrl)) {
            favorites.push({ url: gameUrl, title: gameTitle, timestamp: Date.now() });
            localStorage.setItem('favoriteGames', JSON.stringify(favorites));
        }
    },

    // 获取收藏的游戏
    getFavoriteGames: function() {
        return JSON.parse(localStorage.getItem('favoriteGames') || '[]');
    },

    // 保存游戏记录
    saveGameHistory: function(gameUrl, gameTitle) {
        const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        // 移除已存在的记录
        const filteredHistory = history.filter(item => item.url !== gameUrl);
        // 添加到开头
        filteredHistory.unshift({ url: gameUrl, title: gameTitle, timestamp: Date.now() });
        // 只保留最近20个
        const limitedHistory = filteredHistory.slice(0, 20);
        localStorage.setItem('gameHistory', JSON.stringify(limitedHistory));
    },

    // 获取游戏历史
    getGameHistory: function() {
        return JSON.parse(localStorage.getItem('gameHistory') || '[]');
    }
};

// 性能优化：图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 导出给其他脚本使用
window.GamePlatform = {
    gamesDatabase,
    storage,
    getRandomGames,
    getRelatedGames,
    goToGame
};
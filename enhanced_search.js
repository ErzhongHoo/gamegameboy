/**
 * Enhanced Search System
 * 增强搜索系统 - 实时建议、智能过滤、键盘导航
 */

class EnhancedSearch {
    constructor() {
        this.gamesData = [];
        this.searchInput = null;
        this.searchResults = null;
        this.searchButton = null;
        this.currentFocus = -1;
        this.isSearchVisible = false;

        this.init();
    }

    async init() {
        // 加载游戏数据
        await this.loadGamesData();

        // 初始化搜索元素
        this.setupSearchElements();

        // 绑定事件
        this.bindEvents();

        console.log('🔍 Enhanced Search System initialized');
    }

    async loadGamesData() {
        try {
            console.log('🔍 Loading games data...');

            // 首先尝试从window对象获取内嵌数据
            if (typeof window !== 'undefined' && window.GAMES_DATABASE) {
                console.log('🔍 Using embedded games database');
                this.gamesData = window.GAMES_DATABASE;
            } else {
                // 如果没有内嵌数据，尝试fetch
                console.log('🔍 Trying to fetch games database...');
                const response = await fetch('generated_games.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.gamesData = await response.json();
                console.log('🔍 Successfully loaded from JSON file');
            }

            // 使用扁平化的游戏列表
            if (window.ALL_GAMES && Array.isArray(window.ALL_GAMES)) {
                this.allGames = window.ALL_GAMES;
                console.log('🔍 Using pre-flattened games list:', this.allGames.length);
            } else {
                // 扁平化游戏数据（备用方案）
                this.allGames = [];
                for (const [category, games] of Object.entries(this.gamesData)) {
                    if (Array.isArray(games)) {
                        games.forEach(game => {
                            if (game && game.name) {
                                this.allGames.push({
                                    ...game,
                                    category: game.classification || category
                                });
                            }
                        });
                    }
                }
                console.log('🔍 Using flattened games list:', this.allGames.length);
            }

            console.log(`📊 Loaded ${this.allGames.length} games from ${Object.keys(this.gamesData).length} categories`);

            // 如果没有加载到游戏数据，创建一个示例游戏列表
            if (this.allGames.length === 0) {
                console.warn('⚠️ No games loaded, creating fallback game list');
                this.createFallbackGames();
            }
        } catch (error) {
            console.error('❌ Error loading games data:', error);
            console.log('🔍 Creating fallback game list...');
            this.createFallbackGames();
        }
    }

    createFallbackGames() {
        // 创建一个基本的游戏列表作为备用
        this.gamesData = {
            action: [
                { name: "Minecraft Classic", file: "games/adventure/minecraft-classic.html", classification: "action" },
                { name: "Vex 3", file: "games/action/vex-3.html", classification: "action" },
                { name: "Geometry Dash", file: "games/action/geometry-dash.html", classification: "action" },
                { name: "Run 3", file: "games/action/run-3.html", classification: "action" }
            ],
            adventure: [
                { name: "Minecraft Classic", file: "games/adventure/minecraft-classic.html", classification: "adventure" },
                { name: "Fireboy and Watergirl", file: "games/adventure/fireboy-and-watergirl.html", classification: "adventure" },
                { name: "Paper Minecraft", file: "games/adventure/paper-minecraft.html", classification: "adventure" }
            ],
            puzzle: [
                { name: "2048", file: "games/puzzle/2048.html", classification: "puzzle" },
                { name: "Sudoku", file: "games/puzzle/sudoku.html", classification: "puzzle" },
                { name: "Wordle", file: "games/puzzle/wordle.html", classification: "puzzle" }
            ],
            sports: [
                { name: "Basketball Stars", file: "games/action/basketball-stars.html", classification: "sports" },
                { name: "Moto X3M", file: "games/sports/moto-x3m.html", classification: "sports" },
                { name: "Drift Hunters", file: "games/sports/drift-hunters.html", classification: "sports" }
            ]
        };

        // 扁平化游戏数据
        this.allGames = [];
        for (const [category, games] of Object.entries(this.gamesData)) {
            games.forEach(game => {
                if (game && game.name) {
                    this.allGames.push({
                        ...game,
                        category: game.classification || category
                    });
                }
            });
        }

        console.log(`📊 Created fallback list with ${this.allGames.length} games`);
    }

    setupSearchElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');

        // 创建搜索结果容器
        this.createSearchResultsContainer();
    }

    createSearchResultsContainer() {
        // 检查是否已存在搜索结果容器
        this.searchResults = document.getElementById('searchResults');
        if (!this.searchResults) {
            this.searchResults = document.createElement('div');
            this.searchResults.id = 'searchResults';
            this.searchResults.className = 'absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto z-50 hidden';

            // 插入到搜索框后面
            if (this.searchInput && this.searchInput.parentElement) {
                this.searchInput.parentElement.appendChild(this.searchResults);
            }
        }
    }

    bindEvents() {
        if (!this.searchInput) {
            console.error('❌ Search input not found');
            return;
        }

        // 实时搜索
        this.searchInput.addEventListener('input', (e) => {
            console.log('🔍 Input event:', e.target.value);
            this.handleSearch(e.target.value);
        });

        // 键盘导航
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // 焦点事件
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.handleSearch(this.searchInput.value);
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                this.hideSearchResults();
            }
        });

        // 更新搜索按钮
        if (this.searchButton) {
            console.log('🔍 Binding search button event');
            this.searchButton.removeAttribute('onclick');
            this.searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔍 Search button clicked');
                this.performSearch();
            });
        } else {
            console.error('❌ Search button not found');
        }

        // 绑定清空按钮
        const clearButton = document.getElementById('clearSearchButton');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    handleSearch(query) {
        console.log('🔍 handleSearch called with:', query);
        const searchTerm = query.toLowerCase().trim();

        if (searchTerm.length === 0) {
            console.log('🔍 Search term is empty, showing all games');
            this.hideSearchResults();
            this.showAllGames();
            return;
        }

        console.log('🔍 Searching for:', searchTerm);
        console.log('🔍 Total games available:', this.allGames.length);

        // 搜索游戏
        const results = this.searchGames(searchTerm);
        console.log('🔍 Found results:', results.length);

        // 显示建议
        this.showSearchSuggestions(results, searchTerm);

        // 显示搜索结果（包括所有匹配的游戏）
        this.displaySearchResults(results, searchTerm);
    }

    searchGames(searchTerm) {
        if (!this.allGames.length) return [];

        console.log(`🔍 Searching for "${searchTerm}" in ${this.allGames.length} games`);

        const scoredResults = this.allGames
            .map(game => {
                const name = game.name.toLowerCase();
                const category = game.category.toLowerCase();
                const score = this.calculateRelevanceScore(name, category, searchTerm, game);
                return { ...game, relevanceScore: score };
            })
            .filter(game => game.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 10); // 增加结果数量，显示更多相关游戏

        console.log(`🔍 Found ${scoredResults.length} relevant games for "${searchTerm}"`);
        scoredResults.forEach((game, index) => {
            console.log(`  ${index + 1}. ${game.name} (Score: ${game.relevanceScore})`);
        });

        return scoredResults;
    }

    calculateRelevanceScore(name, category, searchTerm, game) {
        let score = 0;
        const nameLower = name.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        // 精确匹配名称 - 最高分
        if (nameLower === searchTermLower) score += 10000;

        // 名称以搜索词开头
        if (nameLower.startsWith(searchTermLower)) score += 5000;

        // 名称包含搜索词 - 降低阈值
        if (nameLower.includes(searchTermLower)) score += 2000;

        // 分类完全匹配
        if (category.toLowerCase() === searchTermLower) score += 1000;

        // 分类包含搜索词
        if (category.toLowerCase().includes(searchTermLower)) score += 500;

        // 分词匹配 - 更宽松的匹配
        const nameWords = nameLower.split(/[\s\-\_:&'"]+/); // 增加分隔符
        const searchWords = searchTermLower.split(/[\s\-\_:&'"]+/);

        for (const searchWord of searchWords) {
            if (searchWord.length >= 2) { // 忽略太短的搜索词
                for (const nameWord of nameWords) {
                    if (nameWord === searchWord) score += 800;
                    else if (nameWord.includes(searchWord)) score += 300;
                    else if (searchWord.includes(nameWord) && nameWord.length >= 3) score += 100;
                }
            }
        }

        // 编辑距离匹配 - 更宽松的拼写容错
        if (searchTerm.length <= 12) {
            for (const nameWord of nameWords) {
                if (nameWord.length >= 3) {
                    const distance = this.levenshteinDistance(nameWord, searchTermLower);
                    const maxDistance = Math.min(3, Math.floor(nameWord.length / 3));
                    if (distance <= maxDistance) {
                        score += Math.max(10, 100 - distance * 20);
                    }
                }
            }
        }

        // 字符顺序匹配 - 适度权重
        if (this.isSubsequence(searchTermLower, nameLower) && score < 300) {
            const ratio = searchTermLower.length / nameLower.length;
            score += Math.floor(50 * ratio);
        }

        // 降低长度惩罚
        if (name.length > searchTerm.length * 3 && score < 300) {
            score = Math.max(0, score - 50);
        }

        // 大幅降低最低匹配阈值
        if (score < 50 && !nameLower.includes(searchTermLower)) {
            // 检查是否有任何部分匹配
            let hasPartialMatch = false;
            for (const searchWord of searchWords) {
                if (searchWord.length >= 3) {
                    for (const nameWord of nameWords) {
                        if (nameWord.includes(searchWord) || searchWord.includes(nameWord)) {
                            hasPartialMatch = true;
                            score += 50;
                            break;
                        }
                    }
                }
            }
            if (!hasPartialMatch && searchTermLower.length >= 3) {
                // 对于较长的搜索词，检查是否包含关键字符
                let matchCount = 0;
                for (let i = 0; i < Math.min(searchTermLower.length, nameLower.length); i++) {
                    if (searchTermLower[i] === nameLower[i]) matchCount++;
                }
                if (matchCount >= searchTermLower.length * 0.6) {
                    score = 30;
                }
            }
        }

        // 确保分数不为负
        return Math.max(0, score);
    }

    // 检查searchTerm是否是text的子序列（字符按顺序出现）
    isSubsequence(searchTerm, text) {
        let textIndex = 0;
        let searchIndex = 0;

        while (textIndex < text.length && searchIndex < searchTerm.length) {
            if (text[textIndex] === searchTerm[searchIndex]) {
                searchIndex++;
            }
            textIndex++;
        }

        return searchIndex === searchTerm.length;
    }

    fuzzyMatch(text, searchTerm) {
        // 更宽松的模糊匹配算法
        text = text.toLowerCase();
        searchTerm = searchTerm.toLowerCase();

        // 精确匹配 - 最高优先级
        if (text.includes(searchTerm)) {
            return true;
        }

        // 分词匹配 - 使用更多分隔符
        const textWords = text.split(/[\s\-\_:&'"]+/);
        const searchWords = searchTerm.split(/[\s\-\_:&'"]+/);

        // 如果搜索词是多个词，只需要大部分词能匹配即可
        if (searchWords.length > 1) {
            let matchCount = 0;
            for (const searchWord of searchWords) {
                if (searchWord.length >= 2) {
                    for (const textWord of textWords) {
                        if (textWord.includes(searchWord) || textWord === searchWord ||
                            searchWord.includes(textWord)) {
                            matchCount++;
                            break;
                        }
                    }
                }
            }
            // 至少需要70%的词匹配
            return matchCount >= Math.ceil(searchWords.length * 0.7);
        }

        // 单词匹配 - 更宽松
        for (const textWord of textWords) {
            if (textWord.includes(searchTerm) || textWord === searchTerm ||
                searchTerm.includes(textWord)) {
                return true;
            }
        }

        // 对所有搜索词考虑拼写错误容忍
        for (const textWord of textWords) {
            if (textWord.length >= 3) {
                const distance = this.levenshteinDistance(textWord, searchTerm);
                const maxDistance = Math.min(3, Math.floor(textWord.length / 2));
                if (distance <= maxDistance) {
                    return true;
                }
            }
        }

        // 最后的兜底：检查是否包含搜索词的大部分字符
        if (searchTerm.length >= 3) {
            let matchCount = 0;
            for (const char of searchTerm) {
                if (text.includes(char)) {
                    matchCount++;
                }
            }
            if (matchCount >= searchTerm.length * 0.6) {
                return true;
            }
        }

        return false;
    }

    // 计算两个字符串的相似度（Jaro-Winkler距离的简化版本）
    calculateSimilarity(str1, str2) {
        if (str1 === str2) return 1.0;
        if (str1.length === 0 || str2.length === 0) return 0.0;

        const matchDistance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
        const str1Matches = new Array(str1.length);
        const str2Matches = new Array(str2.length);

        let matches = 0;
        let transpositions = 0;

        // 寻找匹配字符
        for (let i = 0; i < str1.length; i++) {
            const start = Math.max(0, i - matchDistance);
            const end = Math.min(i + matchDistance + 1, str2.length);

            for (let j = start; j < end; j++) {
                if (!str2Matches[j] && str1[i] === str2[j]) {
                    str1Matches[i] = true;
                    str2Matches[j] = true;
                    matches++;
                    break;
                }
            }
        }

        if (matches === 0) return 0.0;

        // 计算换位
        let k = 0;
        for (let i = 0; i < str1.length; i++) {
            if (str1Matches[i]) {
                while (!str2Matches[k]) k++;
                if (str1[i] !== str2[k]) transpositions++;
                k++;
            }
        }

        // Jaro距离
        const jaro = (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;

        // Winkler改进 - 给共同前缀更高权重
        let prefix = 0;
        const maxPrefix = Math.min(4, str1.length, str2.length);
        while (prefix < maxPrefix && str1[prefix] === str2[prefix]) prefix++;

        return jaro + (0.1 * prefix * (1 - jaro));
    }

    // 计算编辑距离（Levenshtein距离）
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,     // deletion
                    matrix[j - 1][i] + 1,     // insertion
                    matrix[j - 1][i - 1] + indicator // substitution
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    showSearchSuggestions(results, searchTerm) {
        if (!this.searchResults) {
            console.error('❌ Search results container not found');
            return;
        }

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="p-4 text-gray-500 text-center">
                    <div class="mb-2">🔍</div>
                    <div>No games found for "${searchTerm}"</div>
                    <div class="text-sm mt-2">Try different keywords</div>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map((game, index) => `
                <div class="search-result-item px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 ${index === 0 ? 'bg-gray-50' : ''}"
                     data-game-name="${game.name}"
                     data-game-file="${game.file}"
                     data-category="${game.category}">
                    <div class="w-12 h-12 bg-gradient-to-br ${this.getGameGradient(game)} rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-white text-lg">${this.getGameIcon(game)}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 truncate">${this.highlightMatch(game.name, searchTerm)}</div>
                        <div class="text-sm text-gray-500">${game.category} • Click to play</div>
                    </div>
                </div>
            `).join('');

            // 绑定点击事件
            this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const gameFile = item.dataset.gameFile;
                    if (gameFile) {
                        window.location.href = gameFile;
                    }
                });
            });
        }

        this.searchResults.classList.remove('hidden');
        this.isSearchVisible = true;
        this.currentFocus = -1;
    }

    highlightMatch(text, searchTerm) {
        if (!searchTerm) return text;

        // 转义HTML特殊字符
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };

        const escapedText = escapeHtml(text);
        const escapedSearchTerm = escapeHtml(searchTerm);

        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
        return escapedText.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>');
    }

    getGameGradient(game) {
        const gradients = {
            action: ['from-red-500 to-orange-500', 'from-orange-500 to-red-600', 'from-purple-600 to-red-600'],
            adventure: ['from-green-500 to-blue-500', 'from-emerald-500 to-teal-600', 'from-blue-600 to-green-500'],
            puzzle: ['from-purple-500 to-pink-500', 'from-indigo-500 to-purple-600', 'from-pink-500 to-rose-600'],
            sports: ['from-blue-500 to-cyan-500', 'from-green-500 to-emerald-600', 'from-blue-600 to-green-500']
        };

        const categoryGradients = gradients[game.category] || gradients.action;
        return categoryGradients[Math.floor(Math.random() * categoryGradients.length)];
    }

    getGameIcon(game) {
        const icons = {
            action: ['⚔️', '🔫', '💥', '🎯', '⚡'],
            adventure: ['🗡️', '🏰', '🗺️', '🧭', '⚓'],
            puzzle: ['🧩', '🎯', '🔍', '💡', '🎲'],
            sports: ['⚽', '🏀', '🏈', '⚾', '🎾']
        };

        const categoryIcons = icons[game.category] || icons.action;
        return categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
    }

    handleKeyNavigation(e) {
        if (!this.isSearchVisible) return;

        const items = this.searchResults.querySelectorAll('.search-result-item');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentFocus = Math.min(this.currentFocus + 1, items.length - 1);
                this.updateActiveItem(items);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.currentFocus = Math.max(this.currentFocus - 1, -1);
                this.updateActiveItem(items);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.currentFocus >= 0 && items[this.currentFocus]) {
                    items[this.currentFocus].click();
                } else {
                    this.performSearch();
                }
                break;

            case 'Escape':
                this.hideSearchResults();
                this.searchInput.blur();
                break;
        }
    }

    updateActiveItem(items) {
        // 移除所有active状态
        items.forEach(item => {
            item.classList.remove('bg-blue-50', 'border-l-4', 'border-blue-500');
            item.classList.add('hover:bg-gray-100');
        });

        // 添加active状态
        if (this.currentFocus >= 0 && items[this.currentFocus]) {
            const activeItem = items[this.currentFocus];
            activeItem.classList.remove('hover:bg-gray-100');
            activeItem.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500');

            // 滚动到可见区域
            activeItem.scrollIntoView({ block: 'nearest' });
        }
    }

    displaySearchResults(results, searchTerm) {
        console.log('🔍 displaySearchResults called with', results.length, 'results');

        // 隐藏所有原始游戏section
        const originalSections = document.querySelectorAll('section[id="action"], section[id="puzzle"], section[id="adventure"], section[id="sports"]');
        console.log('🔍 Hiding', originalSections.length, 'original sections');
        originalSections.forEach(section => section.style.display = 'none');

        // 显示或创建搜索结果容器
        let searchResultsContainer = document.getElementById('searchResultsContainer');
        if (!searchResultsContainer) {
            console.log('🔍 Creating search results container');
            searchResultsContainer = this.createSearchResultsContainer();
        }

        searchResultsContainer.style.display = 'block';
        console.log('🔍 Search results container now visible');

        // 清空并填充搜索结果
        const resultsGrid = searchResultsContainer.querySelector('.search-results-grid');
        resultsGrid.innerHTML = '';

        if (results.length === 0) {
            console.log('🔍 No results found, showing no results message');
            resultsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">No games found</h3>
                    <p class="text-gray-500">Try different keywords or browse our categories</p>
                </div>
            `;
        } else {
            console.log('🔍 Creating game cards for', results.length, 'games');
            results.forEach((game, index) => {
                const gameCard = this.createGameCard(game, searchTerm);
                resultsGrid.appendChild(gameCard);

                // 添加动画延迟效果
                setTimeout(() => {
                    gameCard.classList.add('search-match');
                    setTimeout(() => gameCard.classList.remove('search-match'), 500);
                }, index * 50);
            });
        }

        // 更新搜索结果统计
        this.showSearchResultsCount(results.length, searchTerm);
        console.log('🔍 Search results display complete');
    }

  createSearchResultsContainer() {
        const container = document.createElement('section');
        container.id = 'searchResultsContainer';
        container.className = 'py-16';
        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="search-results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <!-- 搜索结果将在这里动态生成 -->
                </div>
            </div>
        `;

        // 插入到第一个section前面
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(container, firstSection);
        } else {
            document.body.appendChild(container);
        }

        return container;
    }

    createGameCard(game, searchTerm) {
        const card = document.createElement('div');
        card.className = 'game-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 opacity-0';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        // 确定渐变色和图标
        const gradient = this.getGameGradient(game);
        const icon = this.getGameIcon(game);

        // 高亮匹配的文本
        const highlightedName = this.highlightMatch(game.name, searchTerm);

        card.innerHTML = `
            <div class="aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center">
                <span class="text-white text-4xl">${icon}</span>
            </div>
            <div class="p-4">
                <h4 class="font-bold mb-2">${highlightedName}</h4>
                <p class="text-sm text-gray-600 mb-3">${this.getGameDescription(game.category)}</p>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${game.category}</span>
                    <span class="text-xs text-gray-500">Score: ${game.relevanceScore || 0}</span>
                </div>
                <a href="${game.file}" class="w-full bg-apple-blue text-white py-2 rounded hover:bg-blue-600 transition-colors block text-center">Play Now</a>
            </div>
        `;

        // 延迟显示动画
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);

        return card;
    }

    getGameDescription(category) {
        const descriptions = {
            action: 'Exciting action-packed gameplay awaits!',
            adventure: 'Embark on an epic adventure!',
            puzzle: 'Challenge your mind with this puzzle!',
            sports: 'Competitive sports action!'
        };
        return descriptions[category] || 'Fun and engaging gameplay!';
    }

    showAllGames() {
        // 隐藏搜索结果容器
        const searchResultsContainer = document.getElementById('searchResultsContainer');
        if (searchResultsContainer) {
            searchResultsContainer.style.display = 'none';
        }

        // 显示所有原始游戏section
        const originalSections = document.querySelectorAll('section[id="action"], section[id="puzzle"], section[id="adventure"], section[id="sports"]');
        originalSections.forEach(section => {
            section.style.display = 'block';
        });

        // 显示所有游戏卡片
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.style.display = 'block';
        });

        // 清除搜索结果统计
        const countElement = document.getElementById('searchResultsCount');
        if (countElement) {
            countElement.remove();
        }
    }

    showSearchResultsCount(count, searchTerm) {
        let countElement = document.getElementById('searchResultsCount');

        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'searchResultsCount';
            countElement.className = 'text-center text-gray-600 mb-4';

            // 插入到第一个游戏section前面
            const firstSection = document.querySelector('section[id="action"], section[id="puzzle"], section[id="adventure"], section[id="sports"]');
            if (firstSection) {
                firstSection.parentNode.insertBefore(countElement, firstSection);
            }
        }

        if (count === 0) {
            countElement.innerHTML = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-2">No games found</h3>
                    <p class="text-yellow-700">No games match "${searchTerm}". Try different keywords or browse our categories below.</p>
                </div>
            `;
        } else {
            countElement.innerHTML = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="text-lg font-semibold text-blue-800">Search Results</h3>
                    <p class="text-blue-700">Found ${count} game${count > 1 ? 's' : ''} matching "${searchTerm}"</p>
                </div>
            `;
        }
    }

    clearSearchFilters() {
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.style.display = 'block';
        });

        // 移除搜索结果统计
        const countElement = document.getElementById('searchResultsCount');
        if (countElement) {
            countElement.remove();
        }
    }

    performSearch() {
        console.log('🔍 performSearch called');
        const searchTerm = this.searchInput.value.trim();
        console.log('🔍 Search term from input:', searchTerm);

        if (searchTerm) {
            console.log('🔍 Calling handleSearch with:', searchTerm);
            this.handleSearch(searchTerm);
            this.hideSearchResults();

            // 滚动到搜索结果
            const searchResultsContainer = document.getElementById('searchResultsContainer');
            if (searchResultsContainer) {
                console.log('🔍 Scrolling to search results');
                searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.log('🔍 Search results container not found for scrolling');
            }
        } else {
            console.log('🔍 Search term is empty');
        }
    }

    hideSearchResults() {
        this.searchResults.classList.add('hidden');
        this.isSearchVisible = false;
        this.currentFocus = -1;
    }

    // 公共方法：搜索特定游戏
    searchGame(gameName) {
        this.searchInput.value = gameName;
        this.handleSearch(gameName);
    }

    // 公共方法：清空搜索
    clearSearch() {
        this.searchInput.value = '';
        this.hideSearchResults();
        this.showAllGames();
    }
}

// 初始化搜索系统
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 DOM loaded, initializing enhanced search...');
    try {
        window.enhancedSearch = new EnhancedSearch();
        console.log('🔍 Enhanced search initialized successfully');

        // 添加搜索测试功能
        setTimeout(() => {
            if (window.enhancedSearch && window.enhancedSearch.allGames.length > 0) {
                console.log('🔍 Testing search functionality...');
                testSearchFunction();
            }
        }, 3000);
    } catch (error) {
        console.error('❌ Failed to initialize enhanced search:', error);
    }

    // 全局搜索函数（保持向后兼容）
    window.searchGames = () => {
        if (window.enhancedSearch && window.enhancedSearch.performSearch) {
            window.enhancedSearch.performSearch();
        } else {
            console.log('🔍 Using fallback search function');
            // 备用搜索函数
            const searchInput = document.getElementById('searchInput');
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                basicSearch(searchTerm);
            }
        }
    };

    // 基本搜索函数作为备用
    function basicSearch(searchTerm) {
        console.log('🔍 Using basic search for:', searchTerm);

        // 获取所有游戏卡片
        const gameCards = document.querySelectorAll('.game-card');
        let foundCount = 0;

        gameCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                foundCount++;
                // 添加高亮效果
                card.classList.add('search-match');
                setTimeout(() => card.classList.remove('search-match'), 1000);
            } else {
                card.style.display = 'none';
            }
        });

        // 显示结果统计
        alert(`Found ${foundCount} games matching "${searchTerm}"`);
    }

    // 全局清空搜索函数
    window.clearSearch = () => {
        window.enhancedSearch.clearSearch();
    };
});

// 搜索测试函数
function testSearchFunction() {
    if (!window.enhancedSearch) {
        console.error('❌ Enhanced search not available for testing');
        return;
    }

    const search = window.enhancedSearch;
    const testGames = [
        'Minecraft Classic',
        'Vex 3',
        'Geometry Dash',
        'Run 3',
        '2048',
        'Fireboy and Watergirl',
        'Drift Hunters',
        'Paper Minecraft'
    ];

    console.log('🧪 Testing search with sample games...');

    testGames.forEach(gameName => {
        const results = search.searchGames(gameName);
        const found = results.some(game =>
            game.name.toLowerCase().includes(gameName.toLowerCase())
        );

        if (found) {
            console.log(`✅ "${gameName}" - Found ${results.length} results`);
        } else {
            console.log(`❌ "${gameName}" - Not found! (Results: ${results.length})`);
            console.log('   Available similar games:', results.slice(0, 3).map(g => g.name));
        }
    });

    // 测试短搜索词
    console.log('\n🧪 Testing short search terms...');
    const shortTerms = ['mine', 'vex', 'run', 'car', 'drift'];

    shortTerms.forEach(term => {
        const results = search.searchGames(term);
        console.log(`"${term}": Found ${results.length} results`);
        if (results.length > 0) {
            console.log('  Top results:', results.slice(0, 3).map(g => g.name));
        }
    });
}

// 添加搜索快捷键支持
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // Escape 关闭搜索
    if (e.key === 'Escape' && window.enhancedSearch) {
        window.enhancedSearch.hideSearchResults();
    }
});

// Global function for search button onclick
function performEnhancedSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.enhancedSearch) {
        const query = searchInput.value.trim();
        if (query) {
            window.enhancedSearch.searchGame(query);
        }
    }
}
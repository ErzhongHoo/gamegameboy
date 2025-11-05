# 🎮 GameBoy - HTML5游戏平台

一个专为休闲玩家设计的HTML5在线游戏平台，提供免费的游戏体验，支持手机、平板和电脑多端访问。

## ✨ 特性

- 🎮 **多游戏分类**: 动作、益智、策略、体育、竞速、冒险
- 📱 **响应式设计**: 完美适配手机、平板、电脑
- 🔍 **智能搜索**: 实时搜索游戏名称和标签
- ⚡ **即点即玩**: 无需下载，HTML5技术直接运行
- 🎯 **用户友好**: 专为休闲玩家设计的简洁界面
- 🆓 **完全免费**: 所有游戏免费畅玩

## 🚀 快速开始

### 本地预览

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd gamegameboy
   ```

2. **使用本地服务器**
   ```bash
   # 使用Python
   python -m http.server 8000

   # 或使用Node.js
   npx serve .

   # 或使用PHP
   php -S localhost:8000
   ```

3. **打开浏览器**
   访问 `http://localhost:8000`

### 直接使用

直接双击 `index.html` 文件即可在浏览器中打开首页。

## 📁 项目结构

```
gamegameboy/
├── index.html                 # 网站首页
├── components/                # 组件模板
│   ├── header.html           # 导航栏组件
│   └── game-template.html    # 游戏页面模板
├── games/                    # 游戏页面
│   ├── action/               # 动作游戏
│   ├── puzzle/               # 益智游戏
│   ├── strategy/             # 策略游戏
│   ├── sports/               # 体育游戏
│   ├── racing/               # 竞速游戏
│   └── adventure/            # 冒险游戏
├── assets/                   # 静态资源
│   ├── css/
│   │   └── style.css         # 主样式文件
│   ├── js/
│   │   └── main.js           # 主JavaScript文件
│   └── images/               # 图片资源
├── scripts/                  # 构建脚本
│   └── generate-pages.js     # 批量页面生成脚本
└── README.md                 # 项目文档
```

## 🎮 添加新游戏

### 方法一：使用生成脚本（推荐）

1. **编辑游戏数据**

   在 `scripts/generate-pages.js` 文件中找到 `gamesData` 数组，添加新游戏信息：

   ```javascript
   {
       title: "游戏名称",
       description: "游戏描述",
       category: "游戏分类",
       categoryName: "分类中文名",
       iframeUrl: "https://your-game-url.com",
       screenshotUrl: "assets/images/games/game-screenshot.jpg",
       controls: [
           { key: "操作键", action: "操作说明" }
       ],
       tags: ["标签1", "标签2"],
       difficulty: "难度等级"
   }
   ```

2. **运行生成脚本**
   ```bash
   node scripts/generate-pages.js
   ```

### 方法二：手动创建

1. 复制现有的游戏页面模板
2. 根据模板中的占位符替换为实际内容
3. 确保图片和链接路径正确

## 🎨 自定义样式

### 主要颜色修改

在 `assets/css/style.css` 文件中修改以下CSS变量：

```css
:root {
    --primary-color: #667eea;     /* 主色调 */
    --secondary-color: #764ba2;   /* 辅助色 */
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 响应式断点

- **移动端**: `< 768px`
- **平板端**: `768px - 1024px`
- **桌面端**: `> 1024px`

## 🔧 配置说明

### 游戏iframe设置

确保你的游戏iframe支持以下属性：

```html
<iframe
    src="游戏URL"
    frameborder="0"
    allowfullscreen
    loading="lazy"
    width="100%"
    height="600">
</iframe>
```

### 游戏截图要求

- **尺寸**: 16:9 比例
- **格式**: JPG 或 PNG
- **大小**: 小于 200KB
- **命名**: 使用英文名称，如 `space-shooter.jpg`

## 📊 SEO优化

项目已内置SEO优化：

- ✅ 语义化HTML结构
- ✅ Meta标签优化
- ✅ Open Graph支持
- ✅ 响应式图片
- ✅ 友好的URL结构
- ✅ 结构化数据

## 🌐 部署指南

### 静态托管平台

#### GitHub Pages
1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源

#### Netlify
1. 连接GitHub仓库
2. 设置构建命令为空（静态站点）
3. 发布目录为根目录

#### Vercel
1. 导入项目
2. 框架预设选择"Other"
3. 构建设置保持默认

### 自托管

1. **上传文件到服务器**
   ```bash
   scp -r * user@your-server:/var/www/html/
   ```

2. **配置Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

## 🎯 功能特性

### 搜索功能
- 实时搜索游戏名称
- 支持标签搜索
- 键盘导航支持
- 搜索历史记录

### 社交分享
- Twitter分享
- Facebook分享
- Reddit分享
- 自定义分享文案

### 用户偏好
- 游戏历史记录
- 收藏功能（localStorage）
- 个性化推荐

## 📱 移动端优化

- 触摸友好的交互设计
- 优化的虚拟按键布局
- 横屏/竖屏自适应
- 减少数据使用量

## 🔄 性能优化

- 图片懒加载
- CSS/JS压缩
- 缓存策略
- CDN就绪

## 🐛 故障排除

### 游戏无法加载
1. 检查iframe URL是否正确
2. 确认游戏域名是否支持iframe嵌入
3. 检查网络连接

### 搜索功能不工作
1. 确认JavaScript文件正确加载
2. 检查浏览器控制台错误信息
3. 验证游戏数据格式

### 样式显示异常
1. 检查CSS文件路径
2. 清除浏览器缓存
3. 验证响应式断点

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📞 联系我们

- 📧 Email: contact@gameboy.com
- 🐦 Twitter: @GameBoyPlatform
- 📘 Facebook: /GameBoyPlatform

---

**🎮 享受游戏，快乐生活！**
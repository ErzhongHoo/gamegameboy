# 🚀 GameBoy 部署指南

本指南将帮助你将 GameBoy HTML5游戏平台部署到生产环境。

## 📋 部署前检查清单

### 必要修改
- [ ] 更新 `scripts/generate-pages.js` 中的 `iframeUrl` 为实际游戏链接
- [ ] 添加真实的游戏截图到 `assets/images/games/` 目录
- [ ] 根据需要调整网站标题和描述
- [ ] 检查所有页面链接是否正确

### 可选优化
- [ ] 压缩CSS和JavaScript文件
- [ ] 优化图片大小
- [ ] 配置自定义域名
- [ ] 设置网站分析工具

## 🌐 静态托管平台部署

### 1. GitHub Pages (推荐)

#### 步骤：
1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/gameboy.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库设置 (Settings)
   - 找到 Pages 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - 文件夹选择 "/ (root)"
   - 点击 Save

3. **访问网站**
   - URL: `https://yourusername.github.io/gameboy/`

### 2. Netlify

#### 自动部署：
1. 访问 [netlify.com](https://netlify.com)
2. 用GitHub账号登录
3. 点击 "New site from Git"
4. 选择GitHub仓库
5. 构建设置：
   - Build command: 留空
   - Publish directory: `.` (根目录)
6. 点击 "Deploy site"

#### 手动部署：
1. 创建 `netlify.toml` 文件：
   ```toml
   [build]
     publish = "."

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "SAMEORIGIN"
       X-Content-Type-Options = "nosniff"
   ```

2. 拖拽项目文件夹到 Netlify 部署界面

### 3. Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入GitHub仓库
3. 项目设置：
   - Framework Preset: Other
   - Root Directory: 留空
   - Build Command: 留空
   - Output Directory: 留空
4. 点击 Deploy

### 4. Surge.sh

```bash
# 安装 Surge
npm install -g surge

# 部署
surge --domain gameboy.surge.sh
```

## 🖥️ 自托管部署

### Nginx 配置

创建 `/etc/nginx/sites-available/gameboy` 文件：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/gameboy;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/css text/javascript application/javascript application/json;

    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 错误页面
    error_page 404 /index.html;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/gameboy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache 配置

创建 `.htaccess` 文件：

```apache
# 启用重写引擎
RewriteEngine On

# 强制 HTTPS (可选)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 缓存设置
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# 压缩
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css text/javascript application/javascript application/json
</IfModule>

# 安全头
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

## 🔧 性能优化

### 1. 图片优化

```bash
# 安装图片优化工具
npm install -g imagemin imagemin-cli imagemin-mozjpeg imagemin-pngquant

# 优化图片
imagemin assets/images/* --out-dir=assets/images/optimized
```

### 2. CSS/JS 压缩

```bash
# 安装压缩工具
npm install -g clean-css-cli uglify-js

# 压缩 CSS
cleancss -o assets/css/style.min.css assets/css/style.css

# 压缩 JS
uglifyjs assets/js/main.js -o assets/js/main.min.js
```

### 3. CDN 配置

使用 Cloudflare 作为 CDN：

1. 注册 Cloudflare 账号
2. 添加域名
3. 更新域名服务器
4. 配置缓存规则

## 📊 监控和分析

### Google Analytics

在 `index.html` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 其他分析工具

- **Hotjar**: 用户行为分析
- **Mixpanel**: 事件跟踪
- **Plausible**: 隐私友好的分析

## 🔒 安全配置

### HTTPS 证书

#### Let's Encrypt (免费)

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

### 安全头配置

确保服务器返回以下安全头：

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval'
```

## 🚀 CI/CD 自动部署

### GitHub Actions

创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Build
      run: |
        npm install -g clean-css-cli
        cleancss -o assets/css/style.min.css assets/css/style.css

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📝 部署后验证

### 检查清单
- [ ] 网站可以正常访问
- [ ] 所有链接工作正常
- [ ] 游戏可以正常加载
- [ ] 搜索功能正常
- [ ] 响应式设计正常
- [ ] SEO 标签正确
- [ ] 社交分享功能正常
- [ ] 性能测试通过

### 测试工具

- **Google PageSpeed Insights**: 性能测试
- **GTmetrix**: 网站性能分析
- **WebPageTest**: 详细性能报告
- **Lighthouse**: 综合质量评估

## 🔧 故障排除

### 常见问题

1. **游戏无法加载**
   - 检查 iframe URL 是否正确
   - 确认游戏域名支持跨域嵌入
   - 检查控制台错误信息

2. **样式显示异常**
   - 清除浏览器缓存
   - 检查 CSS 文件路径
   - 验证文件权限

3. **搜索功能不工作**
   - 确认 JavaScript 文件正确加载
   - 检查浏览器控制台错误
   - 验证游戏数据格式

4. **移动端显示问题**
   - 检查 viewport 设置
   - 验证响应式断点
   - 测试不同设备

## 📞 支持

如果在部署过程中遇到问题，请：

1. 查看控制台错误信息
2. 检查服务器日志
3. 验证文件权限
4. 参考本文档故障排除部分

---

**🎮 祝你部署成功！**
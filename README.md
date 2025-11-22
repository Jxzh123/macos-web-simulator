🍎 MacOS Web Simulator (AI-Powered)这是一个基于 Web 技术构建的高仿真 macOS 桌面环境模拟器。它不仅还原了经典的 UI/UX 细节（如 Dock 栏动画、窗口拖拽、毛玻璃效果），还集成了 Google Gemini API，赋予了系统真正的智能交互能力。✨ 核心特性 (Features)🖥️ 桌面环境:完整窗口管理系统（拖拽移动、八方向缩放、置顶层级）。高仿真 Dock 栏（鱼眼放大动画）。顶部菜单栏与控制中心（调节亮度、音量）。开机动画与 Launchpad 启动台。右键上下文菜单与动态壁纸切换。🤖 AI 深度集成:Gemini Assistant: 类似 Siri 的智能助手，支持自然语言对话。VS Code AI: 点击魔法棒图标，AI 自动分析并解释当前代码。💻 黑客终端 (Terminal):支持交互式指令 (help, about, projects)。打字机效果: 模拟真实数据回传的视觉体验。🛠️ 内置应用:Safari (模拟浏览器 UI)。Settings (设置壁纸)。Finder (文件管理器 UI)。🛠️ 技术栈 (Tech Stack)核心框架: React 18构建工具: Vite样式库: Tailwind CSS v3图标库: Lucide ReactAI 模型: Google Gemini API部署: Caddy (推荐) / Nginx🚀 快速开始 (Development)1. 安装依赖确保你的环境中有 Node.js (v18+)。npm install
# 确保安装了 Tailwind CSS 及其依赖
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react
2. 配置 API Key (可选)为了使用 AI 功能，请在 src/MacOSSimulator.jsx 中填入你的 Google Gemini API Key：const apiKey = "YOUR_GEMINI_API_KEY";
3. 本地运行npm run dev
访问 http://localhost:5173 即可预览。🌐 部署指南 (Deployment)本项目是静态单页应用 (SPA)，构建后生成纯静态 HTML/CSS/JS 文件。1. 构建项目npm run build
# 构建产物位于 ./dist 目录
方案 A: 使用 Caddy (推荐) ✨Caddy 自动管理 HTTPS 证书，配置极其简洁。安装 Caddy (Ubuntu):sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf '[https://dl.cloudsmith.io/public/caddy/stable/gpg.key](https://dl.cloudsmith.io/public/caddy/stable/gpg.key)' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf '[https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt](https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt)' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
修改配置 (/etc/caddy/Caddyfile):你的域名.com {
    # 指向构建好的 dist 目录
    root * /var/www/macos-web/dist

    # 开启 Gzip 压缩
    encode gzip

    # 静态文件服务
    file_server

    # SPA 路由重定向 (防止刷新 404)
    try_files {path} /index.html
}
重载配置:sudo systemctl reload caddy
方案 B: 使用 Nginx如果你更习惯 Nginx：配置文件 (/etc/nginx/sites-available/macos):server {
    listen 80;
    server_name 你的域名.com;

    root /var/www/macos-web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
启用并重启:sudo ln -s /etc/nginx/sites-available/macos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
🤝 贡献与开发欢迎提交 Pull Request 或 Issue 来改进这个模拟器！Fork 本仓库创建你的特性分支 (git checkout -b feature/AmazingFeature)提交更改 (git commit -m 'Add some AmazingFeature')推送到分支 (`git push origin feature

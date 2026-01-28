# 院前培训报名系统 - H5培训前台

基于 Vue 3 + Vite 构建的现代化院前培训报名系统前端应用，提供用户友好的课程浏览、报名和个人信息管理功能。

## 技术栈

- **Vue 3.5.24** - 渐进式 JavaScript 框架
- **Vue Router 4.6.4** - 官方路由管理器
- **Axios 1.13.3** - HTTP 客户端
- **Vite 7.2.5** - 下一代前端构建工具
- **JavaScript ES6+** - 现代化 JavaScript 语法

## 主要功能

### 1. 用户认证
- 用户注册（邮箱、密码、电话、单位/组织）
- 用户登录（邮箱 + 密码）
- 微信登录集成（OAuth 2.0 授权）
- JWT 令牌认证
- 自动登录状态管理（LocalStorage）

### 2. 课程浏览
- 课程列表展示（卡片式布局）
- 课程搜索功能（标题和描述）
- 课程状态筛选（未开始、进行中、已结束）
- 无限滚动加载（默认每页10条课程）
- 课程详情展开/折叠
- 报名人数实时显示
- 课程状态智能提示（已报满、已报名、已结束、未开始）

### 3. 课程报名
- 一键报名功能
- 报名状态实时更新
- 报名人数限制检查
- 报名时间限制检查
- 防重复报名机制

### 4. 我的课程
- 个人报名记录查看
- 课程详细信息展示
- 报名时间记录
- 空状态友好提示

### 5. 个人信息管理
- 基本信息编辑（用户名、邮箱、电话、单位/组织、地址）
- 密码修改功能
- 微信手机号授权集成
- 信息实时保存和更新

### 6. 响应式设计
- H5 移动设备适配
- 平板和桌面端优化
- 触摸友好的交互设计
- 自适应布局调整

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── assets/        # 资源文件
│   ├── components/     # Vue 组件
│   ├── router/         # 路由配置
│   │   └── index.js
│   ├── views/         # 页面组件
│   │   ├── Home.vue          # 首页课程列表
│   │   ├── Login.vue         # 登录页面
│   │   ├── Register.vue      # 注册页面
│   │   ├── MyCourses.vue     # 我的课程
│   │   └── UserProfile.vue   # 个人信息管理
│   ├── App.vue        # 根组件
│   ├── main.js        # 应用入口
│   └── style.css      # 全局样式
├── index.html         # HTML 模板
├── package.json      # 项目配置
└── vite.config.js    # Vite 配置
```

## 路由配置

| 路径 | 组件 | 功能描述 |
|--------|--------|----------|
| `/` | Home.vue | 首页课程列表 |
| `/register` | Register.vue | 用户注册 |
| `/login` | Login.vue | 用户登录 |
| `/my-courses` | MyCourses.vue | 我的报名记录 |
| `/user-profile` | UserProfile.vue | 个人信息管理 |

## API 集成

### 基础配置
- **后端地址**: `http://localhost:5000`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

### 主要 API 端点

#### 用户认证
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/user-info` - 获取用户信息
- `GET /api/wechat/login` - 微信登录授权
- `GET /api/wechat/callback` - 微信登录回调

#### 课程管理
- `GET /api/courses` - 获取课程列表（支持分页、搜索、筛选）
- `GET /api/courses/:id` - 获取单个课程详情
- `POST /api/register-course` - 课程报名
- `GET /api/user-registrations/:userId` - 获取用户报名记录

#### 个人信息
- `GET /api/user-profile` - 获取个人信息
- `PUT /api/user-profile` - 更新个人信息
- `POST /api/change-password` - 修改密码
- `GET /api/wechat/phone-auth` - 微信手机号授权

### 分页参数
```
GET /api/courses?page=1&per_page=10&search=急救&status=ongoing
```

- `page`: 页码（默认1）
- `per_page`: 每页数量（默认10）
- `search`: 搜索关键词
- `status`: 状态筛选（upcoming/ongoing/ended）

## 开发指南

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```
构建输出到 `dist/` 目录

### 预览生产构建
```bash
npm run preview
```

## 核心功能实现

### 无限滚动加载
- 默认每页显示10条课程
- 滚动到距离底部100px时自动加载下一页
- 加载状态动画显示
- 无更多数据提示

### 课程状态判断
- **未开始**: 当前时间 < 报名开始时间
- **进行中**: 报名开始时间 ≤ 当前时间 ≤ 报名结束时间
- **已结束**: 当前时间 > 报名结束时间
- **已报满**: 报名人数 ≥ 课程容量
- **已报名**: 用户已报名该课程

### 微信集成
- 微信 OAuth 2.0 登录流程
- 微信手机号授权获取
- 微信用户信息同步
- 微信用户标识存储

## 样式特点

### 设计规范
- **主色调**: #4CAF50（绿色）
- **微信色**: #07C160
- **字体**: Arial, sans-serif
- **圆角**: 4px-8px
- **阴影**: 0 2px 8px rgba(0, 0, 0, 0.1)

### 响应式断点
- **移动端**: ≤ 768px
- **平板端**: 769px - 1024px
- **桌面端**: ≥ 1025px

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 移动浏览器（iOS Safari, Chrome Mobile）

## 性能优化

- 组件懒加载
- 图片懒加载
- 防抖处理（搜索输入）
- 节流处理（滚动事件）
- 虚拟滚动（大列表优化）

## 安全特性

- XSS 防护（Vue 自动转义）
- CSRF 防护（JWT 令牌）
- HTTPS 支持（生产环境）
- 密码加密传输
- 敏感信息本地加密存储

## 开发注意事项

### 环境变量
如需配置不同环境，创建 `.env` 文件：
```
VITE_API_BASE_URL=http://localhost:5000
```

### 代理配置
在 `vite.config.js` 中配置开发代理：
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

## 常见问题

### 1. 跨域问题
确保后端配置了 CORS：
```python
from flask_cors import CORS
CORS(app)
```

### 2. 登录状态丢失
检查 LocalStorage 是否启用，清除浏览器缓存后重试。

### 3. 微信登录失败
确保微信 AppID 和 AppSecret 配置正确，回调地址已设置。

## 未来规划

- [ ] 课程收藏功能
- [ ] 课程评价系统
- [ ] 消息通知中心
- [ ] 离线模式支持
- [ ] PWA 应用支持
- [ ] 多语言国际化

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。

---

**最后更新**: 2026-01-28
**版本**: 1.0.0

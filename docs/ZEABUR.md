# Zeabur 部署指南（替代腾讯云 COS）

本项目的餐食图片使用 **API 本机磁盘 + 持久卷**，通过 `PUBLIC_BASE_URL` 生成可访问 URL，无需腾讯云 COS。

推荐用 **GitHub 关联仓库**：推送到 `main` 后 Zeabur 自动构建、部署（CI/CD）。

---

## 一、通过 GitHub 部署（推荐）

### 1. 准备仓库

1. 在 GitHub 新建仓库（或已有仓库），把本项目推上去。
2. **不要**提交 `apps/api/.env`（已在 `.gitignore` 中忽略）。
3. 确认仓库里已有 `apps/api/Dockerfile`（本仓库已包含）。

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 绑定 GitHub 与 Zeabur

1. 打开 [Zeabur 控制台](https://dash.zeabur.com)。
2. 若用邮箱注册：进入 **Settings → Integrations**，先 **连接 GitHub**。
3. 首次导入项目时，按提示在 GitHub 安装 **Zeabur App**，并勾选要部署的仓库（个人或组织均可）。

### 3. 创建项目与服务

1. **Create Project** → 选择 **Deploy from GitHub**。
2. 搜索并选中你的仓库 → 创建项目。
3. 在同一项目内 **Add Service** → **Database** → **PostgreSQL**（Zeabur 模板）。
4. 再 **Add Service** → 仍选 **GitHub** → 选**同一个仓库**（一个仓库可部署多个服务）。

### 4. 配置 API 服务（关键）

在 API 服务的 **Settings** 中设置：

| 配置项 | 值 |
|--------|-----|
| **Root Directory** | `apps/api` |
| **部署方式** | Dockerfile（Zeabur 会识别 `apps/api/Dockerfile`） |

> 若未自动识别 Dockerfile：在 **Build** 里选 Dockerfile，路径填 `Dockerfile`（相对 Root Directory，即 `apps/api/Dockerfile`）。

**环境变量**（Variables）：在 PostgreSQL 服务里复制 `DATABASE_URL`，并补充：

```env
DATABASE_URL=postgresql://...   # 从 Postgres 服务「连接」复制
PORT=3000
JWT_SECRET=随机长字符串-至少32位
ADMIN_JWT_SECRET=另一段随机字符串
ZHIPU_API_KEY=你的智谱密钥
LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_VISION_MODEL=glm-4.6v
PUBLIC_BASE_URL=https://你的-api-xxx.zeabur.app
UPLOAD_DIR=/data/uploads/meals
UPLOAD_STATIC_ROOT=/data/uploads
CORS_ORIGIN=https://你的-admin-xxx.zeabur.app
```

`PUBLIC_BASE_URL` 可先留空，**首次部署成功**后在服务 **Networking / Domains** 里看到 HTTPS 域名，再回来改成该地址并 **Redeploy**。

**持久卷（餐图）**

1. API 服务 → **Volumes** → Add Volume。
2. 挂载路径：`/data`。
3. 保存后重新部署。

**绑定数据库**

- 在 API 服务的 **Connect** / **Service Binding** 中关联 PostgreSQL，或手动粘贴 `DATABASE_URL`。

### 5. 首次部署后初始化数据

部署日志里应看到 `prisma migrate deploy` 成功。种子数据需执行一次：

1. API 服务 → **Terminal / Shell**（或 Zeabur CLI）。
2. 执行：

```bash
sh scripts/seed-zeabur.sh
```

或（一行命令）：

```bash
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}' npx ts-node --transpile-only --project tsconfig.seed.json prisma/seed.ts
```

（生产镜像无 devDependencies，不要用普通 `npm run prisma:seed`。）

默认管理员：`admin` / `admin123`（生产请改 `ADMIN_DEFAULT_PASSWORD` 后重新 seed 或改库）。

### 6. 自动部署（CI/CD）

关联 GitHub 后，默认行为：

- 向 **`main`**（或你在 Zeabur 里绑定的分支）**push** → 自动触发 API 重新构建、部署。
- 可在服务 **Settings → Git** 中改分支、开关自动部署。

### 7. 管理后台（可选，第二个 GitHub 服务）

同一项目再 **Add Service** → 同一 GitHub 仓库：

| 配置项 | 值 |
|--------|-----|
| Root Directory | `apps/admin` |
| 类型 | 若 Zeabur 识别为 Node/Vite，用 **zbpack** 构建；或自建 `Dockerfile` |

构建命令一般为 `npm install && npm run build`，输出目录 `dist`。  
Admin 当前开发态用 `/api` 代理；**生产**需在构建时注入 API 地址（例如在 `vite.config` 用 `VITE_API_BASE`），并把 `client.ts` 的 `baseURL` 改为该变量——若你尚未改代码，可暂时只部署 API，本地 `npm run dev:admin` 连 Zeabur API。

### 8. 小程序

`apps/miniprogram/app.js`：

```js
apiBase: 'https://你的-api-域名.zeabur.app/api/v1',
```

微信公众平台 → 开发管理 → 服务器域名 → **request 合法域名** 填 API 的 HTTPS 域名（不含路径）。

---

## 二、服务组成

| 服务 | 说明 |
|------|------|
| PostgreSQL | Zeabur 一键创建，复制 `DATABASE_URL` |
| API (`apps/api`) | NestJS，根目录 Dockerfile |
| Admin（可选） | `apps/admin` 静态站，需配置反向代理到 API |

## 三、API 环境变量

```env
DATABASE_URL=postgresql://...
PORT=3000
JWT_SECRET=your-secret
ZHIPU_API_KEY=...
LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_MODEL=glm-4v-flash

# 公网访问根地址（不要末尾斜杠）
PUBLIC_BASE_URL=https://你的-api-域名.zeabur.app

# 上传目录：挂载持久卷后使用绝对路径
UPLOAD_DIR=/data/uploads/meals
UPLOAD_STATIC_ROOT=/data/uploads

# 管理后台 / 本地开发跨域
CORS_ORIGIN=https://你的-admin-域名.zeabur.app,http://localhost:5173
```

## 四、持久卷（餐食图片）

1. 在 Zeabur API 服务添加 **Volume**，挂载路径 `/data`
2. 设置 `UPLOAD_DIR=/data/uploads/meals`、`UPLOAD_STATIC_ROOT=/data/uploads`
3. 图片 URL 形如：`https://你的-api.zeabur.app/uploads/meals/xxx.jpg`

重启或重新部署后，卷内文件会保留（替代对象存储）。

## 五、构建说明（GitHub + Dockerfile）

- **Root Directory**：`apps/api`（必须，否则 monorepo 根目录没有 `package.json`）
- **Dockerfile**：`apps/api/Dockerfile`（启动前自动 `prisma migrate deploy`）
- 推送 GitHub 即触发构建；无需本地上传镜像

## 六、小程序对接

将 `apps/miniprogram/app.js` 中 `apiBase` 改为：

```js
apiBase: 'https://你的-api-域名.zeabur.app/api/v1',
```

微信公众平台需配置 **request 合法域名** 为上述 HTTPS 域名。

## 七、启动报错 `Cannot find module '/app/dist/main.js'`

Nest 编译输出在 **`dist/src/main.js`**（不是 `dist/main.js`）。

**任选一种修复：**

1. **设置 → 启动命令** 改为：  
   `npx prisma migrate deploy && node dist/src/main.js`
2. 或 **设置 → 部署方式** 选 **Dockerfile**（仓库 `apps/api/Dockerfile` 已修正路径）。
3. 拉取最新代码后重新部署（含 `apps/api/zbpack.json`）。

---

## 八、常见问题

| 现象 | 处理 |
|------|------|
| 构建失败「找不到 package.json」 | Root Directory 未设为 `apps/api` |
| 启动后 500 / 数据库错误 | 检查 `DATABASE_URL`、Postgres 是否同项目、是否已 `migrate deploy` |
| 识别图 404 | 检查 Volume `/data`、`UPLOAD_DIR`、`PUBLIC_BASE_URL` 是否一致 |
| 推代码不自动部署 | Settings → Git 查看分支是否为 `main`、Auto Deploy 是否开启 |
| GitHub 搜不到仓库 | GitHub → Settings → Applications → Zeabur → 给仓库授权 |

## 九、本地开发

不设置 `PUBLIC_BASE_URL` 时，返回相对路径 `/uploads/meals/...`，由本机 `http://localhost:3000` 提供静态文件。

# 卡路里与营养分析

微信小程序 + NestJS API + Vue 管理后台。需求见 [plan.md](./plan.md)、[prd.md](./prd.md)，规范见 [standard.md](./standard.md)。**高保真原型**见 [design/PROTOTYPE.md](./design/PROTOTYPE.md)（浏览器打开 `design/prototype/index.html` 预览）。

## 技术栈

| 模块 | 路径 | 说明 |
|------|------|------|
| API | `apps/api` | NestJS + Prisma + PostgreSQL |
| 管理后台 | `apps/admin` | Vue 3 + Vite + Element Plus |
| 小程序 | `apps/miniprogram` | 微信原生 |

## 环境要求

- Node.js ≥ 20
- **PostgreSQL 16**（本机安装，或 Docker 二选一）
- 微信开发者工具（调试小程序）

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动数据库

**方式 A：Docker（推荐）**

```bash
npm run docker:up
```

**方式 B：本机 PostgreSQL（无 Docker 时）**

1. 安装 [PostgreSQL 16 for Windows](https://www.postgresql.org/download/windows/)（安装向导里记住 **postgres 超级用户密码**，端口保持 **5432**）。
2. 打开 **SQL Shell (psql)** 或 pgAdmin，用 postgres 登录后执行：

```sql
CREATE USER calorie WITH PASSWORD 'calorie_dev';
CREATE DATABASE calorie_analysis OWNER calorie;
GRANT ALL PRIVILEGES ON DATABASE calorie_analysis TO calorie;
```

3. 确认 `apps/api/.env` 中连接串为（与仓库默认一致）：

```text
DATABASE_URL="postgresql://calorie:calorie_dev@localhost:5432/calorie_analysis?schema=public"
```

若你只用安装时的 `postgres` 用户，可改为：

```text
DATABASE_URL="postgresql://postgres:你的密码@localhost:5432/calorie_analysis?schema=public"
```

（需先 `CREATE DATABASE calorie_analysis;`）

4. 验证端口已监听（PowerShell）：

```powershell
Test-NetConnection localhost -Port 5432
```

`TcpTestSucceeded` 为 `True` 后再执行下方「迁移与种子数据」。

**排错：`P1001 Can't reach localhost:5432`**

本机 PostgreSQL 有时只监听 **IPv6**（`[::]:5432`），pgAdmin 能连，但 Prisma 连 `localhost` / `127.0.0.1` 会失败。请把 `apps/api/.env` 里的主机改为 **`[::1]`**：

```text
DATABASE_URL="postgresql://postgres:你的安装密码@[::1]:5432/calorie_analysis?schema=public"
```

若出现 **`P1000 Authentication failed`**：说明已能连上库，但用户名/密码不对。建库时 Owner 若是 **postgres**，就用 postgres 及其安装密码；若已建 **calorie** 用户，再用 `calorie:calorie_dev`。

**`.env` 写法（Windows + IPv6）**：`DATABASE_URL` 建议**不要加引号**，一行写完，例如：

```text
DATABASE_URL=postgresql://postgres:你的密码@[::1]:5432/calorie_analysis?schema=public
```

若带引号或注释里含 `[::1]` 导致 Prisma CLI 报 `empty host`，去掉引号并简化 `.env` 即可。

> 若未安装 Docker，请使用方式 B；有 Docker 可用方式 A：`npm run docker:up`。

### 3. 迁移与种子数据

```bash
cd apps/api
npx prisma migrate deploy
npm run prisma:seed
```

开发环境也可用 `npx prisma migrate dev`。仓库根目录：`npm run db:migrate`、`npm run db:seed`。

**食物库：** 种子在 `apps/api/prisma/seeds/`（`base-foods`、`chinese-foods*`、`chinese-regional`、`fastfood-convenience`、`international-foods`、`coarse-grain-foods`），当前约 **352** 条（含粗粮：莜面/豆面/玉米面等，见 `coarse-grain-foods.ts`）。别名注册表：`alias-registry.ts` + `alias-registry-ext.ts`。别名来源三处合并：

1. 每条食物自带的 `aliases`
2. 全局注册表 `alias-registry.ts`（口语/外卖名/简称）
3. 自动简称（如「黄焖鸡米饭」→「黄焖鸡」）

重复执行 `npm run db:seed` 会**合并别名**（去重、不删已有别名）并更新营养字段。识别与搜索共用 `food-matching.util.ts`（分词 + 规则表 + 模糊打分）。

### 4. 启动 API

```bash
npm run dev:api
```

健康检查：<http://localhost:3000/api/v1/health>

### 5. 启动管理后台

```bash
npm run dev:admin
```

浏览器打开 <http://localhost:5173>，默认账号 `admin` / `admin123`。

### 6. 小程序

1. 用微信开发者工具打开目录 `apps/miniprogram`
2. 详情 → 本地设置 → 勾选「不校验合法域名」
3. `app.js` 中 `apiBase` 指向本机 API（真机调试需改为局域网 IP）
4. 编译运行

**M1 小程序页面**

| 页面 | 说明 |
|------|------|
| 今日 `index` | 按日切换（‹ › / 日期选择）、达标状态、热量与营养素、当日记录；非今天隐藏「+」 |
| 趋势 `trend` | 近 7 / 14 日热量与蛋白柱图、日均小结 |
| 记录 `record` | 拍照识别、多选批量、搜索食物 → 识别结果 / 确认页 |
| 确认 `confirm` | 餐次、份量、营养预估、确认入账 |
| 我的 `profile` | 身体数据、切换模式、今日目标、隐私说明 |
| 引导 `onboarding` | 新用户必填资料；可从「我的」修改资料进入 |

## 主要 API（M0）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/wechat` | 微信登录（无配置时用 dev openid） |
| GET | `/api/v1/users/me` | 当前用户资料 |
| PATCH | `/api/v1/users/me` | 更新资料 / 切换模式 |
| GET | `/api/v1/foods?q=` | 搜索食物 |
| GET | `/api/v1/food-logs/daily-summary?date=` | 指定日期汇总（默认今天） |
| GET | `/api/v1/food-logs/weekly-trend?days=` | 7/14 日趋势 |
| POST | `/api/v1/food-logs` | 新增饮食记录 |
| POST | `/api/v1/recognition/analyze` | 提交拍照识别任务，立即返回 `{ taskId, status: "processing" }` |
| GET | `/api/v1/recognition/tasks/:taskId` | 轮询识别结果，`status`: `processing` / `completed` / `failed` |
| POST | `/api/v1/admin/auth/login` | 后台登录 |

## 里程碑

- **M0（当前）**：工程骨架、库表、微信登录、空壳小程序与后台
- **M1**：手动选食物完善、五模式目标、当日仪表盘
- **M2**：真实拍照识别 + 确认流
- **M3**：7 日趋势、后台食物 CRUD 表单、模式编辑

## 配置

复制根目录 [.env.example](./.env.example) 到 `apps/api/.env`，填写 `WECHAT_APP_ID` / `WECHAT_APP_SECRET` 后可在真机使用正式微信登录。

### 拍照识别（推荐智谱 GLM 视觉）

在 `apps/api/.env` 中配置 [智谱开放平台](https://open.bigmodel.cn/usercenter/proj-mgmt/apikeys) 密钥：

```text
ZHIPU_API_KEY=你的密钥
LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
LLM_VISION_MODEL=glm-4.6v
LLM_PROVIDER=zhipu
```

小程序拍照后将图片 **Base64** 提交至 `POST /recognition/analyze` 创建任务，再轮询 `GET /recognition/tasks/:taskId` 获取结果（避免长连接超时）。由 GLM 识别菜名与热量估算后匹配食物库。未配置密钥时自动降级为开发用 mock。

**说明：** DeepSeek V4 官方 API 目前为纯文本、不支持传图；拍照识别请使用 GLM、通义 VL 等多模态模型。

### 餐图存储（本地 / Zeabur 持久卷）

识别时图片会保存到 `apps/api/uploads/meals/`，并通过 `http://localhost:3000/uploads/meals/xxx.jpg` 写入 `recognition_tasks.image_url`。

可选环境变量（`apps/api/.env`）：

```text
UPLOAD_DIR=uploads/meals
PUBLIC_BASE_URL=http://localhost:3000
```

生产环境推荐 [Zeabur + GitHub 部署](docs/ZEABUR.md)：仓库关联 Zeabur 后 push 即自动发布；挂载持久卷 `/data` 存餐图，无需腾讯云 COS。

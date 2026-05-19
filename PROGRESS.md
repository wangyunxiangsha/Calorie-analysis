# 项目进度总结

> 卡路里与营养分析（暂定品牌「食光」）  
> 更新日期：2026-05-17

---

## 当前状态概览

| 里程碑 | 状态 | 一句话 |
|--------|------|--------|
| **M0** 工程骨架 | ✅ 完成 | 三端可跑、库表与种子数据就绪 |
| **M1** 手动记录主流程 | ✅ 基本完成 | 登录 → 选食 → 确认 → 今日汇总已闭环 |
| **M2** 拍照识别 | ✅ 基本完成 | GLM + 结果页 + 餐图存储（Zeabur 持久卷，见 `docs/ZEABUR.md`） |
| **M3** 趋势与运营 | ✅ 基本完成 | 历史按日、趋势 tab、达标服务端化、识别反馈后台页 |

**当前可演示路径：** 微信开发者工具 → 登录 → 多选/单选手动添加 → 批量确认入账 → 今日仪表盘（含 7 日趋势柱图）→ 拍照识别（需配置 `ZHIPU_API_KEY`）→ 管理后台维护食物库。

---

## 一、已完成工作

### 1. 需求与规划

| 产出 | 说明 |
|------|------|
| [prd.md](./prd.md) | 完整产品需求文档 |
| [plan.md](./plan.md) | 迭代计划、五健康模式、里程碑、变更记录 |
| [standard.md](./standard.md) | API / 目录 / 模式 ID 等开发规范 |
| [MANUAL_TEST.md](./MANUAL_TEST.md) | 手测清单 |

**已确认决策：** 微信原生小程序 + NestJS + Vue3 后台 + PostgreSQL；录入优先级拍照 > 手动 > 扫码；食物库自建（种子 + 后台扩充）。

---

### 2. 后端 API（`apps/api`）

| 模块 | 能力 |
|------|------|
| `auth` | 微信登录（未配密钥时 dev openid）、JWT |
| `users` | 资料读写、健康模式切换 |
| `foods` | 搜索、`GET /foods/:id`、识别用模糊匹配（含别名、刀削面等启发式） |
| `food-logs` | `POST` 记账、`GET daily-summary`、`GET weekly-trend?days=7` |
| `modes` | 五模式列表、`GoalsService`（BMR + 模式系数 → 每日目标） |
| `recognition` | `POST /recognition/analyze`：智谱 GLM 视觉（`llm-vision.service`）+ 食物库映射；无密钥时 mock |
| `admin` | 登录、统计、食物 CRUD、模式配置 PATCH、识别反馈列表 |
| `health` | 健康检查 |

**配置要点：** `apps/api/.env` 中 `ZHIPU_API_KEY`、`LLM_BASE_URL`、`LLM_VISION_MODEL`；`app.module` 通过 `envFilePath` 正确加载 monorepo 下 `.env`。

**数据模型：** `User`、`UserGoal`、`Food`、`FoodLog`、`RecognitionTask`、`ModeConfig`、`Admin`、`RecognitionFeedback`

**工程：** `bcryptjs` 替代 `bcrypt`（Windows 友好）；`scripts/regression-api.ps1` 覆盖核心 API（含 `weekly-trend`）。

---

### 3. 微信小程序（`apps/miniprogram`）

| 页面 | 功能 |
|------|------|
| `pages/index` | 今日摄入、达标/注意/超标、三大营养素进度、**7 日趋势**（热量柱 + 蛋白柱）、今日记录列表、下拉刷新、FAB |
| `pages/record` | 拍照识别、食物搜索；**多选/单选**切换；多选底部「一起确认」 |
| `pages/batch-confirm` | 批量确认：统一餐次、逐项调份量、合计营养、一次写入多条 log |
| `pages/confirm` | 单条确认（餐次、份量、预估营养） |
| `pages/onboarding` | 新用户资料与健康模式 |
| `pages/profile` | 身体数据、切换模式、隐私说明 |

**工具层：** `request.js`、`auth.js`、`nutrition.js`、`constants.js`、`profile.js`

**本地调试：** `app.js` → `apiBase: http://localhost:3000/api/v1`；开发者工具勾选「不校验合法域名」。

---

### 4. 管理后台（`apps/admin`）

| 页面 | 功能 |
|------|------|
| 登录 | `admin` / `admin123` |
| 概览 | 用户/食物/记录等统计 |
| 食物库 | 搜索列表 + **新增/编辑**（名称、营养、别名、启用） |
| 模式 | 配置展示 + **JSON 编辑保存** |
| 识别反馈 | 列表只读（`RecognitionFeedbackView`） |

---

### 5. 设计与原型

- [design/PROTOTYPE.md](./design/PROTOTYPE.md) — Token、9 屏说明、7 日趋势原型  
- [design/prototype/index.html](./design/prototype/index.html) — 浏览器可点原型  
- [source/](./source/) — 施工图参考与 Excalidraw 草稿  

---

### 6. 近期迭代摘要（本会话前后）

| 能力 | 说明 |
|------|------|
| 智谱 GLM 拍照识别 | 替换纯 Mock；识别名映射食物库；低置信度提示手动搜索 |
| 食物库增强 | 种子含刀削面等别名；`matchFoodForRecognition` 改进 |
| 手动多选添加 | 记录页多选 + `batch-confirm` 批量入账 |
| 7 日趋势 | `GET /food-logs/weekly-trend` + 独立 **趋势** tab（7/14 天） |
| 后台运营 | `FoodsView` / `ModesView` 可编辑 |
| P0 识别体验 | `requestLong`、识别结果页、反馈 API |
| 历史日期 / 趋势 tab / 本地存储 | ✅ 本次完成 |

---

## 二、已知限制与问题

| 项 | 说明 |
|----|------|
| 生产图片存储 | Zeabur 持久卷 `/data` + `PUBLIC_BASE_URL`（见 `docs/ZEABUR.md`），无需腾讯云 COS |
| 开发者工具 | 偶发 `WAServiceMainContext timeout`；识别已加长至 60s，仍慢时查 Network |
| UI | 首页已加日期顶栏与 `#1B7A5A` 色条；环形图等待 M3 细化 |

---

## 三、下一步计划

### P0 — 体验与稳定性

| 任务 | 状态 |
|------|------|
| 识别请求 60s 超时 + 友好错误文案 | ✅ `requestLong` |
| 识别结果页 Top-N → 确认 | ✅ `pages/recognition-result` |
| 识别反馈提交 | ✅ `POST /recognition/feedback` |
| 确认后更新 `RecognitionTask` | ✅ `PATCH /recognition/tasks/:id/confirm` |
| 首页日期顶栏 + 主色 `#1B7A5A` | ✅ 基础对齐 |
| 端到端手测 / `regression-api.ps1` | ⬜ 需本地执行 |

---

### P1 — 完成 M2（拍照识别闭环）

| 任务 | 说明 |
|------|------|
| 本地餐图存储 | ✅ `StorageService` → `uploads/meals` + 静态 `/uploads/` |
| Zeabur 持久卷部署 | ✅ `docs/ZEABUR.md` + `apps/api/Dockerfile` |
| Top-N 结果页 | ✅ 已完成 |
| `RecognitionTask` 确认状态 | ✅ 确认入账时 PATCH |
| 识别反馈 | ✅ 小程序入口；后台列表已有 |

---

### P2 — 完成 M3（趋势与运营）

| 任务 | 说明 | 状态 |
|------|------|------|
| 7 日趋势 API + 趋势 tab | 热量/蛋白按日聚合 | ✅ |
| 后台食物 CRUD | 新增/编辑表单 | ✅ 已做 |
| 后台模式编辑 | JSON 保存 | ✅ 已做 |
| 独立趋势 tab | `pages/trend`，7/14 天 | ✅ |
| 历史日期浏览 | 今日页 ‹ › + 日期选择 + `?date=` | ✅ |
| 达标算法服务端化 | `daily-summary.intakeStatus` 按五模式阈值 | ✅ |
| 食物库扩充 | 约 **352** 条；目标 800~1200 | 🟡 |
| 后台识别反馈页 | `RecognitionFeedbackView` | ✅ |

---

### P3 — 发布与工程化

| 任务 | 说明 |
|------|------|
| 微信正式登录 | `WECHAT_APP_ID` / `SECRET`，真机调试 |
| 合法域名 + HTTPS | 生产 API 部署 |
| 自动化测试 | API e2e 进 CI；小程序关键路径清单固化 |
| 文档闭环 | 按需维护 `talk.md`、`summary.md`、`review.md` |
| GitHub | 与用户确认后推送同步 |

---

### 待确认（来自 plan.md）

- [ ] 拍照识别长期供应商与预算  
- [ ] 小程序医疗健康类目与审核资质  
- [ ] 是否做家庭成员子账号（慢病场景）  

---

## 四、里程碑对照（plan.md §7）

| 阶段 | 计划交付 | 实际进度 |
|------|----------|----------|
| M0 | 库表、登录、空壳三端 | ✅ |
| M1 | 手动选食 + 模式目标 + 当日仪表盘 | ✅（含多选批量） |
| M2 | 拍照识别 + 确认流 + 识别反馈后台 | ✅ GLM + 确认流 + Zeabur 餐图存储 |
| M3 | 7 日趋势 + 后台食物/模式配置 | ✅ 趋势 tab、历史日、达标服务端、反馈页 |
| V1.1 | 扫码、训练日/休息日、导出 | ⬜ 未开始 |

---

## 五、关键路径索引

```
Calorie analysis/
├── prd.md · plan.md · standard.md · PROGRESS.md · MANUAL_TEST.md
├── apps/api/              NestJS + Prisma + 识别/趋势 API
├── apps/admin/            Vue 管理后台（食物/模式可编辑）
├── apps/miniprogram/      微信原生（含 batch-confirm）
├── design/                高保真与 HTML 原型
├── scripts/regression-api.ps1
└── source/                施工图参考
```

---

## 六、本地快速命令

```bash
# 根目录
npm install
npm run dev:api          # http://localhost:3000/api/v1/health
npm run dev:admin        # http://localhost:5173

# 数据库
npm run db:migrate
npm run db:seed          # 含刀削面等更新别名

# API 回归（需 API 已启动）
powershell -File scripts/regression-api.ps1

# 小程序：微信开发者工具 → apps/miniprogram
# 不校验合法域名；app.js → apiBase 指向本机
```

---

*下次完成 M2 闭环或 M3 历史/趋势页后，请更新「更新日期」与第二节状态表。*

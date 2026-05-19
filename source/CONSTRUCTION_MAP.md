# 食光 · 卡路里与营养分析 — 施工图

> （截图给 Claude / Cursor 看）  
> **个人饮食分析 · 微信小程序 + API + 管理后台**  
> **读懂身体与模式 → 记录一餐 → 按目标汇总反馈**

参考版式：[demo.jpg](./demo.jpg)（Claudio 四层施工图）

---

## 总览

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  第一层 · 外部上下文     微信 · 视觉云(规划) · PostgreSQL · 食物库种子        │
├─────────────────────────────────────────────────────────────────────────────┤
│  第二层 · 本地大脑       NestJS 模块 · Prisma · 营养计算 · 五模式目标引擎      │
├─────────────────────────────────────────────────────────────────────────────┤
│  第三层 · 运行时聚合     每次请求：鉴权 → 资料/目标 → 记录/识别 → 当日仪表盘    │
├─────────────────────────────────────────────────────────────────────────────┤
│  第四层 · 交互表层       微信原生小程序 · Vue3 后台 · HTTP 契约               │
└─────────────────────────────────────────────────────────────────────────────┘
```

| 里程碑 | 状态 | 施工图对应 |
|--------|------|------------|
| M0 骨架 | ✅ | 库表、登录、Mock 识别、空壳三端 |
| M1 小程序 | ✅ 基础 | 引导、确认页、搜索记录、今日仪表盘 |
| M2 识别 | 🔲 | VISION 层接真 API |
| M3 运营 | 🔲 | 7 日趋势、后台食物表单 CRUD |

---

## 第一层：外部上下文

> 系统不自己「发明」的数据与能力，全部从这里进入。

```text
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  USER            │  │  IDENTITY        │  │  VISION (M2)     │  │  DATA            │
│  用户身体语料     │  │  微信开放平台     │  │  拍照识别云       │  │  PostgreSQL      │
│                  │  │                  │  │                  │  │  + 自建食物库    │
│  gender/age      │  │  code2Session    │  │  腾讯/百度视觉    │  │                  │
│  height/weight   │  │  openid → JWT    │  │  COS 存图        │  │  prisma/seed     │
│  activityLevel   │  │  dev 无配置时     │  │  菜品+置信度      │  │  800~1200 条     │
│  healthMode ×5   │  │  mock openid     │  │  (M0: URL mock)  │  │  mode_configs    │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │                     │
         └─────────────────────┴─────────────────────┴─────────────────────┘
                                         │
                                         ▼
                              apps/api  (localhost:3000)
```

| 块 | 路径 / 配置 | 关键词 |
|----|-------------|--------|
| USER | `users` 表 · onboarding 表单 | 五模式 `lose_fat` … `wellness` |
| IDENTITY | `WECHAT_APP_ID` / `SECRET` · `auth/wechat` | Bearer JWT · `jwt.strategy` |
| VISION | `recognition/analyze` · `RecognitionTask` | **M0** `mockDishName` + `fuzzyMatch` |
| DATA | `DATABASE_URL` · `prisma/schema.prisma` | `Food` `FoodLog` `UserGoal` `ModeConfig` |

---

## 第二层：本地大脑（NestJS · `apps/api`）

> 可部署在同一进程内的「业务器官」；不依赖浏览器。

```text
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ AUTH        │ │ USERS       │ │ FOODS       │ │ FOOD_LOGS   │ │ MODES       │ │ RECOGNITION │
│ 微信登录     │ │ 资料/onboard│ │ 搜索/模糊匹配│ │ 入账/日汇总  │ │ 五模式配置   │ │ 拍照→候选   │
│ JWT Guard   │ │ PATCH /me   │ │ GET ?q=     │ │ POST log    │ │ GoalsService│ │ Task 落库   │
│             │ │             │ │ per100g营养  │ │ daily-summary│ │ TDEE 重算   │ │ M2 换真视觉  │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │               │               │               │
       └───────────────┴───────────────┴───────┬───────┴───────────────┴───────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
              ┌─────▼─────┐            ┌───────▼───────┐          ┌───────▼───────┐
              │ NUTRITION │            │ PRISMA        │          │ ADMIN         │
              │ .ts       │            │ Service       │          │ 运营 JWT      │
              │ 份量→宏量  │            │ PostgreSQL    │          │ 食物/模式只读  │
              │ nutrients │            │ migrate+seed  │          │ bcryptjs      │
              └───────────┘            └───────────────┘          └───────────────┘
```

### 模块对照表

| 模块 | 源文件 | 职责 |
|------|--------|------|
| **AUTH** | `modules/auth/*` | `POST /auth/wechat` → access_token |
| **USERS** | `modules/users/*` | `GET/PATCH /users/me` · 切换 `healthMode` 触发目标重算 |
| **FOODS** | `modules/foods/*` | 食物搜索 · `fuzzyMatch` 供识别候选 |
| **FOOD_LOGS** | `modules/food-logs/*` | 写 `food_logs` · `daily-summary`（已摄入/目标/剩余） |
| **MODES** | `modules/modes/goals.service.ts` | BMR×活动系数 · 模式系数 · `user_goals` |
| **RECOGNITION** | `modules/recognition/*` | 创建 `recognition_tasks` · 返回 `candidates[]` |
| **ADMIN** | `modules/admin/*` | `POST /admin/auth/login` · 食物列表 · 模式配置 |
| **NUTRITION** | `utils/nutrition.ts` | `nutrientsForServing(food, servingG)` |
| **PRISMA** | `prisma/*` | 唯一数据源 · `seed.ts` 灌种子 |

### 五模式目标引擎（GoalsService）

```text
  User 资料 ──► BMR (Mifflin) ──► × activityLevel ──► 模式修正
                                                      │
                    lose_fat      ── - calorieDeficit │
                    gain_muscle   ── +300 kcal        │
                    metabolic     ── 钠/糖上限 JSON    ├──► UserGoal.targets
                    pregnancy     ── 阶段文案(产品层)  │
                    wellness      ── 宽目标            │
                                                      │
                    ModeConfig.config (DB 可调系数) ──┘
```

---

## 第三层：运行时聚合

> 一次「记一餐」或「看今日」时，上下文如何拼起来。

### 3.1 上下文碎片（CONTEXT WINDOW）

每次业务请求大致组装以下 **6 块**（类比 demo 的 prompt 碎片）：

| # | 碎片 | 来源 | 用途 |
|---|------|------|------|
| ① | **身份** | `Authorization: Bearer` → `userId` | 全链路隔离 |
| ② | **用户语料** | `users` + 本地 `profile.js` 缓存 | 模式、身体数据 |
| ③ | **当日目标** | `user_goals` (active) · `ModeConfig` | 进度条分母 |
| ④ | **食物事实** | `foods` 每 100g 营养 | 确认页预估 |
| ⑤ | **输入/工具结果** | 搜索 q · 识别 `candidates` · 用户选份量 | 确认前 |
| ⑥ | **执行轨迹** | `food_logs` 按 `log_date` · `recognition_tasks` | 汇总与审计 |

### 3.2 主流程（录入 → 确认 → 入账）

```text
  [小程序 record]
        │
        ├─ 拍照 ──► POST /recognition/analyze { imageUrl }
        │              │
        │              ▼
        │         RECOGNITION: mock/云识别 → candidates[]
        │              │
        └─ 搜索 ──► GET /foods?q= ─────────────────────┐
                                                       │
                                                       ▼
                                            [confirm 确认页]
                                            餐次 · 份量 · 本餐预估
                                            (nutrition.ts 同款逻辑)
                                                       │
                                                       ▼
                                            POST /food-logs
                                            { foodId, mealType, servingG, source }
                                                       │
                                                       ▼
                                            FOOD_LOGS + NUTRITION 写库
                                                       │
                                                       ▼
                                            GET /food-logs/daily-summary
                                            consumed / targets / remaining
                                                       │
                                                       ▼
                                            [index 今日] 达标·注意·超标 (前端按模式算)
```

### 3.3 统一原则

- **任何录入方式**（拍照 P0 / 手动 P1 / 扫码 P2）→ 必经 **confirm** → 再 `POST food-logs`。
- **切换 healthMode** 不删历史；`GoalsService.recalculateForUser` 换新 `UserGoal`，旧记录按新目标重算达标态。
- API 统一包装：`ResponseInterceptor` → `{ data }` · `HttpExceptionFilter` → `{ error }`。

---

## 第四层：交互表层

### 4.1 微信小程序 · `apps/miniprogram`

```text
┌────────────────────────────────────────────────────────────┐
│  微信开发者工具 · 原生 WXML/WXSS/JS                          │
│  app.js  apiBase → http://localhost:3000/api/v1           │
├────────────────────────────────────────────────────────────┤
│  Tab: 今日 index    │ 模式标签 · 剩余 kcal · 三大营养素条    │
│  Tab: 记录 record   │ 拍照 · 搜索 · 最近常吃 → confirm      │
│  栈页: confirm      │ 餐次/份量/预估 → 确认入账              │
│  栈页: onboarding   │ 新用户必填 · 可从 profile 再进         │
│  Tab: 我的 profile  │ 身体数据 · 切换模式 · 隐私说明         │
├────────────────────────────────────────────────────────────┤
│  utils/request.js   Bearer token · wx.request             │
│  utils/auth.js      ensureLogin → /auth/wechat            │
│  utils/nutrition.js │ 与 API 对齐的本地预估 (可选)          │
│  utils/constants.js │ 五模式文案 · 餐次枚举                 │
└────────────────────────────────────────────────────────────┘
```

页面路由（`app.json`）：

| 页面 | 路径 | 角色 |
|------|------|------|
| 今日 | `pages/index` | 仪表盘 · 今日记录列表 |
| 记录 | `pages/record` | 录入入口 |
| 确认 | `pages/confirm` | **统一确认页** |
| 引导 | `pages/onboarding` | 资料 + 选模式 |
| 我的 | `pages/profile` | 设置与目标 |

### 4.2 管理后台 · `apps/admin` · `localhost:5173`

```text
┌─────────────────────────────────────────┐
│  Vue3 + Vite + Element Plus             │
│  api/client.ts → /api/v1/admin/*        │
├─────────────────────────────────────────┤
│  /login          admin / admin123       │
│  /dashboard      概览 (M0)              │
│  /foods          食物列表 (M0 只读)      │
│  /modes          模式配置只读 (M0)       │
└─────────────────────────────────────────┘
```

### 4.3 HTTP 契约（小程序 ↔ API）

前缀：`/api/v1` · 鉴权：`Authorization: Bearer <access_token>`（管理端：`admin_token`）

| 方法 | 路径 | 调用方 | 说明 |
|------|------|--------|------|
| POST | `/auth/wechat` | 小程序 | `{ code }` → token + user |
| GET | `/users/me` | 小程序 | 当前资料 |
| PATCH | `/users/me` | 小程序/onboarding | 更新资料 · 换模式 |
| GET | `/foods?q=` | 小程序 record | 搜索食物 |
| POST | `/food-logs` | 小程序 confirm | 入账 |
| GET | `/food-logs/daily-summary?date=` | 小程序 index | 当日汇总 |
| POST | `/recognition/analyze` | 小程序 record | `{ imageUrl }` → candidates |
| GET | `/modes` | 小程序 | 五模式列表与说明 |
| GET | `/health` | 运维 | 健康检查 |
| POST | `/admin/auth/login` | 后台 | 管理员 JWT |
| GET/PATCH | `/admin/foods` … | 后台 | 食物运营 (M3 表单) |
| GET/PATCH | `/admin/mode-configs` … | 后台 | 模式系数 |

响应形态（小程序 `request.js` 已适配）：

```json
{ "data": { ... } }
```

---

## 仓库地图（给 Code Agent 的索引）

```text
Calorie analysis/
├── apps/
│   ├── api/              ← 第二层大脑 + 第三层聚合实现
│   │   ├── prisma/       schema · migrations · seed
│   │   └── src/modules/  auth users foods food-logs modes recognition admin
│   ├── miniprogram/      ← 第四层 · 用户主界面
│   └── admin/            ← 第四层 · 运营
├── design/
│   ├── PROTOTYPE.md      高保真说明 · Token · 9 屏
│   └── prototype/index.html
├── prd.md · plan.md · standard.md · README.md
└── source/
    ├── demo.jpg          施工图版式参考
    └── CONSTRUCTION_MAP.md   ← 本文件
```

---

## 与 demo（Claudio）的对照

| Claudio 四层 | 本项目对应 |
|--------------|------------|
| USER 品味语料 | 用户身体资料 + `healthMode` + `user_goals` |
| BRAIN: Claude Code | **无** — 规则引擎 + 食物库匹配（M2 加视觉云） |
| MUSIC: 网易云 API | **FOODS** 自建库 + `fuzzyMatch` |
| VOICE / 播报 | **仪表盘文案** — 剩余 kcal · 达标三态 |
| ROUTER / CONTEXT | **JWT + GoalsService + daily-summary 聚合** |
| SCHEDULER | **暂无** — 未来：提醒记餐、日切汇总 |
| STATE.DB | **PostgreSQL via Prisma** |
| PWA + WS | **微信小程序 wx.request**（无 WebSocket） |
| HTTP CONTRACT | 上表 §4.3 |

---

## 设计资产（不进运行时，但指导第四层 UI）

| 资产 | 路径 |
|------|------|
| 设计规范 | `design/PROTOTYPE.md` |
| 可点原型 | `design/prototype/index.html` |
| 品牌暂定 | **食光** · 主色 `#1B7A5A` |

---

*文档版本：2026-05-17 · 对齐 M0/M1 代码现状*

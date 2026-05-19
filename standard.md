# 开发规范（Calorie Analysis）

> 实施 `plan.md` 时须遵循本文档。有冲突以 `plan.md` 产品需求为准。

---

## 1. 通用约定

- **语言**：代码与注释英文；用户可见文案中文（小程序、后台 UI）。
- **时间**：API 统一 ISO 8601 UTC；小程序展示按用户本地时区。
- **金额/营养**：数据库 `Decimal`；API JSON 用 **number**（保留 1 位小数），禁止 float 累加误差（服务端用 Decimal 计算后再转 number）。
- **ID**：对外暴露 cuid/uuid 字符串；禁止自增 ID 直接暴露。

---

## 2. 目录与命名

| 区域 | 约定 |
|------|------|
| API 模块 | `apps/api/src/modules/<name>/` |
| 路由前缀 | 小程序 ` /api/v1/*`；管理端 ` /api/v1/admin/*` |
| Prisma 模型 | PascalCase 单数；表名 snake_case 映射 |
| 枚举 | `HealthMode`, `MealType`, `LogSource` 与 `plan.md` 模式 ID 一致 |
| 小程序页面 | `pages/<feature>/<action>/` kebab-case |

---

## 3. API 规范

### 3.1 响应格式

```json
{
  "data": {},
  "meta": { "requestId": "..." }
}
```

错误：

```json
{
  "error": {
    "code": "FOOD_NOT_FOUND",
    "message": "食物不存在"
  }
}
```

HTTP 状态：401 未登录 · 403 无权限 · 404 · 422 校验失败 · 500。

### 3.2 认证

- 小程序：`Authorization: Bearer <jwt>`，JWT 由 `POST /api/v1/auth/wechat` 签发。
- 管理后台：`Authorization: Bearer <admin-jwt>`，独立 secret，路由走 `AdminGuard`。

### 3.3 版本

路径版本 `v1`；破坏性变更升 `v2`。

---

## 4. 健康模式（`HealthMode`）

与 `plan.md` 一致，禁止新增未文档化模式：

`lose_fat` | `gain_muscle` | `metabolic` | `pregnancy` | `wellness`

模式配置存 `mode_configs.config`（JSON），业务逻辑读配置而非硬编码魔法数。

---

## 5. 食物与记录

- 食物营养以 **每 100g** 为基准；展示份量用 `servingSize` + `servingUnit`（如「1 碗」）。
- `food_logs` 必须带 `source`: `photo` | `manual` | `scan`。
- 拍照流程：**识别候选 → 用户确认 → 写入 log**；禁止跳过确认直接入账。

---

## 6. 隐私与安全

- 管理后台 **禁止** 列表展示用户具体饮食明细（仅聚合统计）。
- 日志、密钥仅环境变量；`.env` 不入库。
- 图片 URL 使用签名或私有桶（上线要求）。

---

## 7. Git 提交

格式：`<type>(<scope>): <subject>`

type: `feat` | `fix` | `docs` | `chore` | `refactor` | `test`

示例：`feat(api): add wechat login endpoint`

---

## 8. 测试（M1 起）

- API：关键 service 单元测试（目标计算、日志汇总）。
- 提交前：`npm run lint`（api/admin）、`npm run test`（api）。

---

## 9. 文档同步

功能模块完成后更新 `README.md` 对应章节；需求变更写入 `plan.md` §10。

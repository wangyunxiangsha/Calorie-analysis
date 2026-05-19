-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "HealthMode" AS ENUM ('lose_fat', 'gain_muscle', 'metabolic', 'pregnancy', 'wellness');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- CreateEnum
CREATE TYPE "LogSource" AS ENUM ('photo', 'manual', 'scan');

-- CreateEnum
CREATE TYPE "RecognitionStatus" AS ENUM ('pending', 'confirmed', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "openid" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar_url" TEXT,
    "gender" INTEGER,
    "age" INTEGER,
    "height_cm" DECIMAL(5,2),
    "weight_kg" DECIMAL(5,2),
    "activity_level" TEXT,
    "health_mode" "HealthMode" NOT NULL DEFAULT 'lose_fat',
    "target_weight_kg" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_goals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "health_mode" "HealthMode" NOT NULL,
    "targets" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "calories_per_100g" DECIMAL(8,2) NOT NULL,
    "protein_per_100g" DECIMAL(8,2) NOT NULL,
    "carbs_per_100g" DECIMAL(8,2) NOT NULL,
    "fat_per_100g" DECIMAL(8,2) NOT NULL,
    "fiber_per_100g" DECIMAL(8,2),
    "sodium_mg_per_100g" DECIMAL(8,2),
    "sugar_per_100g" DECIMAL(8,2),
    "default_serving_g" DECIMAL(8,2) NOT NULL DEFAULT 100,
    "serving_unit" TEXT NOT NULL DEFAULT '份',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "meal_type" "MealType" NOT NULL,
    "source" "LogSource" NOT NULL,
    "serving_g" DECIMAL(8,2) NOT NULL,
    "log_date" DATE NOT NULL,
    "calories" DECIMAL(8,2) NOT NULL,
    "protein_g" DECIMAL(8,2) NOT NULL,
    "carbs_g" DECIMAL(8,2) NOT NULL,
    "fat_g" DECIMAL(8,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recognition_tasks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "candidates" JSONB NOT NULL,
    "status" "RecognitionStatus" NOT NULL DEFAULT 'pending',
    "chosen_food_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recognition_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mode_configs" (
    "id" TEXT NOT NULL,
    "health_mode" "HealthMode" NOT NULL,
    "label" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mode_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recognition_feedback" (
    "id" TEXT NOT NULL,
    "task_id" TEXT,
    "reported_name" TEXT NOT NULL,
    "suggested_food_id" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recognition_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_openid_key" ON "users"("openid");

-- CreateIndex
CREATE INDEX "user_goals_user_id_active_idx" ON "user_goals"("user_id", "active");

-- CreateIndex
CREATE INDEX "foods_name_idx" ON "foods"("name");

-- CreateIndex
CREATE INDEX "food_logs_user_id_log_date_idx" ON "food_logs"("user_id", "log_date");

-- CreateIndex
CREATE INDEX "recognition_tasks_user_id_idx" ON "recognition_tasks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mode_configs_health_mode_key" ON "mode_configs"("health_mode");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "user_goals" ADD CONSTRAINT "user_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_logs" ADD CONSTRAINT "food_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_logs" ADD CONSTRAINT "food_logs_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognition_tasks" ADD CONSTRAINT "recognition_tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recognition_tasks" ADD CONSTRAINT "recognition_tasks_chosen_food_id_fkey" FOREIGN KEY ("chosen_food_id") REFERENCES "foods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

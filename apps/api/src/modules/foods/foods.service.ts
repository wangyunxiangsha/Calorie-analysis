import { Injectable, NotFoundException } from '@nestjs/common';
import { Food } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  expandSearchTokens,
  normalizeFoodText,
  scoreFoodMatch,
} from './food-matching.util';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q?: string, limit = 20) {
    const query = q?.trim();
    const take = Math.min(limit, 50);

    if (!query) {
      return this.prisma.food.findMany({
        where: { enabled: true },
        take,
        orderBy: { name: 'asc' },
      });
    }

    const direct = await this.prisma.food.findMany({
      where: {
        enabled: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { aliases: { has: query } },
        ],
      },
      take,
      orderBy: { name: 'asc' },
    });
    if (direct.length >= take) return direct;

    const fuzzy = await this.fuzzySearchFoods(query, take);
    const seen = new Set(direct.map((f) => f.id));
    const merged = [...direct];
    for (const food of fuzzy) {
      if (seen.has(food.id)) continue;
      merged.push(food);
      seen.add(food.id);
      if (merged.length >= take) break;
    }
    return merged;
  }

  async findOne(id: string) {
    const food = await this.prisma.food.findUnique({ where: { id } });
    if (!food || !food.enabled) throw new NotFoundException('食物不存在');
    return food;
  }

  fuzzyMatch(name: string, limit = 5) {
    return this.matchFoodForRecognition(name, limit);
  }

  /** 将视觉模型返回的菜名映射到食物库（支持别名、子串、分词） */
  async matchFoodForRecognition(
    recognitionName: string,
    limit = 5,
  ): Promise<Food[]> {
    const text = recognitionName.trim();
    if (!text) return [];

    const direct = await this.search(text, limit);
    if (direct.length > 0) return direct;

    for (const token of expandSearchTokens(text)) {
      const hits = await this.search(token, limit);
      if (hits.length > 0) return hits;
    }

    return this.fuzzySearchFoods(text, limit);
  }

  private async fuzzySearchFoods(query: string, limit: number): Promise<Food[]> {
    const foods = await this.prisma.food.findMany({
      where: { enabled: true },
    });

    const normalizedQuery = normalizeFoodText(query);
    const queryLower = query.toLowerCase();

    const scored = foods
      .map((food) => {
        let score = scoreFoodMatch(query, food);

        for (const alias of food.aliases ?? []) {
          const a = alias.toLowerCase();
          if (a.includes(queryLower) || queryLower.includes(a)) {
            score = Math.max(score, 8);
          }
          const na = normalizeFoodText(alias);
          if (
            normalizedQuery &&
            (na.includes(normalizedQuery) || normalizedQuery.includes(na))
          ) {
            score = Math.max(score, 9);
          }
        }

        return { food, score };
      })
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((row) => row.food);
  }
}

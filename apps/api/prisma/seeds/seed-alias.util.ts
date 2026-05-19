/** 种子专用：与 food-matching.util 的 mergeAliasList 保持一致，避免 seed 依赖 src/ */

export function mergeAliasList(
  canonicalName: string,
  explicit: string[] = [],
  registry: Record<string, string[]> = {},
): string[] {
  const fromRegistry = registry[canonicalName] ?? [];
  const auto = buildAutoAliases(canonicalName);

  const merged = [...explicit, ...fromRegistry, ...auto]
    .map((a) => a.trim())
    .filter((a) => a.length >= 2 && a !== canonicalName);

  return [...new Set(merged)];
}

function buildAutoAliases(canonicalName: string): string[] {
  const out: string[] = [];
  const n = canonicalName;

  if (n.endsWith('米饭') && n.length > 2) {
    out.push(n.replace(/米饭$/, ''));
  }
  if (n.includes('（')) {
    out.push(n.replace(/（[^）]+）/g, '').trim());
  }
  if (/炒|烧|煮|蒸|炖|烤|炸/.test(n)) {
    const core = n.replace(/^(清炒|红烧|糖醋|蒜蓉|干煸|豉汁|白灼|清蒸)/, '');
    if (core.length >= 2 && core !== n) out.push(core);
  }

  return out;
}

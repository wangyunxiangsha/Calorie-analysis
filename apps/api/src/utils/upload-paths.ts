import { join, dirname, isAbsolute } from 'path';

/** Meal images directory (absolute path). */
export function resolveMealUploadDir(): string {
  const configured = process.env.UPLOAD_DIR?.trim() || 'uploads/meals';
  return isAbsolute(configured)
    ? configured
    : join(process.cwd(), configured);
}

/** Directory served at `/uploads/` (parent of `meals/` when using default layout). */
export function resolveUploadStaticRoot(): string {
  const override = process.env.UPLOAD_STATIC_ROOT?.trim();
  if (override) {
    return isAbsolute(override) ? override : join(process.cwd(), override);
  }
  const mealDir = resolveMealUploadDir();
  const base = dirname(mealDir);
  return base.endsWith('uploads') ? base : join(process.cwd(), 'uploads');
}

export function publicUploadUrl(relativePath: string): string {
  const base = (process.env.PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return base ? `${base}${path}` : path;
}

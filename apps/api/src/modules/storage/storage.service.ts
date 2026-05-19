import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import {
  publicUploadUrl,
  resolveMealUploadDir,
} from '../../utils/upload-paths';

@Injectable()
export class StorageService {
  async saveMealImage(base64: string, mimeType?: string): Promise<string | null> {
    const trimmed = base64?.trim();
    if (!trimmed) return null;

    const ext = mimeToExt(mimeType);
    const filename = `${Date.now()}-${randomBytes(4).toString('hex')}.${ext}`;
    const dir = resolveMealUploadDir();
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(trimmed, 'base64');
    const absolutePath = join(dir, filename);
    await writeFile(absolutePath, buffer);

    return publicUploadUrl(`/uploads/meals/${filename}`);
  }
}

function mimeToExt(mime?: string) {
  if (!mime) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'jpg';
}

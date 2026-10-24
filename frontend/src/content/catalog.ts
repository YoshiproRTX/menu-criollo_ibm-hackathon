import type { MinigameConfig } from '../api/types';
import { FALLBACK_MINIGAMES } from './fallbackMinigames';

export const MINIGAME_ORDER = [
  'pelusa',
  'fregadero',
  'chef',
  'lavanderia',
  'doble-hueso',
  'trucos',
  'pista',
  'copa',
] as const;

const contentModules = import.meta.glob('@content/minigames/*.json', {
  eager: true,
}) as Record<string, { default?: MinigameConfig } | MinigameConfig>;

function parseDiskCatalog(): Record<string, MinigameConfig> {
  const catalog: Record<string, MinigameConfig> = {};
  for (const [filePath, mod] of Object.entries(contentModules)) {
    const raw = (mod && typeof mod === 'object' && 'default' in mod && mod.default
      ? mod.default
      : mod) as MinigameConfig;
    const match = filePath.match(/([^/\\]+)\.json$/);
    const id = raw?.id ?? (match ? match[1] : undefined);
    if (id && raw) {
      catalog[id] = raw;
    }
  }
  return catalog;
}

let testOverrideIds: string[] | null = null;

export function setCatalogOverrideForTests(ids: string[] | null): void {
  testOverrideIds = ids;
}

export function getAvailableMinigames(): Record<string, MinigameConfig> {
  if (testOverrideIds) {
    const result: Record<string, MinigameConfig> = {};
    const disk = parseDiskCatalog();
    for (const id of testOverrideIds) {
      const cfg = disk[id] ?? FALLBACK_MINIGAMES[id];
      if (cfg) {
        result[id] = cfg;
      }
    }
    return result;
  }

  const diskCatalog = parseDiskCatalog();
  if (Object.keys(diskCatalog).length > 0) {
    return diskCatalog;
  }

  return { ...FALLBACK_MINIGAMES };
}

export function getOrderedAvailableMinigameIds(): string[] {
  const available = getAvailableMinigames();
  return MINIGAME_ORDER.filter((id) => Boolean(available[id]));
}

export function hasMinigame(id: string): boolean {
  const available = getAvailableMinigames();
  return Boolean(available[id]);
}

export function getMinigameConfig(id: string): MinigameConfig | undefined {
  const disk = parseDiskCatalog();
  return disk[id] ?? FALLBACK_MINIGAMES[id];
}

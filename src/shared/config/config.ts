import { createApiUrl } from '../lib/branded'
import type { ApiUrl } from '../lib/branded'

export const API_URL: ApiUrl = createApiUrl('https://drawapi.ajikkk.my.id')
export const STORAGE_KEY = 'sketch-board-saved-scene' as const
export const LIBRARY_STORAGE_KEY = 'sketch-board-library' as const
export const SCENE_KEY_STORAGE = 'sketch-board-current-scene-key' as const

export type StorageKey = typeof STORAGE_KEY

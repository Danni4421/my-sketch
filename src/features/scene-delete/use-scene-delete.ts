import { useCallback } from 'react'
import { SceneApi } from '@/entities/scene'

const api = new SceneApi()

export function useSceneDelete(onDeleted?: (key: string) => void) {
  const remove = useCallback(async (key: string) => {
    const ok = await api.remove(key)
    if (ok) onDeleted?.(key)
  }, [onDeleted])

  return { remove }
}

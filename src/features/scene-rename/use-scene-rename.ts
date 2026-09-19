import { useCallback } from 'react'
import { SceneApi } from '@/entities/scene'

const api = new SceneApi()

export function useSceneRename(onRenamed?: () => void) {
  const rename = useCallback(async (key: string, newName: string) => {
    await api.rename(key, newName)
    onRenamed?.()
  }, [onRenamed])

  return { rename }
}

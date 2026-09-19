import { useCallback } from 'react'
import { SceneApi } from '@/entities/scene'
import { fixCollaborators } from '@/shared/lib'
import { StorageManager } from '@/shared/lib'
import { STORAGE_KEY } from '@/shared/config'

const api = new SceneApi()
const storage = new StorageManager(STORAGE_KEY)

export function useSceneLoad(apiRef: React.MutableRefObject<any>) {
  const load = useCallback(async (key: string): Promise<boolean> => {
    const scene = await api.fetchOne(key)
    if (!scene) return false
    scene.appState = fixCollaborators(scene.appState || {})
    storage.save(scene)
    apiRef.current?.updateScene(scene)
    return true
  }, [apiRef])

  return { load }
}

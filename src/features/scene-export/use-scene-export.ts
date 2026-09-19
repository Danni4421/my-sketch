import { useCallback } from 'react'
import { SceneApi } from '@/entities/scene'
import { exportAsPng, exportAsSvg, fixCollaborators } from '@/shared/lib'

const api = new SceneApi()

export function useSceneExport() {
  const exportScene = useCallback(async (key: string, format: 'png' | 'svg') => {
    const scene = await api.fetchOne(key)
    if (!scene) return
    const elements = scene.elements || []
    const appState = fixCollaborators(scene.appState || {})
    const name = scene.name || 'scene'
    if (format === 'png') {
      await exportAsPng(elements, appState, `${name}.png`)
    } else {
      await exportAsSvg(elements, appState, `${name}.svg`)
    }
  }, [])

  return { exportScene }
}

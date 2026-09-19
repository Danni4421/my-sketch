import { useCallback } from 'react'
import { SceneApi } from '@/entities/scene'

const api = new SceneApi()

export function useSceneSave(onStatus?: (status: 'idle' | 'saving' | 'saved' | 'error') => void) {
  const save = useCallback(async (elements: any[], appState: any) => {
    onStatus?.('saving')
    try {
      const key = await api.save({
        key: '',
        type: 'sketch-board',
        name: `Sketch ${new Date().toLocaleString()}`,
        elements,
        appState,
        savedAt: new Date().toISOString(),
      })
      if (key) {
        onStatus?.('saved')
        setTimeout(() => onStatus?.('idle'), 2000)
      } else {
        onStatus?.('error')
      }
    } catch {
      onStatus?.('error')
    }
  }, [onStatus])

  return { save }
}

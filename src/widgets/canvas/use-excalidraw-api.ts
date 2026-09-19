import { useRef, useCallback } from 'react'
import { STORAGE_KEY } from '@/shared/config'

export function useExcalidrawAPI() {
  const apiRef = useRef<any>(null)

  const handleAPI = useCallback((api: any) => {
    apiRef.current = api
  }, [])

  const getElements = useCallback(() => apiRef.current?.getSceneElements() || [], [])
  const getAppState = useCallback(() => apiRef.current?.getAppState() || {}, [])
  const updateScene = useCallback((scene: any) => apiRef.current?.updateScene(scene), [])

  const resetCanvas = useCallback(() => {
    apiRef.current?.resetScene()
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return {
    apiRef,
    handleAPI,
    getElements,
    getAppState,
    updateScene,
    resetCanvas,
  }
}

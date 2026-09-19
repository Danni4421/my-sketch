import { useRef, useCallback } from 'react'

export function useExcalidrawAPI() {
  const apiRef = useRef<any>(null)

  const handleAPI = useCallback((api: any) => {
    apiRef.current = api
  }, [])

  const getElements = useCallback(() => apiRef.current?.getSceneElements() || [], [])
  const getAppState = useCallback(() => apiRef.current?.getAppState() || {}, [])
  const updateScene = useCallback((scene: any) => apiRef.current?.updateScene(scene), [])

  return {
    apiRef,
    handleAPI,
    getElements,
    getAppState,
    updateScene,
  }
}

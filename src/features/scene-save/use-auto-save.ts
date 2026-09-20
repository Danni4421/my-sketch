import { useCallback, useRef } from 'react'
import { Runtime } from 'effect'
import { StorageService } from '@/shared/lib/storage-service'
import { STORAGE_KEY } from '@/shared/config'
import { SceneApi } from '@/entities/scene'

const runtime = Runtime.defaultRuntime
const sceneApi = new SceneApi()
const DEBOUNCE_MS = 30_000

function serializeAppState(appState: any) {
  if (appState?.collaborators instanceof Map) {
    return { ...appState, collaborators: Array.from(appState.collaborators.entries()) }
  }
  return appState
}

export function useAutoSave(_getElements: () => any[], _getAppState: () => any) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ elements: any[]; appState: Record<string, unknown> } | null>(null)
  const sceneKeyRef = useRef<string | null>(null)

  const setSceneKey = useCallback((key: string | null) => {
    sceneKeyRef.current = key
  }, [])

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!pendingRef.current || !sceneKeyRef.current) return

    const { elements, appState } = pendingRef.current
    pendingRef.current = null

    Runtime.runPromiseExit(runtime)(
      sceneApi.update(sceneKeyRef.current, { elements, appState }),
    )
  }, [])

  const onChange = useCallback((elements: any, appState: any) => {
    const serialized = serializeAppState(appState)

    Runtime.runPromiseExit(runtime)(
      StorageService.save(STORAGE_KEY, {
        type: 'sketch-board',
        elements: elements || [],
        appState: serialized,
      }),
    )

    if (sceneKeyRef.current) {
      pendingRef.current = { elements: elements || [], appState: serialized }

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        if (!pendingRef.current || !sceneKeyRef.current) return
        const pending = pendingRef.current
        pendingRef.current = null
        Runtime.runPromiseExit(runtime)(
          sceneApi.update(sceneKeyRef.current, { elements: pending.elements, appState: pending.appState }),
        )
        timerRef.current = null
      }, DEBOUNCE_MS)
    }
  }, [])

  return { onChange, setSceneKey, flush }
}

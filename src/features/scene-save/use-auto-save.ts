import { useCallback } from 'react'
import { Effect, Runtime } from 'effect'
import { StorageService } from '@/shared/lib/storage-service'
import { STORAGE_KEY } from '@/shared/config'

const runtime = Runtime.defaultRuntime

function serializeAppState(appState: any) {
  if (appState?.collaborators instanceof Map) {
    return { ...appState, collaborators: Array.from(appState.collaborators.entries()) }
  }
  return appState
}

export function useAutoSave(getElements: () => any[], getAppState: () => any) {
  return useCallback((elements: any, appState: any) => {
    Runtime.runPromiseExit(runtime)(
      StorageService.save(STORAGE_KEY, {
        type: 'sketch-board',
        elements: elements || [],
        appState: serializeAppState(appState),
      }),
    )
  }, [])
}

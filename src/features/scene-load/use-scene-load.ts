import { Effect } from 'effect'
import type { BinaryFiles } from '@excalidraw/excalidraw/types'
import { SceneApi } from '@/entities/scene'
import { fixCollaborators } from '@/shared/lib/excalidraw-utils'
import { StorageService, StorageError } from '@/shared/lib/storage-service'
import { STORAGE_KEY, FILES_STORAGE_KEY } from '@/shared/config'

export class LoadError {
  readonly _tag = 'LoadError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

function serializeForStorage(scene: any) {
  const appState = scene.appState
  if (appState?.collaborators instanceof Map) {
    return { ...scene, appState: { ...appState, collaborators: Array.from(appState.collaborators.entries()) } }
  }
  return scene
}

export function useSceneLoad(apiRef: React.MutableRefObject<any>) {
  const api = new SceneApi()

  const load = (key: string): Effect.Effect<boolean, LoadError> =>
    Effect.gen(function* () {
      const scene = yield* api.fetchOne(key).pipe(
        Effect.mapError(() => new LoadError(`Failed to fetch scene: ${key}`)),
      )

      const fixedScene = {
        ...scene,
        appState: fixCollaborators(scene.appState || {}),
      }

      yield* StorageService.save(STORAGE_KEY, serializeForStorage(fixedScene)).pipe(
        Effect.mapError(() => new LoadError('Failed to save to local storage')),
      )

      const localFiles = StorageService.loadSync<BinaryFiles>(FILES_STORAGE_KEY) || {}
      const files = { ...localFiles, ...(scene.files || {}) }
      if (Object.keys(files).length > 0) {
        apiRef.current?.addFiles(Object.values(files))
      }

      apiRef.current?.updateScene(fixedScene)
      return true
    }).pipe(
      Effect.catchAll(() => Effect.succeed(false)),
    )

  return { load }
}

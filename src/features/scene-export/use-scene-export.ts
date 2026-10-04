import { Effect } from 'effect'
import type { BinaryFiles } from '@excalidraw/excalidraw/types'
import { SceneApi } from '@/entities/scene'
import { exportAsPng, exportAsSvg, fixCollaborators } from '@/shared/lib/excalidraw-utils'
import { StorageService } from '@/shared/lib/storage-service'
import { FILES_STORAGE_KEY } from '@/shared/config'
import type { ExportFormat } from '@/shared/lib/types'

export class ExportSceneError {
  readonly _tag = 'ExportSceneError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export function useSceneExport() {
  const api = new SceneApi()

  const exportScene = (key: string, format: ExportFormat): Effect.Effect<void, ExportSceneError> =>
    Effect.gen(function* () {
      const scene = yield* api.fetchOne(key).pipe(
        Effect.mapError(() => new ExportSceneError(`Failed to fetch scene: ${key}`)),
      )

      const elements = scene.elements || []
      const appState = fixCollaborators(scene.appState || {})
      const name = scene.name || 'scene'
      const localFiles = StorageService.loadSync<BinaryFiles>(FILES_STORAGE_KEY) || {}
      const files = { ...localFiles, ...(scene.files || {}) }

      if (format === 'png') {
        yield* exportAsPng(elements, appState, files, `${name}.png`).pipe(
          Effect.mapError(() => new ExportSceneError('Failed to export PNG')),
        )
      } else {
        yield* exportAsSvg(elements, appState, files, `${name}.svg`).pipe(
          Effect.mapError(() => new ExportSceneError('Failed to export SVG')),
        )
      }
    })

  return { exportScene }
}

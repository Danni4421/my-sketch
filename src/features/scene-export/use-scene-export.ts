import { Effect } from 'effect'
import { SceneApi } from '@/entities/scene'
import { exportAsPng, exportAsSvg, fixCollaborators } from '@/shared/lib/excalidraw-utils'
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

      if (format === 'png') {
        yield* exportAsPng(elements, appState, `${name}.png`).pipe(
          Effect.mapError(() => new ExportSceneError('Failed to export PNG')),
        )
      } else {
        yield* exportAsSvg(elements, appState, `${name}.svg`).pipe(
          Effect.mapError(() => new ExportSceneError('Failed to export SVG')),
        )
      }
    })

  return { exportScene }
}

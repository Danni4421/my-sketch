import { Effect } from 'effect'
import { SceneApi, type SceneCreate } from '@/entities/scene'
import type { SceneStatus } from '@/shared/lib/types'

export class SaveError {
  readonly _tag = 'SaveError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export function useSceneSave() {
  const api = new SceneApi()

  const save = (
    elements: readonly unknown[],
    appState: Record<string, unknown>,
    onStatus?: (status: SceneStatus) => void,
  ): Effect.Effect<string, SaveError> =>
    Effect.gen(function* () {
      onStatus?.('saving')

      const scene: SceneCreate = {
        type: 'sketch-board',
        name: `Sketch ${new Date().toLocaleString()}`,
        elements: [...elements],
        appState,
        savedAt: new Date().toISOString(),
      }

      const result = yield* api.save(scene).pipe(
        Effect.mapError(() => new SaveError('Failed to save scene')),
      )

      onStatus?.('saved')
      setTimeout(() => onStatus?.('idle'), 2000)

      return result
    }).pipe(
      Effect.catchAll((e) => {
        onStatus?.('error')
        return Effect.fail(e)
      }),
    )

  const update = (
    key: string,
    data: Partial<SceneCreate>,
    onStatus?: (status: SceneStatus) => void,
  ): Effect.Effect<boolean, SaveError> =>
    Effect.gen(function* () {
      onStatus?.('saving')

      const result = yield* api.update(key, data).pipe(
        Effect.mapError(() => new SaveError('Failed to update scene')),
      )

      onStatus?.('saved')
      setTimeout(() => onStatus?.('idle'), 2000)

      return result
    }).pipe(
      Effect.catchAll((e) => {
        onStatus?.('error')
        return Effect.fail(e)
      }),
    )

  return { save, update }
}

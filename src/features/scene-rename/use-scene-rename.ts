import { Effect } from 'effect'
import { SceneApi } from '@/entities/scene'

export class RenameError {
  readonly _tag = 'RenameError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export function useSceneRename(onRenamed?: () => void) {
  const api = new SceneApi()

  const rename = (key: string, newName: string): Effect.Effect<boolean, RenameError> =>
    Effect.gen(function* () {
      const result = yield* api.rename(key, newName).pipe(
        Effect.mapError(() => new RenameError(`Failed to rename scene: ${key}`)),
      )

      if (result) {
        onRenamed?.()
      }

      return result
    })

  return { rename }
}

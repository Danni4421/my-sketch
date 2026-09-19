import { Effect } from 'effect'
import { SceneApi } from '@/entities/scene'

export class DeleteError {
  readonly _tag = 'DeleteError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export function useSceneDelete(onDeleted?: (key: string) => void) {
  const api = new SceneApi()

  const remove = (key: string): Effect.Effect<boolean, DeleteError> =>
    Effect.gen(function* () {
      const result = yield* api.remove(key).pipe(
        Effect.mapError(() => new DeleteError(`Failed to delete scene: ${key}`)),
      )

      if (result) {
        onDeleted?.(key)
      }

      return result
    })

  return { remove }
}

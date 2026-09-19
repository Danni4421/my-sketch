import { Effect } from 'effect'

export class StorageError {
  readonly _tag = 'StorageError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export class StorageService {
  static loadSync<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  }

  static load<T>(key: string): Effect.Effect<T | null, StorageError> {
    return Effect.sync(() => {
      try {
        const raw = localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : null
      } catch (e) {
        return Effect.runSync(Effect.fail(new StorageError(`Failed to load from storage: ${key}`)))
      }
    })
  }

  static save(key: string, data: unknown): Effect.Effect<void, StorageError> {
    return Effect.sync(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch (e) {
        return Effect.runSync(Effect.fail(new StorageError(`Failed to save to storage: ${key}`)))
      }
    })
  }

  static remove(key: string): Effect.Effect<void, StorageError> {
    return Effect.sync(() => {
      localStorage.removeItem(key)
    })
  }
}

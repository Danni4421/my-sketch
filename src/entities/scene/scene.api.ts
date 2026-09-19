import { Effect } from 'effect'
import { API_URL } from '@/shared/config'
import type { Scene, SceneCreate } from './scene.model'

export class ApiError {
  readonly _tag = 'ApiError' as const
  readonly message: string
  readonly status?: number
  constructor(message: string, status?: number) {
    this.message = message
    this.status = status
  }
}

export class NetworkError {
  readonly _tag = 'NetworkError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export class ParseError {
  readonly _tag = 'ParseError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

type SceneApiError = ApiError | NetworkError | ParseError

export class SceneApi {
  private base: string

  constructor() {
    this.base = `${API_URL}/api/scenes`
  }

  fetchAll(): Effect.Effect<readonly Scene[], SceneApiError> {
    return Effect.gen(this, function* () {
      const res = yield* Effect.tryPromise({
        try: () => fetch(this.base),
        catch: () => new NetworkError('Failed to connect to server'),
      })

      if (!res.ok) {
        return yield* Effect.fail(new ApiError('Failed to fetch scenes', res.status))
      }

      const data = yield* Effect.tryPromise({
        try: () => res.json() as Promise<readonly Scene[]>,
        catch: () => new ParseError('Failed to parse scene list'),
      })

      return data
    })
  }

  fetchOne(key: string): Effect.Effect<Scene, SceneApiError> {
    return Effect.gen(this, function* () {
      const res = yield* Effect.tryPromise({
        try: () => fetch(`${this.base}/${encodeURIComponent(key)}`),
        catch: () => new NetworkError('Failed to connect to server'),
      })

      if (!res.ok) {
        return yield* Effect.fail(new ApiError('Scene not found', res.status))
      }

      const data = yield* Effect.tryPromise({
        try: () => res.json() as Promise<Scene>,
        catch: () => new ParseError('Failed to parse scene'),
      })

      return data
    })
  }

  save(scene: SceneCreate): Effect.Effect<string, SceneApiError> {
    return Effect.gen(this, function* () {
      const res = yield* Effect.tryPromise({
        try: () =>
          fetch(this.base, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scene),
          }),
        catch: () => new NetworkError('Failed to connect to server'),
      })

      if (!res.ok) {
        return yield* Effect.fail(new ApiError('Failed to save scene', res.status))
      }

      const data = yield* Effect.tryPromise({
        try: () => res.json() as Promise<{ key: string }>,
        catch: () => new ParseError('Failed to parse save response'),
      })

      return data.key
    })
  }

  remove(key: string): Effect.Effect<boolean, NetworkError> {
    return Effect.gen(this, function* () {
      const res = yield* Effect.tryPromise({
        try: () => fetch(`${this.base}/${encodeURIComponent(key)}`, { method: 'DELETE' }),
        catch: () => new NetworkError('Failed to connect to server'),
      })
      return res.ok
    })
  }

  rename(key: string, newName: string): Effect.Effect<boolean, SceneApiError> {
    return Effect.gen(this, function* () {
      const scene = yield* this.fetchOne(key)
      yield* this.save({
        ...scene,
        name: newName,
        type: scene.type || 'sketch-board',
        elements: scene.elements || [],
        appState: scene.appState || {},
        savedAt: scene.savedAt || new Date().toISOString(),
      })
      return yield* this.remove(key)
    })
  }
}

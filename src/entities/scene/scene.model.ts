import { Schema } from 'effect'

export interface Scene {
  readonly key: string
  readonly type?: string
  readonly name?: string
  readonly savedAt?: string
  readonly elements?: readonly unknown[]
  readonly appState?: Record<string, unknown>
}

export interface SceneCreate {
  readonly type: string
  readonly name: string
  readonly elements: readonly unknown[]
  readonly appState: Record<string, unknown>
  readonly savedAt: string
}

export type SceneList = readonly Scene[]

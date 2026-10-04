import { Schema } from 'effect'
import type { BinaryFiles } from '@excalidraw/excalidraw/types'

export interface Scene {
  readonly key: string
  readonly type?: string
  readonly name?: string
  readonly savedAt?: string
  readonly elements?: readonly unknown[]
  readonly appState?: Record<string, unknown>
  readonly files?: BinaryFiles
}

export interface SceneCreate {
  readonly type: string
  readonly name: string
  readonly elements: readonly unknown[]
  readonly appState: Record<string, unknown>
  readonly savedAt: string
}

export type SceneList = readonly Scene[]

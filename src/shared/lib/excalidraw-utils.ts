import { Effect } from 'effect'
import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw'

export class ExportError {
  readonly _tag = 'ExportError' as const
  readonly message: string
  constructor(message: string) {
    this.message = message
  }
}

export function fixCollaborators(appState: Record<string, unknown>): Record<string, unknown> {
  if (!appState.collaborators || !(appState.collaborators as any).forEach) {
    return { ...appState, collaborators: new Map() }
  }
  return appState
}

export function downloadBlob(blob: Blob, filename: string): Effect.Effect<void, ExportError> {
  return Effect.sync(() => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }).pipe(
    Effect.catchAll(() => Effect.fail(new ExportError(`Failed to download blob: ${filename}`))),
  )
}

export function exportAsPng(
  elements: readonly unknown[],
  appState: Record<string, unknown>,
  name: string,
): Effect.Effect<void, ExportError> {
  return Effect.tryPromise({
    try: (): Promise<Blob> =>
      exportToBlob({
        elements,
        appState: { ...appState, collaborators: new Map() },
        files: {},
        exportBackground: true,
        name,
      }) as Promise<Blob>,
    catch: () => new ExportError(`Failed to export PNG: ${name}`),
  }).pipe(
    Effect.flatMap((blob) => downloadBlob(blob, name)),
  )
}

export function exportAsSvg(
  elements: readonly unknown[],
  appState: Record<string, unknown>,
  name: string,
): Effect.Effect<void, ExportError> {
  return Effect.tryPromise({
    try: (): Promise<Blob> =>
      exportToSvg({
        elements,
        appState: { ...appState, collaborators: new Map() },
        files: {},
        exportBackground: true,
      }).then((svg: any) => new Blob([String(svg)], { type: 'image/svg+xml' })),
    catch: () => new ExportError(`Failed to export SVG: ${name}`),
  }).pipe(
    Effect.flatMap((blob) => downloadBlob(blob, name)),
  )
}

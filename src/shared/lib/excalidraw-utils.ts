import { exportToBlob, exportToSvg } from '@excalidraw/excalidraw'

export function fixCollaborators(appState: Record<string, unknown>): Record<string, unknown> {
  if (!appState.collaborators || !(appState.collaborators as any).forEach) {
    return { ...appState, collaborators: new Map() }
  }
  return appState
}

export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportAsPng(elements: any[], appState: any, name: string): Promise<void> {
  const blob = await exportToBlob({
    elements,
    appState: { ...appState, collaborators: new Map() },
    files: {},
    exportBackground: true,
    name,
  })
  await downloadBlob(blob, name)
}

export async function exportAsSvg(elements: any[], appState: any, name: string): Promise<void> {
  const svg = await exportToSvg({
    elements,
    appState: { ...appState, collaborators: new Map() },
    files: {},
    exportBackground: true,
  })
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  await downloadBlob(blob, name)
}

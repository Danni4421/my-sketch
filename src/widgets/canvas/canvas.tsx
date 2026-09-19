import type React from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import { StorageService } from '@/shared/lib'
import { STORAGE_KEY } from '@/shared/config'

function deserializeAppState(appState: any) {
  if (appState?.collaborators && !appState.collaborators.forEach) {
    return { ...appState, collaborators: new Map(appState.collaborators) }
  }
  return appState
}

interface CanvasProps {
  excalidrawAPI: (api: any) => void
  onChange: (elements: any, appState: any, files: any) => void
  renderTopRightUI?: (isMobile: boolean, appState: any) => React.JSX.Element | null
}

export function Canvas({ excalidrawAPI, onChange, renderTopRightUI }: CanvasProps) {
  const saved = StorageService.loadSync<{ elements?: any[]; appState?: any }>(STORAGE_KEY)
  const initialData = saved
    ? { elements: saved.elements || [], appState: deserializeAppState(saved.appState) }
    : { elements: [], appState: { collaborators: new Map() } }

  return (
    <Excalidraw
      name="sketch-board"
      theme="light"
      viewModeEnabled={false}
      isCollaborating={false}
      aiEnabled={false}
      handleKeyboardGlobally={false}
      renderTopRightUI={renderTopRightUI}
      UIOptions={{
        canvasActions: {
          export: false, saveAsImage: false, toggleTheme: false,
          saveToActiveFile: false, loadScene: false,
          clearCanvas: false, changeViewBackgroundColor: false,
        },
        tools: { image: false },
      }}
      initialData={initialData}
      onChange={onChange}
      excalidrawAPI={excalidrawAPI}
    />
  )
}

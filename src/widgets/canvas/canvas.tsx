import type React from 'react'
import { useState, useCallback } from 'react'
import { Excalidraw, useHandleLibrary } from '@excalidraw/excalidraw'
import { StorageService } from '@/shared/lib'
import { STORAGE_KEY, LIBRARY_STORAGE_KEY } from '@/shared/config'

function deserializeAppState(appState: any) {
  if (!appState) return { collaborators: new Map() }

  const collab = appState.collaborators
  if (collab instanceof Map) return appState
  if (Array.isArray(collab)) return { ...appState, collaborators: new Map(collab) }
  return { ...appState, collaborators: new Map() }
}

interface CanvasProps {
  excalidrawAPI: (api: any) => void
  onChange: (elements: any, appState: any, files: any) => void
  renderTopRightUI?: (isMobile: boolean, appState: any) => React.JSX.Element | null
}

const libraryAdapter = {
  load: () => {
    try {
      const data = localStorage.getItem(LIBRARY_STORAGE_KEY)
      if (data) return { libraryItems: JSON.parse(data) }
    } catch {}
    return null
  },
  save: ({ libraryItems }: { libraryItems: any[] }) => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryItems))
    } catch {}
  },
}

export function Canvas({ excalidrawAPI, onChange, renderTopRightUI }: CanvasProps) {
  const [api, setApi] = useState<any>(null)

  const handleAPI = useCallback((a: any) => {
    setApi(a)
    excalidrawAPI(a)
  }, [excalidrawAPI])

  useHandleLibrary({
    excalidrawAPI: api,
    adapter: libraryAdapter,
    validateLibraryUrl: () => true,
  })

  const saved = StorageService.loadSync<{ elements?: any[]; appState?: any }>(STORAGE_KEY)
  const initialData = {
    elements: saved?.elements || [],
    appState: deserializeAppState(saved?.appState),
  }

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
      excalidrawAPI={handleAPI}
    />
  )
}

import { useCallback, useRef, useEffect, useState } from 'react'
import { SceneApi } from '@/entities/scene'
import { StorageManager } from '@/shared/lib'
import { STORAGE_KEY } from '@/shared/config'
import { fixCollaborators, exportAsPng, exportAsSvg } from '@/shared/lib'
import { useSceneSave } from '@/features/scene-save'
import { useSceneLoad } from '@/features/scene-load'
import { useSceneDelete } from '@/features/scene-delete'
import { useSceneRename } from '@/features/scene-rename'
import { useSceneExport } from '@/features/scene-export'
import { Canvas } from '@/widgets/canvas'
import { Toolbar } from '@/widgets/toolbar'
import { Sidebar } from '@/widgets/sidebar'
import type { Scene } from '@/entities/scene'

const sceneApi = new SceneApi()
const storage = new StorageManager(STORAGE_KEY)

export function BoardPage() {
  const apiRef = useRef<any>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loadingScenes, setLoadingScenes] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const { save } = useSceneSave(setSaveStatus)
  const { load: loadScene } = useSceneLoad(apiRef)
  const { remove: deleteScene } = useSceneDelete()
  const { rename: renameScene } = useSceneRename()
  const { exportScene } = useSceneExport()

  const handleAPI = useCallback((api: any) => { apiRef.current = api }, [])

  const handleChange = useCallback((elements: any, appState: any, files: any) => {
    storage.save({ type: 'sketch-board', elements: elements || [], appState })
  }, [])

  const fetchScenes = useCallback(async () => {
    setLoadingScenes(true)
    const data = await sceneApi.fetchAll()
    setScenes(data.sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()))
    setLoadingScenes(false)
  }, [])

  const handleOpenSidebar = useCallback(async () => {
    setSidebarOpen(true)
    await fetchScenes()
  }, [fetchScenes])

  const handleLoadScene = useCallback(async (key: string) => {
    const ok = await loadScene(key)
    if (ok) setSidebarOpen(false)
  }, [loadScene])

  const handleDeleteScene = useCallback(async (key: string) => {
    await deleteScene(key)
    setScenes((prev) => prev.filter((s) => s.key !== key))
  }, [deleteScene])

  const handleRenameScene = useCallback(async (key: string, newName: string) => {
    await renameScene(key, newName)
    setEditingKey(null)
    setEditingName('')
    await fetchScenes()
  }, [renameScene, fetchScenes])

  const handleExportScene = useCallback(async (key: string, format: 'png' | 'svg') => {
    await exportScene(key, format)
  }, [exportScene])

  const handleSaveToServer = useCallback(async () => {
    if (!apiRef.current) return
    await save(apiRef.current.getSceneElements(), apiRef.current.getAppState())
  }, [save])

  const handleDownloadPNG = useCallback(async () => {
    if (!apiRef.current) return
    await exportAsPng(
      apiRef.current.getSceneElements(),
      apiRef.current.getAppState(),
      'sketch-board.png',
    )
  }, [])

  const handleDownloadSVG = useCallback(async () => {
    if (!apiRef.current) return
    await exportAsSvg(
      apiRef.current.getSceneElements(),
      apiRef.current.getAppState(),
      'sketch-board.svg',
    )
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (apiRef.current) {
          storage.save({
            type: 'sketch-board',
            elements: apiRef.current.getSceneElements(),
            appState: apiRef.current.getAppState(),
          })
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'P') { e.preventDefault(); handleDownloadPNG() }
      if (e.ctrlKey && e.shiftKey && e.key === 'S') { e.preventDefault(); handleDownloadSVG() }
      if (e.ctrlKey && e.key === 'l') { e.preventDefault(); handleOpenSidebar() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleDownloadPNG, handleDownloadSVG, handleOpenSidebar])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar
        open={sidebarOpen}
        scenes={scenes}
        loading={loadingScenes}
        editingKey={editingKey}
        editingName={editingName}
        onEditNameChange={setEditingName}
        onStartEdit={(key, name) => { setEditingKey(key); setEditingName(name) }}
        onCancelEdit={() => { setEditingKey(null); setEditingName('') }}
        onRename={handleRenameScene}
        onLoad={handleLoadScene}
        onDelete={handleDeleteScene}
        onExport={handleExportScene}
        onRefresh={fetchScenes}
        onClose={() => setSidebarOpen(false)}
      />
      <Canvas
        excalidrawAPI={handleAPI}
        onChange={handleChange}
        renderTopRightUI={(_isMobile, _appState) => (
          <Toolbar
            saveStatus={saveStatus}
            errorMsg={errorMsg}
            onSave={handleSaveToServer}
            onOpenSidebar={handleOpenSidebar}
            onExportPNG={handleDownloadPNG}
            onExportSVG={handleDownloadSVG}
          />
        )}
      />
    </div>
  )
}

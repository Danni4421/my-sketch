import { useCallback, useMemo, useEffect } from 'react'
import { useExcalidrawAPI } from '@/widgets/canvas'
import { useAutoSave } from '@/features/scene-save'
import { useLocalExport } from '@/features/scene-export'
import { useSceneManagement } from '@/hooks'
import { useKeyboardShortcuts } from '@/shared/hooks'
import { useAuth } from '@/features/auth'
import { Canvas } from '@/widgets/canvas'
import { Toolbar } from '@/widgets/toolbar'
import { Sidebar } from '@/widgets/sidebar'

export function BoardPage() {
  const { apiRef, handleAPI, getElements, getAppState, resetCanvas } = useExcalidrawAPI()
  const { onChange: autoSave, setSceneKey: setAutoSaveSceneKey, flush: flushAutoSave } = useAutoSave(getElements, getAppState)
  const { exportPNG, exportSVG } = useLocalExport(getElements, getAppState)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const {
    saveStatus, errorMsg, sidebarOpen, scenes, loadingScenes,
    editingKey, editingName, currentSceneKey,
    operatingKey, operatingType,
    setEditingName, setEditingKey,
    startEdit, cancelEdit, openSidebar, loadScene, deleteScene,
    renameScene, exportScene, saveToServer, saveAsNew, loadLatestScene, refreshScenes, closeSidebar,
  } = useSceneManagement(apiRef, resetCanvas)

  useEffect(() => {
    setAutoSaveSceneKey(currentSceneKey)
  }, [currentSceneKey, setAutoSaveSceneKey])

  useEffect(() => {
    if (!authLoading && isAuthenticated && !currentSceneKey) {
      loadLatestScene()
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading])

  const currentSceneName = useMemo(() => {
    if (!currentSceneKey) return null
    const scene = scenes.find((s) => s.key === currentSceneKey)
    return scene?.name ?? null
  }, [currentSceneKey, scenes])

  const handleSave = useCallback(() => {
    flushAutoSave()
    saveToServer()
  }, [flushAutoSave, saveToServer])

  useKeyboardShortcuts({
    onSave: handleSave,
    onExportPNG: exportPNG,
    onExportSVG: exportSVG,
    onOpenSidebar: openSidebar,
  })

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar
        open={sidebarOpen}
        scenes={scenes}
        loading={loadingScenes}
        currentSceneKey={currentSceneKey}
        editingKey={editingKey}
        editingName={editingName}
        operatingKey={operatingKey}
        operationType={operatingType}
        onEditNameChange={setEditingName}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onRename={renameScene}
        onLoad={loadScene}
        onDelete={deleteScene}
        onExport={exportScene}
        onRefresh={refreshScenes}
        onClose={closeSidebar}
      />
      <Canvas
        excalidrawAPI={handleAPI}
        onChange={autoSave}
        renderTopRightUI={(_isMobile, _appState) => (
          <Toolbar
            saveStatus={saveStatus}
            errorMsg={errorMsg}
            currentSceneName={currentSceneName}
            hasCurrentScene={currentSceneKey !== null}
            onSave={handleSave}
            onSaveAsNew={saveAsNew}
            onOpenSidebar={openSidebar}
            onExportPNG={exportPNG}
            onExportSVG={exportSVG}
          />
        )}
      />
    </div>
  )
}

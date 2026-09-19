import { useCallback } from 'react'
import { useExcalidrawAPI } from '@/widgets/canvas'
import { useAutoSave } from '@/features/scene-save'
import { useLocalExport } from '@/features/scene-export'
import { useSceneManagement } from '@/hooks'
import { useKeyboardShortcuts } from '@/shared/hooks'
import { Canvas } from '@/widgets/canvas'
import { Toolbar } from '@/widgets/toolbar'
import { Sidebar } from '@/widgets/sidebar'

export function BoardPage() {
  const { apiRef, handleAPI, getElements, getAppState } = useExcalidrawAPI()
  const autoSave = useAutoSave(getElements, getAppState)
  const { exportPNG, exportSVG } = useLocalExport(getElements, getAppState)

  const {
    saveStatus, errorMsg, sidebarOpen, scenes, loadingScenes,
    editingKey, editingName, setEditingName, setEditingKey,
    startEdit, cancelEdit, openSidebar, loadScene, deleteScene,
    renameScene, exportScene, saveToServer, refreshScenes, closeSidebar,
  } = useSceneManagement(apiRef)

  const handleSave = useCallback(() => saveToServer(), [saveToServer])

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
        editingKey={editingKey}
        editingName={editingName}
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
            onSave={handleSave}
            onOpenSidebar={openSidebar}
            onExportPNG={exportPNG}
            onExportSVG={exportSVG}
          />
        )}
      />
    </div>
  )
}

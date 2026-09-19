import { useState, useCallback } from 'react'
import { Effect, Runtime } from 'effect'
import { SceneApi, type Scene } from '@/entities/scene'
import type { SceneStatus, ExportFormat } from '@/shared/lib/types'
import { useSceneSave } from '@/features/scene-save'
import { useSceneLoad } from '@/features/scene-load'
import { useSceneDelete } from '@/features/scene-delete'
import { useSceneRename } from '@/features/scene-rename'
import { useSceneExport } from '@/features/scene-export'

const runtime = Runtime.defaultRuntime

export function useSceneManagement(apiRef: React.MutableRefObject<any>) {
  const [saveStatus, setSaveStatus] = useState<SceneStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loadingScenes, setLoadingScenes] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const sceneApi = new SceneApi()
  const { save } = useSceneSave()
  const { load: loadScene } = useSceneLoad(apiRef)
  const { remove: deleteScene } = useSceneDelete()
  const { rename: renameScene } = useSceneRename()
  const { exportScene } = useSceneExport()

  const fetchScenes = useCallback(async () => {
    setLoadingScenes(true)
    const exit = await Runtime.runPromiseExit(runtime)(sceneApi.fetchAll())
    if (exit._tag === 'Success') {
      const data = exit.value
      setScenes([...data].sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()))
    }
    setLoadingScenes(false)
  }, [])

  const openSidebar = useCallback(async () => {
    setSidebarOpen(true)
    await fetchScenes()
  }, [fetchScenes])

  const loadSceneHandler = useCallback(async (key: string) => {
    const exit = await Runtime.runPromiseExit(runtime)(loadScene(key))
    if (exit._tag === 'Success' && exit.value) {
      setSidebarOpen(false)
    }
  }, [loadScene])

  const deleteSceneHandler = useCallback(async (key: string) => {
    const exit = await Runtime.runPromiseExit(runtime)(deleteScene(key))
    if (exit._tag === 'Success' && exit.value) {
      setScenes((prev) => prev.filter((s) => s.key !== key))
    }
  }, [deleteScene])

  const renameSceneHandler = useCallback(async (key: string, newName: string) => {
    const exit = await Runtime.runPromiseExit(runtime)(renameScene(key, newName))
    if (exit._tag === 'Success' && exit.value) {
      setEditingKey(null)
      setEditingName('')
      await fetchScenes()
    }
  }, [renameScene, fetchScenes])

  const exportSceneHandler = useCallback(async (key: string, format: ExportFormat) => {
    Runtime.runPromiseExit(runtime)(
      exportScene(key, format).pipe(Effect.catchAll(() => Effect.void)),
    )
  }, [exportScene])

  const saveToServer = useCallback(async () => {
    if (!apiRef.current) return
    const exit = await Runtime.runPromiseExit(runtime)(
      save(apiRef.current.getSceneElements(), apiRef.current.getAppState(), setSaveStatus),
    )
    if (exit._tag === 'Failure') {
      setErrorMsg('Save failed')
    }
  }, [save])

  return {
    saveStatus,
    errorMsg,
    sidebarOpen,
    scenes,
    loadingScenes,
    editingKey,
    editingName,
    setEditingName,
    setEditingKey,
    startEdit: (key: string, name: string) => { setEditingKey(key); setEditingName(name) },
    cancelEdit: () => { setEditingKey(null); setEditingName('') },
    openSidebar,
    loadScene: loadSceneHandler,
    deleteScene: deleteSceneHandler,
    renameScene: renameSceneHandler,
    exportScene: exportSceneHandler,
    saveToServer,
    refreshScenes: fetchScenes,
    closeSidebar: () => setSidebarOpen(false),
  }
}

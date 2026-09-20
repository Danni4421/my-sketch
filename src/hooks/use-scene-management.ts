import { useState, useCallback, useEffect } from 'react'
import { Effect, Runtime } from 'effect'
import { SceneApi, type Scene } from '@/entities/scene'
import type { SceneStatus, ExportFormat } from '@/shared/lib/types'
import { SCENE_KEY_STORAGE } from '@/shared/config'
import { useSceneSave } from '@/features/scene-save'
import { useSceneLoad } from '@/features/scene-load'
import { useSceneDelete } from '@/features/scene-delete'
import { useSceneRename } from '@/features/scene-rename'
import { useSceneExport } from '@/features/scene-export'

const runtime = Runtime.defaultRuntime

function loadPersistedSceneKey(): string | null {
  try {
    return localStorage.getItem(SCENE_KEY_STORAGE)
  } catch {
    return null
  }
}

function persistSceneKey(key: string | null) {
  try {
    if (key) {
      localStorage.setItem(SCENE_KEY_STORAGE, key)
    } else {
      localStorage.removeItem(SCENE_KEY_STORAGE)
    }
  } catch {}
}

export function useSceneManagement(apiRef: React.MutableRefObject<any>, resetCanvas: () => void) {
  const [saveStatus, setSaveStatus] = useState<SceneStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loadingScenes, setLoadingScenes] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [currentSceneKey, setCurrentSceneKey] = useState<string | null>(loadPersistedSceneKey)
  const [operatingKey, setOperatingKey] = useState<string | null>(null)
  const [operatingType, setOperatingType] = useState<'delete' | 'rename' | 'export-png' | 'export-svg' | null>(null)

  useEffect(() => {
    persistSceneKey(currentSceneKey)
  }, [currentSceneKey])

  const sceneApi = new SceneApi()
  const { save, update: updateScene } = useSceneSave()
  const { load: loadScene } = useSceneLoad(apiRef)
  const { remove: deleteScene } = useSceneDelete()
  const { rename: renameScene } = useSceneRename()
  const { exportScene } = useSceneExport()

  const startOperation = (key: string, type: typeof operatingType) => {
    setOperatingKey(key)
    setOperatingType(type)
  }

  const endOperation = () => {
    setOperatingKey(null)
    setOperatingType(null)
  }

  const fetchScenes = useCallback(async () => {
    setLoadingScenes(true)
    const exit = await Runtime.runPromiseExit(runtime)(sceneApi.fetchAll())
    if (exit._tag === 'Success') {
      const data = exit.value
      setScenes([...data].sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()))
    }
    setLoadingScenes(false)
  }, [])

  const loadLatestScene = useCallback(async () => {
    if (!apiRef.current) return
    const exit = await Runtime.runPromiseExit(runtime)(sceneApi.fetchAll())
    if (exit._tag !== 'Success' || exit.value.length === 0) return

    const sorted = [...exit.value].sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime())
    const latest = sorted[0]
    if (!latest?.key) return

    const loadExit = await Runtime.runPromiseExit(runtime)(loadScene(latest.key))
    if (loadExit._tag === 'Success' && loadExit.value) {
      setCurrentSceneKey(latest.key)
    }
  }, [apiRef, loadScene])

  const openSidebar = useCallback(async () => {
    setSidebarOpen(true)
    await fetchScenes()
  }, [fetchScenes])

  const loadSceneHandler = useCallback(async (key: string) => {
    const exit = await Runtime.runPromiseExit(runtime)(loadScene(key))
    if (exit._tag === 'Success' && exit.value) {
      setCurrentSceneKey(key)
      setSidebarOpen(false)
    }
  }, [loadScene])

  const deleteSceneHandler = useCallback(async (key: string) => {
    startOperation(key, 'delete')
    const exit = await Runtime.runPromiseExit(runtime)(deleteScene(key))
    if (exit._tag === 'Success' && exit.value) {
      setScenes((prev) => prev.filter((s) => s.key !== key))
      if (currentSceneKey === key) {
        setCurrentSceneKey(null)
      }
    }
    endOperation()
  }, [deleteScene, currentSceneKey])

  const renameSceneHandler = useCallback(async (key: string, newName: string) => {
    startOperation(key, 'rename')
    const exit = await Runtime.runPromiseExit(runtime)(renameScene(key, newName))
    if (exit._tag === 'Success' && exit.value) {
      setEditingKey(null)
      setEditingName('')
      await fetchScenes()
    }
    endOperation()
  }, [renameScene, fetchScenes])

  const exportSceneHandler = useCallback(async (key: string, format: ExportFormat) => {
    startOperation(key, format === 'png' ? 'export-png' : 'export-svg')
    await Runtime.runPromiseExit(runtime)(
      exportScene(key, format).pipe(Effect.catchAll(() => Effect.void)),
    )
    endOperation()
  }, [exportScene])

  const saveToServer = useCallback(async () => {
    if (!apiRef.current) return

    if (currentSceneKey) {
      setSaveStatus('saving')
      const exit = await Runtime.runPromiseExit(runtime)(
        updateScene(currentSceneKey, {
          elements: [...apiRef.current.getSceneElements()],
          appState: apiRef.current.getAppState(),
        }, setSaveStatus),
      )
      if (exit._tag === 'Failure') {
        setErrorMsg('Save failed')
      }
    } else {
      const exit = await Runtime.runPromiseExit(runtime)(
        save(apiRef.current.getSceneElements(), apiRef.current.getAppState(), setSaveStatus),
      )
      if (exit._tag === 'Success') {
        setCurrentSceneKey(exit.value)
      } else {
        setErrorMsg('Save failed')
      }
    }
  }, [save, updateScene, currentSceneKey])

  const saveAsNew = useCallback(async () => {
    if (!apiRef.current) return
    const exit = await Runtime.runPromiseExit(runtime)(
      save(apiRef.current.getSceneElements(), apiRef.current.getAppState(), setSaveStatus),
    )
    if (exit._tag === 'Success') {
      setCurrentSceneKey(exit.value)
      resetCanvas()
    } else {
      setErrorMsg('Save failed')
    }
  }, [save, resetCanvas])

  return {
    saveStatus,
    errorMsg,
    sidebarOpen,
    scenes,
    loadingScenes,
    editingKey,
    editingName,
    currentSceneKey,
    operatingKey,
    operatingType,
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
    saveAsNew,
    loadLatestScene,
    refreshScenes: fetchScenes,
    closeSidebar: () => setSidebarOpen(false),
  }
}

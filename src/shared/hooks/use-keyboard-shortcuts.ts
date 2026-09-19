import { useEffect, useCallback } from 'react'

interface UseKeyboardShortcutsProps {
  onSave: () => void
  onExportPNG: () => void
  onExportSVG: () => void
  onOpenSidebar: () => void
}

export function useKeyboardShortcuts({
  onSave, onExportPNG, onExportSVG, onOpenSidebar,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      onSave()
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault()
      onExportPNG()
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault()
      onExportSVG()
    }
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      onOpenSidebar()
    }
  }, [onSave, onExportPNG, onExportSVG, onOpenSidebar])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

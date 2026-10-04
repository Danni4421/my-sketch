import { useEffect } from 'react'

function containsImageFile(clipboardData: DataTransfer | null): boolean {
  if (!clipboardData) return false
  for (const item of Array.from(clipboardData.items)) {
    if (item.kind === 'file' && item.type.startsWith('image/')) return true
  }
  return false
}

function isWritableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  )
}

export function usePasteImage() {
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!event.isTrusted || !containsImageFile(event.clipboardData)) return
      if (isWritableTarget(event.target)) return

      const container = document.querySelector('.excalidraw-container')
      if (!(container instanceof HTMLElement)) return
      if (container.contains(document.activeElement)) return

      let synthetic: ClipboardEvent
      try {
        synthetic = new ClipboardEvent('paste', {
          clipboardData: event.clipboardData,
          bubbles: true,
          cancelable: true,
        })
      } catch {
        return
      }
      if (synthetic.clipboardData !== event.clipboardData) return

      event.preventDefault()
      event.stopImmediatePropagation()
      container.focus()
      container.dispatchEvent(synthetic)
    }

    document.addEventListener('paste', handlePaste, true)
    return () => document.removeEventListener('paste', handlePaste, true)
  }, [])
}

import { useCallback } from 'react'
import { Effect, Runtime } from 'effect'
import { exportAsPng, exportAsSvg } from '@/shared/lib/excalidraw-utils'

const runtime = Runtime.defaultRuntime

function runEffect<R, E>(effect: Effect.Effect<R, E>, onError?: (e: E) => void) {
  Runtime.runPromiseExit(runtime)(effect).then((exit) => {
    if (exit._tag === 'Failure') {
      onError?.(exit.cause as E)
    }
  })
}

export function useLocalExport(
  getElements: () => any[],
  getAppState: () => any,
  getFiles: () => Record<string, any>,
) {
  const exportPNG = useCallback(() => {
    runEffect(exportAsPng(getElements(), getAppState(), getFiles(), 'sketch-board.png'))
  }, [getElements, getAppState, getFiles])

  const exportSVG = useCallback(() => {
    runEffect(exportAsSvg(getElements(), getAppState(), getFiles(), 'sketch-board.svg'))
  }, [getElements, getAppState, getFiles])

  return { exportPNG, exportSVG }
}

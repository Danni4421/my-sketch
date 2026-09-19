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

export function useLocalExport(getElements: () => any[], getAppState: () => any) {
  const exportPNG = useCallback(() => {
    runEffect(exportAsPng(getElements(), getAppState(), 'sketch-board.png'))
  }, [getElements, getAppState])

  const exportSVG = useCallback(() => {
    runEffect(exportAsSvg(getElements(), getAppState(), 'sketch-board.svg'))
  }, [getElements, getAppState])

  return { exportPNG, exportSVG }
}

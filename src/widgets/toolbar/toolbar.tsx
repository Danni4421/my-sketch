import { Cloud, FolderOpen, Image, Ruler, Loader2, Check, AlertTriangle, Plus, Layers } from 'lucide-react'
import { useAuth, LoginButton, UserMenu, UserAvatar } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

interface ToolbarProps {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  errorMsg: string
  currentSceneName: string | null
  hasCurrentScene: boolean
  onSave: () => void
  onSaveAsNew: () => void
  onOpenSidebar: () => void
  onExportPNG: () => void
  onExportSVG: () => void
}

const STATUS_ICON: Record<ToolbarProps['saveStatus'], React.ReactNode> = {
  idle: <Cloud className="size-4" />,
  saving: <Loader2 className="size-4 animate-spin" />,
  saved: <Check className="size-4" />,
  error: <AlertTriangle className="size-4" />,
}

export function Toolbar({ saveStatus, errorMsg, currentSceneName, hasCurrentScene, onSave, onSaveAsNew, onOpenSidebar, onExportPNG, onExportSVG }: ToolbarProps) {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" title="Save & account">
          {isLoading ? (
            <Skeleton className="size-9 rounded-full" />
          ) : isAuthenticated ? (
            <UserAvatar className="size-9 rounded-full border border-neutral-100" />
          ) : (
            STATUS_ICON[saveStatus]
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <div className="flex flex-col gap-3">
          {hasCurrentScene && currentSceneName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="size-3.5" />
              <span className="truncate font-medium text-foreground">{currentSceneName}</span>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              title={hasCurrentScene ? "Save changes" : "Save to server"}
            >
              {STATUS_ICON[saveStatus]}
              {hasCurrentScene ? "Save" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveAsNew}
              disabled={saveStatus === 'saving'}
              title="Create new workspace"
            >
              <Plus className="size-3" />
            </Button>
            <Button variant="secondary" size="icon-sm" onClick={onOpenSidebar} title="Switch workspace">
              <FolderOpen className="size-4" />
            </Button>
            <Button variant="secondary" size="icon-sm" onClick={onExportPNG} title="Export PNG">
              <Image className="size-4" />
            </Button>
            <Button variant="secondary" size="icon-sm" onClick={onExportSVG} title="Export SVG">
              <Ruler className="size-4" />
            </Button>
          </div>
          {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}
          <div className="pt-3">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

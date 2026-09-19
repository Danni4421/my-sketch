import { SceneCard } from "./scene-card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { Scene } from "@/entities/scene";

type OperationType = 'delete' | 'rename' | 'export-png' | 'export-svg' | null;

interface SidebarProps {
  open: boolean;
  scenes: Scene[];
  loading: boolean;
  currentSceneKey: string | null;
  editingKey: string | null;
  editingName: string;
  operatingKey: string | null;
  operationType: OperationType;
  onEditNameChange: (name: string) => void;
  onStartEdit: (key: string, name: string) => void;
  onCancelEdit: () => void;
  onRename: (key: string, name: string) => void;
  onLoad: (key: string) => void;
  onDelete: (key: string) => void;
  onExport: (key: string, format: "png" | "svg") => void;
  onRefresh: () => void;
  onClose: () => void;
}

export function Sidebar({
  open,
  scenes,
  loading,
  currentSceneKey,
  editingKey,
  editingName,
  operatingKey,
  operationType,
  onEditNameChange,
  onStartEdit,
  onCancelEdit,
  onRename,
  onLoad,
  onDelete,
  onExport,
  onRefresh,
  onClose,
}: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="border-b">
          <SheetTitle>Workspaces</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">
          {loading ? (
            <Skeleton className="w-full h-24" />
          ) : scenes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground italic">
              No workspaces yet
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {scenes.map((scene) => (
                <SceneCard
                  key={scene.key}
                  scene={scene}
                  isActive={currentSceneKey === scene.key}
                  isEditing={editingKey === scene.key}
                  editingName={editingName}
                  isOperating={operatingKey === scene.key}
                  operationType={operatingKey === scene.key ? operationType : null}
                  onEditNameChange={onEditNameChange}
                  onStartEdit={() => onStartEdit(scene.key, scene.name || "")}
                  onCancelEdit={onCancelEdit}
                  onRename={() => onRename(scene.key, editingName)}
                  onLoad={() => onLoad(scene.key)}
                  onDelete={() => onDelete(scene.key)}
                  onExport={(fmt) => onExport(scene.key, fmt)}
                />
              ))}
            </div>
          )}
        </div>
        <SheetFooter className="border-t">
          <Button variant="outline" onClick={onRefresh}>
            ↻ Refresh
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Scene } from "@/entities/scene";
import { Image, Pen, Trash, Loader2, Check } from "lucide-react";

type OperationType = 'delete' | 'rename' | 'export-png' | 'export-svg' | null;

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  isEditing: boolean;
  editingName: string;
  isOperating: boolean;
  operationType: OperationType;
  onEditNameChange: (name: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onRename: () => void;
  onLoad: () => void;
  onDelete: () => void;
  onExport: (format: "png" | "svg") => void;
}

export function SceneCard({
  scene,
  isActive,
  isEditing,
  editingName,
  isOperating,
  operationType,
  onEditNameChange,
  onStartEdit,
  onCancelEdit,
  onRename,
  onLoad,
  onDelete,
  onExport,
}: SceneCardProps) {
  const isRenameOp = isOperating && operationType === 'rename';
  const isDeleteOp = isOperating && operationType === 'delete';
  const isExportPngOp = isOperating && operationType === 'export-png';
  const isExportSvgOp = isOperating && operationType === 'export-svg';

  return (
    <Card className={`gap-2 p-3 transition-colors ${isActive ? 'border-primary bg-primary/5' : ''}`}>
      <CardContent className="p-0">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              autoFocus
              value={editingName}
              onChange={(e) => onEditNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRename();
                if (e.key === "Escape") onCancelEdit();
              }}
              disabled={isRenameOp}
              className="h-8 text-sm"
            />
            <div className="flex gap-1.5">
              <Button size="sm" onClick={onRename} disabled={isRenameOp}>
                {isRenameOp ? <Loader2 className="size-3 animate-spin" /> : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit} disabled={isRenameOp}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div onClick={onLoad} className="mb-2 cursor-pointer flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-card-foreground">
                  {scene.name || "Untitled"}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {scene.savedAt ? new Date(scene.savedAt).toLocaleString() : ""}
                </p>
              </div>
              {isActive && (
                <span className="shrink-0 rounded-full bg-primary/10 p-1">
                  <Check className="size-3 text-primary" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon-xs"
                variant="outline"
                className="w-auto px-2 text-xs"
                onClick={onStartEdit}
                disabled={isOperating}
              >
                {isRenameOp ? <Loader2 className="size-3 animate-spin" /> : <Pen />}
                <span>Rename</span>
              </Button>
              <Button
                size="icon-xs"
                variant="outline"
                className="w-auto px-2 text-xs"
                onClick={() => onExport("png")}
                disabled={isOperating}
              >
                {isExportPngOp ? <Loader2 className="size-3 animate-spin" /> : <Image />}
                <span>PNG</span>
              </Button>
              <Button
                size="icon-xs"
                variant="outline"
                className="w-auto px-2 text-xs"
                onClick={() => onExport("svg")}
                disabled={isOperating}
              >
                {isExportSvgOp ? <Loader2 className="size-3 animate-spin" /> : <Image />}
                <span>SVG</span>
              </Button>
              <div className="flex-1" />
              <Button
                size="icon-xs"
                variant="outline"
                className="w-auto px-2 text-[11px] bg-red-50 border-none text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={onDelete}
                disabled={isOperating}
              >
                {isDeleteOp ? <Loader2 className="size-3 animate-spin" /> : <Trash />}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

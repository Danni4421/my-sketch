import { SceneCard } from './scene-card'
import type { Scene } from '@/entities/scene'

interface SidebarProps {
  open: boolean
  scenes: Scene[]
  loading: boolean
  editingKey: string | null
  editingName: string
  onEditNameChange: (name: string) => void
  onStartEdit: (key: string, name: string) => void
  onCancelEdit: () => void
  onRename: (key: string, name: string) => void
  onLoad: (key: string) => void
  onDelete: (key: string) => void
  onExport: (key: string, format: 'png' | 'svg') => void
  onRefresh: () => void
  onClose: () => void
}

export function Sidebar({
  open, scenes, loading, editingKey, editingName,
  onEditNameChange, onStartEdit, onCancelEdit, onRename,
  onLoad, onDelete, onExport, onRefresh, onClose,
}: SidebarProps) {
  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }} />
      <div style={panelStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1e1e1e' }}>Saved Scenes</h3>
          <button onClick={onClose} style={closeBtnStyle}>×</button>
        </div>
        <div style={listStyle}>
          {loading ? (
            <div style={emptyStyle}>Loading...</div>
          ) : scenes.length === 0 ? (
            <div style={emptyStyle}>No saved scenes</div>
          ) : (
            scenes.map((scene) => (
              <SceneCard
                key={scene.key}
                scene={scene}
                isEditing={editingKey === scene.key}
                editingName={editingName}
                onEditNameChange={onEditNameChange}
                onStartEdit={() => onStartEdit(scene.key, scene.name || '')}
                onCancelEdit={onCancelEdit}
                onRename={() => onRename(scene.key, editingName)}
                onLoad={() => onLoad(scene.key)}
                onDelete={() => onDelete(scene.key)}
                onExport={(fmt) => onExport(scene.key, fmt)}
              />
            ))
          )}
        </div>
        <div style={footerStyle}>
          <button onClick={onRefresh} style={refreshBtnStyle}>↻ Refresh</button>
        </div>
      </div>
    </>
  )
}

const panelStyle: React.CSSProperties = {
  position: 'absolute', top: 0, right: 0, bottom: 0, width: 340,
  background: '#fff', boxShadow: '-2px 0 12px rgba(0,0,0,0.15)',
  zIndex: 1000, display: 'flex', flexDirection: 'column',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
}
const headerStyle: React.CSSProperties = {
  padding: '16px 16px 12px', borderBottom: '1px solid #e0e0e0',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}
const closeBtnStyle: React.CSSProperties = {
  border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: '#666', padding: '0 4px',
}
const listStyle: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: 8 }
const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: 24, color: '#999', fontSize: 13 }
const footerStyle: React.CSSProperties = { padding: '12px 16px', borderTop: '1px solid #e0e0e0' }
const refreshBtnStyle: React.CSSProperties = {
  width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd',
  background: '#fff', color: '#333', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
}

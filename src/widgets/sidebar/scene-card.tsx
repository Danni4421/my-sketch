import type { Scene } from '@/entities/scene'

interface SceneCardProps {
  scene: Scene
  isEditing: boolean
  editingName: string
  onEditNameChange: (name: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onRename: () => void
  onLoad: () => void
  onDelete: () => void
  onExport: (format: 'png' | 'svg') => void
}

export function SceneCard({
  scene, isEditing, editingName,
  onEditNameChange, onStartEdit, onCancelEdit, onRename,
  onLoad, onDelete, onExport,
}: SceneCardProps) {
  return (
    <div style={cardStyle}>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            autoFocus
            value={editingName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRename()
              if (e.key === 'Escape') onCancelEdit()
            }}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onRename} style={saveBtnStyle}>Save</button>
            <button onClick={onCancelEdit} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div onClick={onLoad} style={{ cursor: 'pointer', marginBottom: 8 }}>
            <div style={nameStyle}>{scene.name || 'Untitled'}</div>
            <div style={dateStyle}>{scene.savedAt ? new Date(scene.savedAt).toLocaleString() : ''}</div>
          </div>
          <div style={actionsStyle}>
            <button onClick={onStartEdit} style={actionBtnStyle}>Rename</button>
            <button onClick={() => onExport('png')} style={actionBtnStyle}>PNG</button>
            <button onClick={() => onExport('svg')} style={actionBtnStyle}>SVG</button>
            <div style={{ flex: 1 }} />
            <button onClick={onDelete} style={deleteBtnStyle}>Delete</button>
          </div>
        </>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  padding: 12, marginBottom: 6, borderRadius: 8,
  border: '1px solid #e8e8e8', background: '#fafafa',
}
const nameStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 500, color: '#1e1e1e',
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
}
const dateStyle: React.CSSProperties = { fontSize: 11, color: '#888', marginTop: 2 }
const inputStyle: React.CSSProperties = {
  padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4,
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
}
const saveBtnStyle: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 4, border: 'none',
  background: '#4a90d9', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
}
const cancelBtnStyle: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 4, border: '1px solid #ddd',
  background: '#fff', color: '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
}
const actionsStyle: React.CSSProperties = { display: 'flex', gap: 4, alignItems: 'center' }
const actionBtnStyle: React.CSSProperties = {
  padding: '3px 8px', borderRadius: 4, border: '1px solid #ddd',
  background: '#fff', color: '#555', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
}
const deleteBtnStyle: React.CSSProperties = {
  padding: '3px 8px', borderRadius: 4, border: '1px solid #e8c0c0',
  background: '#fff', color: '#d9534f', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
}

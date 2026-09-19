interface ToolbarProps {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  errorMsg: string
  onSave: () => void
  onOpenSidebar: () => void
  onExportPNG: () => void
  onExportSVG: () => void
}

const STATUS_COLORS: Record<string, string> = {
  idle: '#4a90d9', saving: '#f0ad4e', saved: '#5cb85c', error: '#d9534f',
}
const STATUS_LABELS: Record<string, string> = {
  idle: '☁️', saving: '⏳', saved: '✅', error: '❌',
}
const BTN: React.CSSProperties = {
  padding: '4px 12px', borderRadius: 6, border: 'none',
  background: '#2a2a4e', color: '#fff', fontSize: 14,
  cursor: 'pointer', fontFamily: '-apple-system, sans-serif',
}

export function Toolbar({ saveStatus, errorMsg, onSave, onOpenSidebar, onExportPNG, onExportSVG }: ToolbarProps) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '4px 8px', alignItems: 'center', position: 'relative' }}>
      <button onClick={onSave} disabled={saveStatus === 'saving'} title="Save to server" style={{
        ...BTN,
        background: STATUS_COLORS[saveStatus],
        cursor: saveStatus === 'saving' ? 'wait' : 'pointer',
        opacity: saveStatus === 'saving' ? 0.7 : 1,
      }}>
        {STATUS_LABELS[saveStatus]}
      </button>
      <button onClick={onOpenSidebar} title="Load from server" style={BTN}>📂</button>
      <button onClick={onExportPNG} title="Export PNG" style={BTN}>🖼️</button>
      <button onClick={onExportSVG} title="Export SVG" style={BTN}>📐</button>
      {errorMsg && (
        <div style={{
          position: 'absolute', top: '-30px', right: 0,
          background: '#d9534f', color: '#fff', padding: '4px 8px',
          borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap',
          fontFamily: '-apple-system, sans-serif', zIndex: 100,
        }}>{errorMsg}</div>
      )}
    </div>
  )
}

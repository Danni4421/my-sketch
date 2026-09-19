export interface Scene {
  key: string
  type?: string
  name?: string
  savedAt?: string
  elements?: any[]
  appState?: Record<string, unknown>
}

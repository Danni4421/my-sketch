import { API_URL } from '@/shared/config'
import type { Scene } from './scene.model'

export class SceneApi {
  private readonly base = `${API_URL}/api/scenes`

  async fetchAll(): Promise<Scene[]> {
    const res = await fetch(this.base)
    if (!res.ok) return []
    return res.json()
  }

  async fetchOne(key: string): Promise<Scene | null> {
    const res = await fetch(`${this.base}/${encodeURIComponent(key)}`)
    if (!res.ok) return null
    return res.json()
  }

  async save(scene: Scene): Promise<string | null> {
    const res = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scene),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.key ?? null
  }

  async remove(key: string): Promise<boolean> {
    const res = await fetch(`${this.base}/${encodeURIComponent(key)}`, { method: 'DELETE' })
    return res.ok
  }

  async rename(key: string, newName: string): Promise<boolean> {
    const scene = await this.fetchOne(key)
    if (!scene) return false
    scene.name = newName
    const saved = await this.save(scene)
    if (!saved) return false
    return this.remove(key)
  }
}

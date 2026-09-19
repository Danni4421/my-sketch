export class StorageManager {
  private readonly key: string

  constructor(key: string) {
    this.key = key
  }

  load<T>(): T | null {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  save(data: unknown): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(data))
    } catch {}
  }

  clear(): void {
    localStorage.removeItem(this.key)
  }
}

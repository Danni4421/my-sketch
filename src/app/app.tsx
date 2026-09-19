import { AuthProvider } from '@/features/auth'
import { BoardPage } from '@/pages/board'

export function App() {
  return (
    <AuthProvider>
      <BoardPage />
    </AuthProvider>
  )
}

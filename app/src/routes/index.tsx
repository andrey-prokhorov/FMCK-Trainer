import { createFileRoute } from '@tanstack/react-router'
import PositionsQuizPage from '@/components/pages/PositionsQuizPage'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <PositionsQuizPage />
}

import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { EmptyState } from './components/StateViews'
import { PlanetDetailPage } from './pages/PlanetDetailPage'
import { PlanetListPage } from './pages/PlanetListPage'
import { SimulationPage } from './pages/SimulationPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<PlanetListPage />} />
        <Route path="/planets" element={<PlanetListPage />} />
        <Route path="/planets/:routeId" element={<PlanetDetailPage />} />
        <Route path="/simulate" element={<SimulationPage />} />
        <Route
          path="*"
          element={
            <EmptyState title="Lost in space" hint="That route does not exist. Try the catalogue." />
          }
        />
      </Routes>
    </AppShell>
  )
}
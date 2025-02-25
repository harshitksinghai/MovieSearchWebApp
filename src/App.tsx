import { Outlet } from 'react-router-dom'
import './i18n/config.ts'
import ThemeProviderWrapper from './theme/ThemeContext'

function App() {

  return (
    <ThemeProviderWrapper>
      <main>
        <Outlet />
      </main>
    </ThemeProviderWrapper>
  )
}

export default App

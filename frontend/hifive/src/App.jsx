import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Landing from './pages/Landing'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    const { isLoading } = useAuth0()

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen bg-brand-soft">
            <div className="w-10 h-10 border-4 border-brand-mid border-t-brand rounded-full animate-spin-slow" />
        </div>
    )

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                <Route path="/chat/:friendId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
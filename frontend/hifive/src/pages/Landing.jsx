import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Landing() {
    const { loginWithRedirect, isAuthenticated } = useAuth0()
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard')
    }, [isAuthenticated, navigate])

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-brand-soft">
            <Navbar />
            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6">
                <div className="flex items-center gap-2 bg-brand-light border border-brand-mid rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase text-brand mb-8 animate-fade-up">
                    <span className="w-2 h-2 rounded-full bg-brand animate-blink" />
                    Early Access
                </div>
                <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.05] tracking-tight text-gray-900 mb-7 animate-fade-up" style={{animationDelay: '0.1s'}}>
                    Facilitate strengthening<br />
                    <span className="text-brand relative">
                        connections.
                        <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-brand/15 rounded" />
                    </span>
                </h1>
                <p className="text-lg text-gray-500 max-w-md leading-relaxed mb-11 animate-fade-up" style={{animationDelay: '0.2s'}}>
                    Lower the decision barrier to meeting in person.
                </p>
                <div className="flex gap-4 flex-wrap justify-center animate-fade-up" style={{animationDelay: '0.3s'}}>
                    <button className="btn-primary px-9 py-4 text-base" onClick={() => loginWithRedirect()}>
                        Get Early Access 🤚
                    </button>
                    <a href="#how" className="btn-secondary px-9 py-4 text-base">
                        How it works
                    </a>
                </div>

                {/* Stats */}
                <div className="flex gap-16 mt-20 flex-wrap justify-center animate-fade-up" style={{animationDelay: '0.4s'}}>
                    {[
                        { val: '10m', label: 'Proximity radius' },
                        { val: '3×', label: 'HiFives to connect' },
                        { val: '0', label: 'Follower counts' },
                        { val: 'AI', label: 'Icebreakers' },
                    ].map(s => (
                        <div key={s.label} className="flex flex-col items-center gap-1">
                            <span className="font-display font-black text-3xl text-brand">{s.val}</span>
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">{s.label}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
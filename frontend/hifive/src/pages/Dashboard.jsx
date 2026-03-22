import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function Dashboard() {
    const { user, getAccessTokenSilently } = useAuth0()
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadProfile() {
            try {
                const token = await getAccessTokenSilently()
                const res = await fetch(`${API_URL}/api/user/profile/${encodeURIComponent(user.sub)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.status === 404) { navigate('/setup'); return }
                const data = await res.json()
                setProfile(data.user)
            } catch (err) {
                console.error(err)
            }
        }
        loadProfile()
    }, [])

    const cards = [
        { icon: '👥', title: 'Friends & Suggestions', sub: 'See who you\'ve crossed paths with', to: '/friends' },
        { icon: '📍', title: 'Proximity', sub: 'HiFive people nearby', to: '/dashboard' },
        { icon: '💬', title: 'Messages', sub: 'Chat with your connections', to: '/friends' },
        { icon: '✨', title: 'AI Icebreakers', sub: 'Never start cold', to: '/friends' },
    ]

    return (
        <div className="min-h-screen bg-brand-soft font-sans">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-10 animate-fade-up">
                    <h1 className="font-display font-black text-4xl text-gray-900 mb-2">
                        Hey {profile?.first_name || user?.given_name} 🤚
                    </h1>
                    <p className="text-gray-400">Ready to make some connections?</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    {cards.map((c, i) => (
                        <Link
                            key={c.title}
                            to={c.to}
                            className="card p-8 no-underline block hover:-translate-y-1 transition-transform duration-200 animate-fade-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <span className="text-4xl block mb-4">{c.icon}</span>
                            <h3 className="font-display font-bold text-lg text-gray-900 mb-1">{c.title}</h3>
                            <p className="text-sm text-gray-400">{c.sub}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
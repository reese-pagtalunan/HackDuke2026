import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function Friends() {
    const { user, getAccessTokenSilently } = useAuth0()
    const [friends, setFriends]         = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [requested, setRequested]     = useState(new Set())

    useEffect(() => {
        async function load() {
            try {
                const token = await getAccessTokenSilently()
                console.log('token:', token ? 'YES' : 'NO')
                const res = await fetch(`${API_URL}/api/friends/${encodeURIComponent(user.sub)}/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                console.log('friends status:', res.status)
                const data = await res.json()
                console.log('friends data:', data)
                setFriends(data.friends || [])
                setSuggestions(data.suggestions || [])
            } catch (err) { console.error('friends error:', err) }
        }
        load()
    }, [])

    const sendRequest = async (addresseeId) => {
        try {
            const token = await getAccessTokenSilently()
            await fetch(`${API_URL}/api/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ requesterId: user.sub, addresseeId })
            })
            setRequested(prev => new Set([...prev, addresseeId]))
        } catch (err) { console.error(err) }
    }

    return (
        <div className="min-h-screen bg-brand-soft font-sans">
            <Navbar />
            <main className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="font-display font-black text-4xl text-gray-900 mb-10 animate-fade-up">Friends</h1>

                {suggestions.length > 0 && (
                    <div className="mb-10 animate-fade-up">
                        <h2 className="font-display font-bold text-lg text-gray-700 mb-4">
                            People you've crossed paths with 👋
                        </h2>
                        <div className="flex flex-col gap-3">
                            {suggestions.map(s => (
                                <div key={s.id} className="card flex items-center justify-between px-6 py-5">
                                    <div>
                                        <p className="font-semibold text-gray-900">{s.first_name} {s.last_name}</p>
                                        <p className="text-sm text-gray-400">Passed each other {s.encounter_count} times</p>
                                    </div>
                                    <button
                                        className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                                        onClick={() => sendRequest(s.id)}
                                        disabled={requested.has(s.id)}
                                    >
                                        {requested.has(s.id) ? 'Sent ✓' : 'HiFive 🤚'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {friends.length > 0 && (
                    <div className="animate-fade-up">
                        <h2 className="font-display font-bold text-lg text-gray-700 mb-4">Your connections</h2>
                        <div className="flex flex-col gap-3">
                            {friends.map(f => (
                                <div key={f.id} className="card flex items-center justify-between px-6 py-5">
                                    <p className="font-semibold text-gray-900">{f.first_name} {f.last_name}</p>
                                        <Link to={`/chat/${encodeURIComponent(f.auth0_id)}`} className="btn-primary px-5 py-2.5 text-sm no-underline">
                                            Message 💬
                                        </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {friends.length === 0 && suggestions.length === 0 && (
                    <div className="card p-12 text-center animate-fade-up">
                        <span className="text-5xl block mb-4">🤚</span>
                        <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No connections yet</h3>
                        <p className="text-gray-400">Get out there and HiFive someone!</p>
                    </div>
                )}
            </main>
        </div>
    )
}
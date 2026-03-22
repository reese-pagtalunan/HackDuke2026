import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function Friends() {
    const { user, getAccessTokenSilently } = useAuth0()
    const [friends, setFriends]         = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [requests, setRequests]       = useState([])
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
                setRequests(data.requests || [])
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

    const acceptRequest = async (requesterAuth0Id) => {
        try {
            const token = await getAccessTokenSilently()
            await fetch(`${API_URL}/api/friends/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ requesterId: requesterAuth0Id, addresseeId: user.sub })
            })
            const acceptedUser = requests.find(r => r.auth0_id === requesterAuth0Id)
            setRequests(prev => prev.filter(r => r.auth0_id !== requesterAuth0Id))
            if (acceptedUser) setFriends(prev => [...prev, acceptedUser])
        } catch (err) { console.error('Accept error:', err) }
    }

    const declineRequest = async (requesterAuth0Id) => {
        try {
            const token = await getAccessTokenSilently()
            await fetch(`${API_URL}/api/friends/decline`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ requesterId: requesterAuth0Id, addresseeId: user.sub })
            })
            setRequests(prev => prev.filter(r => r.auth0_id !== requesterAuth0Id))
        } catch (err) { console.error('Decline error:', err) }
    }

    const [activeTab, setActiveTab] = useState('friends')

    return (
        <div className="w-full">
            <div className="flex bg-white border border-brand/10 md:rounded-t-2xl shadow-sm border-b-0 overflow-hidden">
                <div 
                    className={`flex-1 text-center py-3 text-[0.85rem] cursor-pointer transition-colors border-b-2 select-none ${activeTab === 'friends' ? 'text-navy font-bold border-navy bg-brand-soft/50' : 'text-gray-500 font-medium border-transparent hover:text-gray-800'}`} 
                    onClick={() => setActiveTab('friends')}
                >
                    Friends
                </div>
                <div 
                    className={`flex-1 text-center py-3 text-[0.85rem] cursor-pointer transition-colors border-b-2 select-none ${activeTab === 'requests' ? 'text-navy font-bold border-navy bg-brand-soft/50' : 'text-gray-500 font-medium border-transparent hover:text-gray-800'}`} 
                    onClick={() => setActiveTab('requests')}
                >
                    Requests
                </div>
                <div 
                    className={`flex-1 text-center py-3 text-[0.85rem] cursor-pointer transition-colors border-b-2 select-none ${activeTab === 'search' ? 'text-navy font-bold border-navy bg-brand-soft/50' : 'text-gray-500 font-medium border-transparent hover:text-gray-800'}`} 
                    onClick={() => setActiveTab('search')}
                >
                    Search
                </div>
            </div>

            <div className="bg-white border border-brand/10 md:rounded-b-2xl shadow-sm min-h-[400px] p-6 relative">
                {activeTab === 'friends' && (
                    <div className="animate-fade-up">
                        <h2 className="font-display font-bold text-lg text-gray-700 mb-4">Your connections</h2>
                        {friends.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {friends.map(f => (
                                    <div key={f.id} className="card flex items-center justify-between px-6 py-5 border border-brand/5 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold uppercase">
                                                {f.first_name?.[0] || ''}{f.last_name?.[0] || ''}
                                            </div>
                                            <p className="font-semibold text-gray-900">{f.first_name} {f.last_name}</p>
                                        </div>
                                        <Link to={`/chat/${encodeURIComponent(f.auth0_id)}`} className="btn-primary px-5 py-2.5 text-sm no-underline">
                                            Message 💬
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <span className="text-4xl block mb-3">🤚</span>
                                <p className="text-gray-400">No connections yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="animate-fade-up">
                        <h2 className="font-display font-bold text-lg text-gray-700 mb-4">Pending Requests</h2>
                        {requests.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {requests.map(r => (
                                    <div key={r.id} className="card flex items-center justify-between px-6 py-5 border border-brand/5 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold uppercase">
                                                {r.first_name?.[0] || ''}{r.last_name?.[0] || ''}
                                            </div>
                                            <p className="font-semibold text-gray-900">{r.first_name} {r.last_name}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn-secondary px-4 py-2 text-sm" onClick={() => declineRequest(r.auth0_id)}>Decline</button>
                                            <button className="btn-primary px-4 py-2 text-sm shadow-md" onClick={() => acceptRequest(r.auth0_id)}>Accept 🤚</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <span className="text-4xl block mb-3 opacity-50">⏳</span>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">No pending requests</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'search' && (
                    <div className="animate-fade-up">
                        <h2 className="font-display font-bold text-lg text-gray-700 mb-4">Search & Suggestions 👋</h2>
                        {suggestions.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {suggestions.map(s => (
                                    <div key={s.id} className="card flex items-center justify-between px-6 py-5 border border-brand/5 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold uppercase">
                                                {s.first_name?.[0] || ''}{s.last_name?.[0] || ''}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{s.first_name} {s.last_name}</p>
                                                <p className="text-xs text-gray-400">Passed each other {s.encounter_count} times</p>
                                            </div>
                                        </div>
                                        <button
                                            className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                                            onClick={() => sendRequest(s.auth0_id)}
                                            disabled={requested.has(s.auth0_id)}
                                        >
                                            {requested.has(s.auth0_id) ? 'Sent ✓' : 'HiFive 🤚'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-400">No suggestions found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
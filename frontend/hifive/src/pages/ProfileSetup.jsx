import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function ProfileSetup() {
    const { user, getAccessTokenSilently } = useAuth0()
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState(user?.given_name || '')
    const [lastName, setLastName]   = useState(user?.family_name || '')
    const [interests, setInterests] = useState('')
    const [loading, setLoading]     = useState(false)
    const [error, setError]         = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstName || !lastName || !interests) return
        setLoading(true)
        setError('')
        try {
            const token = await getAccessTokenSilently()
            const res = await fetch(`${API_URL}/api/user/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    auth0_id: user.sub,
                    first_name: firstName,
                    last_name: lastName,
                    interests
                })
            })
            if (!res.ok) throw new Error('Failed to save')
            navigate('/dashboard')
        } catch (err) {
            setError('Failed to save profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-brand-soft font-sans">
            <nav className="flex items-center justify-between px-12 py-5 bg-white border-b border-brand/8">
                <span className="font-display font-black text-xl text-gray-900">Hi<span className="text-brand">Five</span> 🤚</span>
                <span className="text-sm text-gray-400">Step 1 of 2 — Profile setup</span>
            </nav>
            <div className="h-0.5 bg-brand-light">
                <div className="h-full bg-brand w-1/2 rounded-r transition-all duration-500" />
            </div>
            <main className="flex items-center justify-center p-12">
                <div className="card p-14 max-w-lg w-full animate-fade-up">
                    <span className="inline-flex items-center gap-2 bg-brand-light border border-brand-mid rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-brand mb-5">
                        👋 Welcome to HiFive
                    </span>
                    <h1 className="font-display font-black text-3xl text-gray-900 mb-2">
                        Tell us about <span className="text-brand">yourself.</span>
                    </h1>
                    <p className="text-sm text-gray-400 leading-relaxed mb-9">
                        This helps us find people with things in common. Your profile stays private until you connect.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">First name</label>
                                <input className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Last name</label>
                                <input className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Chen" required />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-5">
                            <label className="text-xs font-semibold text-gray-700">Your interests</label>
                            <textarea
                                className="input-field h-32 resize-none"
                                value={interests}
                                onChange={e => setInterests(e.target.value)}
                                placeholder="I love hiking, indie music, photography, trying new coffee shops..."
                                required
                            />
                            <span className="text-xs text-gray-400">Write freely — the more specific, the better your AI icebreakers will be.</span>
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button className="btn-primary w-full py-4 text-base" type="submit" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                                    Saving...
                                </span>
                            ) : 'Save profile 🤚'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
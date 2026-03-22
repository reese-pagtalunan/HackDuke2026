import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function ProfileSetup() {
    const { user, getAccessTokenSilently } = useAuth0()
    const [firstName, setFirstName] = useState(user?.given_name || '')
    const [lastName, setLastName]   = useState(user?.family_name || '')
    const [interests, setInterests] = useState('')
    const [loading, setLoading]     = useState(false)
    const [error, setError]         = useState('')

    const [successMsg, setSuccessMsg] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!firstName || !lastName || !interests) return
        setLoading(true)
        setError('')
        setSuccessMsg('')
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
            setSuccessMsg('Profile updated successfully! ✨')
            setTimeout(() => setSuccessMsg(''), 4000)
        } catch {
            setError('Failed to save profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full flex items-center justify-center">
            <div className="card p-8 md:p-14 max-w-lg w-full animate-fade-up bg-white border border-brand/10 shadow-sm md:rounded-2xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-brand-light to-brand-mid flex items-center justify-center text-brand font-display font-bold text-3xl mb-4">
                        {firstName?.[0] || ''}{lastName?.[0] || ''}
                    </div>
                <h1 className="font-display font-black text-2xl text-gray-900">
                    Your <span className="text-brand">Profile</span>
                </h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-gray-500">First name</label>
                            <input className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Alex" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold tracking-wider uppercase text-gray-500">Last name</label>
                            <input className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Chen" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-xs font-bold tracking-wider uppercase text-gray-500">Your interests</label>
                        <textarea
                            className="input-field h-32 resize-none"
                            value={interests}
                            onChange={e => setInterests(e.target.value)}
                            placeholder="I love hiking, indie music..."
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {successMsg && <p className="text-green-600 font-bold text-sm mb-4 text-center animate-fade-up">{successMsg}</p>}
                    <button className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wide" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Update profile'}
                    </button>
                </form>
            </div>
        </div>
    )
}
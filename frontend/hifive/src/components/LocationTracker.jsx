import { useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'
const PING_INTERVAL_MS = 30_000 // send location every 30 seconds

export default function LocationTracker() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
    const intervalRef = useRef(null)
    const [denied, setDenied] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || !user) return

        async function sendPing() {
            if (!navigator.geolocation) return

            navigator.geolocation.getCurrentPosition(
                async ({ coords }) => {
                    try {
                        const token = await getAccessTokenSilently()
                        await fetch(`${API_URL}/api/location/ping`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                auth0Id: user.sub,
                                lat: coords.latitude,
                                lng: coords.longitude,
                            }),
                        })
                    } catch (err) {
                        console.warn('Location ping failed:', err)
                    }
                },
                (err) => {
                    if (err.code === err.PERMISSION_DENIED) {
                        setDenied(true)
                        clearInterval(intervalRef.current)
                    }
                },
                { timeout: 8000, maximumAge: 20000 }
            )
        }

        // Fire immediately, then on interval
        sendPing()
        intervalRef.current = setInterval(sendPing, PING_INTERVAL_MS)

        return () => clearInterval(intervalRef.current)
    }, [isAuthenticated, user])

    if (denied) {
        return (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-semibold px-4 py-2 rounded-full shadow-md animate-fade-up">
                📍 Location access denied — proximity suggestions won't work
            </div>
        )
    }

    return null
}

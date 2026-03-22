import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function Chat() {
    const { user, getAccessTokenSilently } = useAuth0()
    const { friendId }              = useParams()
    const [messages, setMessages]   = useState([])
    const [input, setInput]         = useState('')
    const [icebreaker, setIcebreaker] = useState('')
    const socketRef                 = useRef(null)
    const bottomRef                 = useRef(null)

    useEffect(() => {
        socketRef.current = io(API_URL, {
            transports: ['websocket']
        })
        socketRef.current.on('connect', () => {
            console.log('Socket connected, identifying as:', user.sub)
            socketRef.current.emit('identify', user.sub)
        })
        socketRef.current.on('receive_message', msg => {
            setMessages(prev => [...prev, msg])
        })
        return () => socketRef.current.disconnect()
    }, [])

    useEffect(() => {
        async function loadHistory() {
            try {
                const token = await getAccessTokenSilently()

                // Load message history
                const res = await fetch(
                    `${API_URL}/api/messages/${encodeURIComponent(user.sub)}/${encodeURIComponent(friendId)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = await res.json()
                const history = data.messages.map(m => ({
                    senderId: m.sender_id,
                    content: m.content,
                    createdAt: m.created_at
                }))
                setMessages(history)

                // Load icebreaker only if no messages yet
                if (history.length === 0) {
                    const iceRes = await fetch(
                        `${API_URL}/api/icebreaker/${encodeURIComponent(user.sub)}/${encodeURIComponent(friendId)}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    const iceData = await iceRes.json()
                    setIcebreaker(iceData.question)
                }

            } catch (err) {
                console.error('History load error:', err)
            }
        }
        loadHistory()
    }, [friendId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        socketRef.current.emit('send_message', {
            senderId: user.sub,
            recipientId: friendId,
            content: input
        })
        setMessages(prev => [...prev, { senderId: user.sub, content: input, createdAt: new Date() }])
        setIcebreaker('') // hide icebreaker once conversation starts
        setInput('')
    }

    return (
        <div className="min-h-screen bg-brand-soft font-sans flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-6 flex flex-col">
                <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto min-h-[400px]">

                    {/* Icebreaker card — shows only when no messages yet */}
                    {icebreaker && messages.length === 0 && (
                        <div className="card p-6 text-center border-brand/20 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">
                                ✨ AI Icebreaker
                            </span>
                            <p className="text-gray-700 font-medium">{icebreaker}</p>
                            <p className="text-xs text-gray-400 mt-2">Use this to break the ice!</p>
                        </div>
                    )}

                    {messages.length === 0 && !icebreaker && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-4xl block mb-3">💬</span>
                                <p className="text-gray-400 text-sm">Start the conversation!</p>
                            </div>
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.senderId === user.sub ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-3 rounded-2xl max-w-xs text-sm ${
                                m.senderId === user.sub
                                    ? 'bg-brand text-white'
                                    : 'bg-white border border-brand/10 text-gray-800'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className="flex gap-3">
                    <input
                        className="input-field flex-1"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Say something..."
                    />
                    <button className="btn-primary px-6 py-3 text-sm" onClick={sendMessage}>
                        Send 🤚
                    </button>
                </div>
            </main>
        </div>
    )
}
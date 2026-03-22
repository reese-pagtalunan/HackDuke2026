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
            <div className="flex-1 flex items-center justify-center p-3 sm:p-4 pt-[80px] md:pt-[110px] pb-5 sm:pb-10">
                <main className="card flex flex-col w-full max-w-2xl h-[calc(100dvh-100px)] md:h-[75vh] md:min-h-[500px] md:max-h-[800px] bg-white border border-brand/10 shadow-xl rounded-[24px] md:rounded-[32px] overflow-hidden">
                    {/* Header could go here, but Navbar handles global back/nav */}
                    
                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto p-6 md:p-8 bg-brand-soft/30">
                        {/* Icebreaker card — shows only when no messages yet */}
                        {icebreaker && messages.length === 0 && (
                            <div className="bg-brand-light/40 rounded-2xl p-6 text-center border border-brand/20 mb-2">
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
                                    <span className="text-4xl block mb-3 opacity-50">💬</span>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Start the conversation</p>
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.senderId === user.sub ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-xs text-[0.95rem] shadow-sm ${
                                    m.senderId === user.sub
                                        ? 'bg-brand text-white rounded-br-sm'
                                        : 'bg-white border border-brand/10 text-gray-800 rounded-bl-sm'
                                }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-4 md:p-6 bg-white border-t border-brand/5">
                        <div className="flex gap-3">
                            <input
                                className="input-field flex-1 !rounded-full !bg-brand-soft/50"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Say something..."
                            />
                            <button className="btn-primary px-6 py-3 text-sm font-bold tracking-wide shadow-md" onClick={sendMessage}>
                                Send 🤚
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
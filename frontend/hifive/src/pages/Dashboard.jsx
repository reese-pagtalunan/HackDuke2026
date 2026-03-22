import { useState } from 'react'
import Navbar from '../components/Navbar'
import Friends from './Friends'
import ProfileSetup from './ProfileSetup'

const API_URL = import.meta.env.VITE_API_URL || 'https://hifiveapp-7y7nb.ondigitalocean.app'

export default function Dashboard() {
    const [activeMainTab, setActiveMainTab] = useState('friends')

    return (
        <div className="min-h-screen bg-brand-soft font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:py-8 pt-[86px] md:pt-[110px] pb-24 md:pb-28 w-full relative">
                <div className={`transition-opacity duration-300 w-full ${activeMainTab === 'friends' ? 'block animate-fade-up' : 'hidden'}`}>
                     <Friends />
                </div>
                <div className={`transition-opacity duration-300 w-full ${activeMainTab === 'profile' ? 'block animate-fade-up' : 'hidden'}`}>
                     <ProfileSetup />
                </div>
            </main>

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-brand flex items-center justify-around py-2.5 pb-2 z-50 md:rounded-t-[28px] shadow-[0_-8px_30px_rgba(26,86,255,0.25)] safe-area-pb">
                <div 
                    className={`flex flex-col items-center gap-1.5 cursor-pointer transition-opacity duration-200 ${activeMainTab === 'friends' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                    onClick={() => setActiveMainTab('friends')}
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[2] [stroke-linecap:round] [stroke-linejoin:round]">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                    <span className="text-[0.65rem] font-bold tracking-[0.5px] text-white/90 uppercase">Friends</span>
                </div>
                <div 
                    className={`flex flex-col items-center gap-1.5 cursor-pointer transition-opacity duration-200 ${activeMainTab === 'profile' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                    onClick={() => setActiveMainTab('profile')}
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[2] [stroke-linecap:round] [stroke-linejoin:round]">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="text-[0.65rem] font-bold tracking-[0.5px] text-white/90 uppercase">Profile</span>
                </div>
            </nav>
        </div>
    )
}
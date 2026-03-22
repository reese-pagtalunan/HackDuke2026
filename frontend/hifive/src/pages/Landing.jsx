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
        <div className="min-h-screen bg-[#FAFBFF] text-[#1A1F36] overflow-x-hidden font-sans">
            <Navbar />
            
            {/* HERO */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[120px] pb-[80px] overflow-hidden bg-gradient-to-b from-white to-brand-soft">
                {/* Background glows */}
                <div className="absolute w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(26,86,255,0.08)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse-slow"></div>
                <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(26,86,255,0.05)_0%,transparent_70%)] top-[30%] left-[70%] animate-pulse-reverse"></div>
                
                <div className="inline-flex items-center gap-2 bg-brand-light border border-brand-mid rounded-full px-[18px] py-2 text-[0.78rem] font-semibold tracking-[1px] uppercase text-brand mb-8 animate-fade-up">
                    <span className="w-[7px] h-[7px] rounded-full bg-brand animate-blink" />
                    Early Access
                </div>
                
                <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-2px] relative mb-7 text-gray-900 animate-fade-up" style={{animationDelay: '0.1s'}}>
                    Facilitate strengthening<br />
                    <em className="not-italic text-brand relative inline-block">
                        connections.
                        <div className="absolute bottom-[2px] left-0 right-0 h-[6px] bg-brand opacity-15 rounded-[4px]" />
                    </em>
                </h1>
                
                <p className="text-[clamp(1rem,2.2vw,1.15rem)] text-gray-500 max-w-[460px] leading-[1.7] mb-11 animate-fade-up" style={{animationDelay: '0.2s'}}>
                    Lower the decision barrier to meeting in person.
                </p>
                
                <div className="flex gap-[14px] flex-wrap justify-center relative animate-fade-up" style={{animationDelay: '0.3s'}}>
                    <button className="bg-brand text-white font-display font-bold text-base px-9 py-4 rounded-full border-none cursor-pointer transition-all tracking-[0.2px] hover:bg-brand-accent hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(26,86,255,0.25)]" onClick={() => loginWithRedirect()}>
                        Get Early Access 🤚
                    </button>
                    <a href="#how" className="bg-white text-gray-900 border border-brand/20 font-display font-semibold text-base px-9 py-4 rounded-full no-underline transition-all hover:bg-brand-light hover:-translate-y-[2px]">
                        How it works
                    </a>
                </div>
                
                <div className="absolute bottom-8 flex flex-col items-center gap-2 text-gray-500 text-[0.75rem] tracking-[0.8px] uppercase">
                    <span>Scroll</span>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-brand-mid to-transparent animate-scroll-down" />
                </div>
            </section>

            {/* STATS BAR */}
            <div className="bg-white border-y border-brand/5 py-7 px-12 flex justify-center gap-20 flex-wrap relative z-10">
                {[
                    { val: '1-to-1', label: 'Private Connections' },
                    { val: '100%', label: 'Mutual Opt-in' },
                    { val: '0', label: 'Follower counts' },
                    { val: 'AI', label: 'Icebreakers' },
                ].map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                        <span className="font-display font-extrabold text-[1.8rem] text-brand">{s.val}</span>
                        <span className="text-[0.78rem] text-gray-500 font-medium uppercase tracking-[0.8px]">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* HOW IT WORKS */}
            <section id="how" className="bg-[#FAFBFF] py-[100px] px-6">
                <div className="max-w-[1100px] mx-auto">
                    <div className="animate-fade-up">
                        <div className="inline-block text-[0.72rem] font-bold tracking-[2px] uppercase text-brand bg-brand-light border border-brand-mid px-[14px] py-[5px] rounded-full mb-5">How it works</div>
                        <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-1px] mb-4 text-gray-900">Two paths to IRL.</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
                        <div className="bg-white border border-brand/10 rounded-[24px] p-10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(26,86,255,0.08)] group">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand rounded-t-[24px]" />
                            <span className="text-[2.2rem] block mb-[18px]">🤝</span>
                            <div className="text-[0.7rem] font-bold tracking-[2px] uppercase mb-2 text-brand">Small Net</div>
                            <h3 className="font-display text-[1.5rem] font-extrabold mb-6 tracking-[-0.5px] text-gray-900">Add someone you know</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    <span key="1">Send a <strong>friend request</strong></span>,
                                    <span key="2"><strong>Mutual opt-in</strong> required</span>,
                                    <span key="3"><strong>AI icebreaker</strong> from shared interests</span>,
                                    <span key="4"><strong>Shared hobbies</strong> revealed</span>,
                                    <span key="5">Chat ends → <strong>meet IRL</strong></span>
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-display text-[0.72rem] font-extrabold shrink-0 mt-[1px] bg-brand-light text-brand">{i+1}</div>
                                        <div className="text-[0.88rem] text-gray-500 leading-[1.5]">{text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-brand/10 rounded-[24px] p-10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(26,86,255,0.08)] group">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-accent rounded-t-[24px]" />
                            <span className="text-[2.2rem] block mb-[18px]">🔍</span>
                            <div className="text-[0.7rem] font-bold tracking-[2px] uppercase mb-2 text-brand">Global Search</div>
                            <h3 className="font-display text-[1.5rem] font-extrabold mb-6 tracking-[-0.5px] text-gray-900">Find new connections</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    <span key="1"><strong>Search</strong> for users by name</span>,
                                    <span key="2">Send a <strong>friend request</strong></span>,
                                    <span key="3"><strong>Mutual opt-in</strong> required to interact</span>,
                                    <span key="4"><strong>AI icebreaker</strong> kicks off the chat</span>,
                                    <span key="5">Same flow → <strong>meet IRL</strong></span>
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-display text-[0.72rem] font-extrabold shrink-0 mt-[1px] bg-brand-light text-brand">{i+1}</div>
                                        <div className="text-[0.88rem] text-gray-500 leading-[1.5]">{text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONNECTION TYPES */}
            <section id="nets" className="bg-white py-[100px] px-6">
                <div className="max-w-[1100px] mx-auto">
                    <div className="animate-fade-up">
                        <div className="inline-block text-[0.72rem] font-bold tracking-[2px] uppercase text-brand bg-brand-light border border-brand-mid px-[14px] py-[5px] rounded-full mb-5">Connection types</div>
                        <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-1px] mb-4 text-gray-900">Small net or large net.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
                        <div className="bg-brand-light border border-brand-mid rounded-[24px] p-10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                            <span className="text-[2.6rem] block mb-[18px]">🎯</span>
                            <div className="text-[0.78rem] font-semibold uppercase tracking-[1px] mb-5 text-brand/70">Intentional</div>
                            <h3 className="font-display text-[1.4rem] font-extrabold mb-2 tracking-[-0.5px] text-brand">Small Net</h3>
                            <ul className="list-none flex flex-col gap-2.5 m-0 p-0 text-gray-600">
                                {['Mutual friend request', 'Private until matched', 'AI-generated icebreaker', 'Casual "Hi!" ping', 'Conversations close, not scroll'].map(item => (
                                    <li key={item} className="flex items-center gap-2.5 text-[0.88rem]">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] font-bold shrink-0 bg-brand/10 text-brand">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-brand-soft to-brand-light border border-brand-mid rounded-[24px] p-10 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                            <span className="text-[2.6rem] block mb-[18px]">🌐</span>
                            <div className="text-[0.78rem] font-semibold uppercase tracking-[1px] mb-5 text-gray-500">Discover</div>
                            <h3 className="font-display text-[1.4rem] font-extrabold mb-2 tracking-[-0.5px] text-brand">Global Search</h3>
                            <ul className="list-none flex flex-col gap-2.5 m-0 p-0 text-gray-600">
                                {['Search across the platform', 'Connect with new people', 'Mutual friend requests to unlock', 'Instant AI context generation', 'Same chat + IRL nudge'].map(item => (
                                    <li key={item} className="flex items-center gap-2.5 text-[0.88rem]">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] font-bold shrink-0 bg-brand/10 text-brand">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRINCIPLES */}
            <section id="principles" className="bg-[#FAFBFF] py-[100px] px-6">
                <div className="max-w-[1100px] mx-auto">
                    <div className="animate-fade-up">
                        <div className="inline-block text-[0.72rem] font-bold tracking-[2px] uppercase text-brand bg-brand-light border border-brand-mid px-[14px] py-[5px] rounded-full mb-5">Why HiFive</div>
                        <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-1px] mb-4 text-gray-900">Built different. On purpose.</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-14">
                        {[
                            { icon: '🔒', title: 'Private by default', desc: 'Profiles hidden until mutual connection.' },
                            { icon: '🚫', title: 'Zero follower counts', desc: 'Not a popularity contest.' },
                            { icon: '🤖', title: 'AI icebreakers', desc: 'First message is never cold.' },
                            { icon: '🔚', title: 'Conversations end', desc: 'Chats close. You meet up.' },
                            { icon: '🔍', title: 'Search & Connect', desc: 'Find friends easily by username.' },
                            { icon: '🤝', title: 'Mutual opt-in', desc: 'Both sides agree. Always.' }
                        ].map(p => (
                            <div key={p.title} className="bg-white border border-brand/10 rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(26,86,255,0.06)]">
                                <span className="text-[1.8rem] mb-[14px] block">{p.icon}</span>
                                <h4 className="font-display text-[1rem] font-bold mb-2 tracking-[-0.3px] text-gray-900">{p.title}</h4>
                                <p className="text-gray-500 text-[0.84rem] leading-[1.6]">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI ICEBREAKER DEMO */}
            <section className="bg-white py-[100px] px-6">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15 items-center">
                    <div className="animate-fade-up">
                        <div className="inline-block text-[0.72rem] font-bold tracking-[2px] uppercase text-brand bg-brand-light border border-brand-mid px-[14px] py-[5px] rounded-full mb-5">AI Icebreaker</div>
                        <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-1px] mb-4 text-gray-900">Never a cold &quot;hey.&quot;</h2>
                        <p className="text-gray-500 text-[1rem] leading-[1.7] max-w-[460px]">Claude generates a personalized question from your shared interests.</p>
                    </div>
                    
                    <div className="flex flex-col gap-3.5 animate-fade-up">
                        <div className="bg-brand-light border border-brand-mid rounded-[18px] px-[22px] py-[18px] text-[0.78rem] uppercase tracking-[0.8px] font-semibold text-brand self-center text-center">
                            ✨ 3 shared interests found
                        </div>
                        <div className="bg-brand-light border border-brand/15 rounded-[18px] px-[22px] py-[18px] text-[0.9rem] leading-[1.6] text-gray-900 self-start max-w-[90%]">
                            <strong className="block text-[0.72rem] tracking-[1px] uppercase text-brand mb-1.5">🤖 HiFive AI</strong>
                            You both love indie music and hiking — if you could only pick one trail soundtrack, what&apos;s the song?
                        </div>
                        <div className="bg-brand-soft border border-brand/10 rounded-[18px] px-[22px] py-[18px] text-[0.9rem] leading-[1.6] text-gray-600 self-end italic max-w-[90%]">
                            Phoebe Bridgers — Motion Sickness. Built for sunrise hikes 🌄
                        </div>
                        <div className="bg-gradient-to-br from-brand-light to-brand-soft border border-brand-mid rounded-[18px] px-[22px] py-[18px] text-[0.9rem] leading-[1.6] text-gray-900 self-center text-center mt-2">
                            <strong className="block font-display text-[1rem] font-extrabold text-brand mb-1.5">You&apos;re hitting it off 🤚</strong>
                            Time to take it offline.<br />
                            <span className="inline-block animate-bounce-soft">↓</span> <span className="text-brand font-semibold">Meet up</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="join" className="bg-[#FAFBFF] py-[100px] px-6 text-center">
                <div className="max-w-[640px] mx-auto bg-white border border-brand/10 rounded-[32px] px-8 py-16 relative overflow-hidden shadow-[0_16px_48px_rgba(26,86,255,0.06)] animate-fade-up">
                    <div className="absolute text-[160px] opacity-[0.04] -top-5 -right-5 -rotate-[15deg] pointer-events-none">🤚</div>
                    <div className="inline-block text-[0.72rem] font-bold tracking-[2px] uppercase text-brand bg-brand-light border border-brand-mid px-[14px] py-[5px] rounded-full mb-5 relative z-10">Join HiFive</div>
                    <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-1px] mb-3 text-gray-900 relative z-10">Ready to meet people?</h2>
                    <p className="text-gray-500 text-[0.95rem] leading-[1.7] mb-8 relative z-10">Create an account and start making real connections.</p>
                    <div className="flex justify-center gap-3 flex-wrap relative z-10">
                        <button className="bg-brand text-white font-display font-bold text-base px-9 py-4 rounded-full border-none cursor-pointer transition-all hover:bg-brand-accent hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(26,86,255,0.25)]" onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>
                            Sign up free 🤚
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-brand/5 py-10 px-12 flex items-center justify-between flex-wrap gap-4">
                <div className="font-display font-extrabold text-[1.1rem] text-gray-900">
                    Hi<span className="text-brand">Five</span> 🤚
                </div>
                <div className="text-gray-500 text-[0.82rem]">
                    © 2026 HiFive. The best connections happen face to face.
                </div>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-500 hover:text-gray-900 text-[0.82rem] no-underline transition-colors">Privacy</a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 text-[0.82rem] no-underline transition-colors">Terms</a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 text-[0.82rem] no-underline transition-colors">Contact</a>
                </div>
            </footer>
        </div>
    )
}
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

    return (
        <nav className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-5 md:px-12 py-4 md:py-[18px] bg-brand-soft/85 backdrop-blur-xl border-b border-brand/10">
            <Link to="/" className="font-display font-black text-[1.4rem] tracking-tight text-gray-900 no-underline">
                Hi<span className="text-brand">Five</span> 🤚
            </Link>
            
            <ul className="hidden md:flex gap-8 list-none m-0 p-0">
                <li><a href="/#how" className="text-gray-500 hover:text-gray-900 text-[0.9rem] font-medium transition-colors no-underline">How it works</a></li>
                <li><a href="/#nets" className="text-gray-500 hover:text-gray-900 text-[0.9rem] font-medium transition-colors no-underline">Connection types</a></li>
                <li><a href="/#principles" className="text-gray-500 hover:text-gray-900 text-[0.9rem] font-medium transition-colors no-underline">Why HiFive</a></li>
            </ul>

            <div className="flex items-center gap-2 md:gap-4">
                {isAuthenticated ? (
                    <>
                        <div className="hidden sm:flex items-center gap-3">
                            {user?.picture && (
                                <img src={user.picture} alt="avatar" className="w-[34px] h-[34px] rounded-full border-2 border-brand-mid object-cover" />
                            )}
                            <span className="text-[0.88rem] font-semibold text-gray-900">{user?.given_name || user?.name}</span>
                        </div>
                        <Link to="/dashboard" className="text-[0.82rem] font-bold text-brand hover:text-brand-accent transition-colors no-underline mx-1 md:mx-2">Dashboard</Link>
                        <button
                            className="text-[0.82rem] text-gray-400 hover:text-brand transition-colors bg-transparent border-none cursor-pointer font-sans"
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } })}
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <button className="bg-brand text-white font-display font-bold text-[0.85rem] px-[22px] py-[10px] rounded-full border-none cursor-pointer transition-all duration-200 tracking-wide hover:bg-brand-accent hover:scale-105" onClick={() => loginWithRedirect()}>
                        Log in
                    </button>
                )}
            </div>
        </nav>
    )
}
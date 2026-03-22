import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

    return (
        <nav className="flex items-center justify-between px-12 py-5 bg-white border-b border-brand/8 sticky top-0 z-50 backdrop-blur-sm">
            <Link to="/" className="font-display font-black text-xl text-gray-900 no-underline">
                Hi<span className="text-brand">Five</span> 🤚
            </Link>
            <div className="flex items-center gap-6">
                {isAuthenticated ? (
                    <>
                        {user?.picture && (
                            <img src={user.picture} alt="avatar" className="w-8 h-8 rounded-full border-2 border-brand-mid" />
                        )}
                        <span className="text-sm font-semibold text-gray-800">{user?.given_name || user?.name}</span>
                        <Link to="/friends" className="text-sm text-gray-500 hover:text-gray-800 transition-colors no-underline">Friends</Link>
                        <button
                            className="text-sm text-gray-400 hover:text-brand transition-colors bg-none border-none cursor-pointer font-sans"
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } })}
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <button className="btn-primary px-6 py-2.5 text-sm" onClick={() => loginWithRedirect()}>
                        Log in
                    </button>
                )}
            </div>
        </nav>
    )
}
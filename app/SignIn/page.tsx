"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function SignInPage() {
    //* get session state
    const { data: session } = useSession()
    
    //* state for loading
    const [isLoading, setIsLoading] = useState(false)

    if (session) {
        redirect("/")
    }

    //* functions
    const handleAuth = async () => {
        setIsLoading(true)
        try {
            if (session) {
                await signOut()
            } else {
                await signIn("google", { prompt: 'select_account',callbackUrl:"/", })
            }
        } catch (error) {
            console.error("Authentication error:", error)
        } finally {
            setIsLoading(false)
        }
    }
    
    //* ui tree 
    return (
        <section className="flex items-center justify-center flex-col min-h-screen gap-12 bg-gradient-to-b to-gray-100 p-4">
            {/* Image container with animation */}
            <div className="w-fill max-w-md transition-transform duration-300 hover:scale-105  sm:overflow-auto md:overflow-clip">
                <Image
                    width={500}
                height={500}    
                    src='log_in.svg' 
                    className="w-full h-auto" 
                    alt='Login illustration'
                    loading="eager"
                />
            </div>

            {/* Welcome message */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {session ? 'Welcome back!' : 'Welcome to Our Platform'}
                </h1>
            </div>

            {/* Button with loading state */}
            <button
                onClick={handleAuth}
                disabled={isLoading}
                className={`
                    flex items-center justify-center gap-2
                    bg-black hover:bg-gray-800 
                    rounded-lg text-white text-lg px-6 py-3
                    transition-all duration-200 
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}
                `}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : (
                    <span>{session ? "Log out" : "Log In with Google"}</span>
                )}
            </button>

            {/* Optional status message for signed out state */}
            {!session && (
                <p className="text-sm text-gray-600 text-center">
                    Click to sign in securely with your Google account
                </p>
            )}
        </section>
    )
}
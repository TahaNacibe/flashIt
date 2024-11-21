"use client"

import { signIn, signOut, useSession } from "next-auth/react"


export default function HomePage() {

    //* get season state
    const { data: session } = useSession()

    //* functions
    const handleAuth = () => {
        if (session) {
            signOut()
        } else {
            signIn("google",{ prompt: 'select_account' })
        }
    }
    
    //* ui tree 
    return (
        <section className=" flex items-center justify-center justify-items-center">
            <button
                onClick={() => handleAuth()}
                className="bg-black rounded-lg text-white text-lg px-4 py-3">
                {session? "Log out" : "Log In"}
            </button>
        </section>
    )
}
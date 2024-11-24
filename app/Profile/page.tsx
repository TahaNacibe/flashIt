"use client"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Folder, WalletCards, ThumbsUp, CreditCard } from "lucide-react"
import CardsWidget from "@/components/profile/cards_widget"
import CollectionsWidget from "@/components/widgets/collections_widget"
import LoadingSpinner from "@/components/animation/loading"
import SectionButtonWidget from "@/components/widgets/sections_buttons"
import SignInPage from "../SignIn/page"

export default function ProfilePage() {
    //* vars 
    const [activeSection, setActiveSection] = useState("Cards")
    const { data: session } = useSession()

    //* check session state 
    const isSessionLoading = () => {
        if (session) {
            return true
        } else {
            return false
        }
    }

    //* loading widget 
    const LoadingWidget = () => {
        return <LoadingSpinner />
    }


    //* section buttons widget 
    const SectionButton = ({ name, icon }: { name: string, icon: any }) => {
        return <SectionButtonWidget name={name} icon={icon} isActive={activeSection === name} onClick={() => setActiveSection(name)}  />
    }

    //* if session don't exist 
    if (!session) {
        return <SignInPage />
    }

    return (
        <section className="w-auto h-screen mx-6 my-4">
            {/* Profile Section */}
            <div className="w-full h-1/3 rounded-lg shadow-xl">
                {/* Background cover */}
                <div className="w-full h-full bg-blue-600 rounded-2xl relative">
                    {/* Profile Widget */}
                    <div className="h-28 -bottom-16 absolute m-6 flex w-full">
                        <div className="rounded-full ring-8 ring-white dark:ring-background w-28 h-28">
                            <img src={session?.user.image} alt='' className="rounded-full w-28 h-28" />
                        </div>
                        <div className="pl-2">
                            <h1 className="text-white font-medium text-xl">
                                {session?.user.name}
                            </h1>
                            <h3 className="text-white font-medium text-base rounded-xl bg-blue-700 px-2 py-1 ml-2">
                                {session?.user.email}
                            </h3>
                        </div>
                        <div className="right-8 bottom-12 absolute rounded-full px-2 py-1 flex gap-2 text-white">
                            <CreditCard size={20} /> {(session?.user.flash_cards??[]).length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section for the data of the user */}
            <div className="w-full flex gap-4 pt-16 pl-2">
                <SectionButton name={"Cards"} icon={<WalletCards size={18} />} />
                <SectionButton name={"Collections"} icon={<Folder size={18} />} />
            </div>

            {/* Show active section */}
            {
                !isSessionLoading()
                    ? (<LoadingWidget />)
                    : (activeSection === "Cards"
                        ? <CardsWidget userId={session?.user.id!} />
                        : <CollectionsWidget userId={session?.user.id!} collectionsIds={session?.user.user_collections ?? []} />)
            }
        </section>
    )
}

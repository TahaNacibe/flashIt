import connectToDataBase from "@/lib/connect_to_db";
import CollectionItem from "@/schema/collection";
import FlashCard from "@/schema/flash_card";
import profile from "@/schema/profile";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        await connectToDataBase()
        const totalCards = await FlashCard.countDocuments();
        const totalProfiles = await profile.countDocuments()
        const totalCollections = await CollectionItem.countDocuments()
        return NextResponse.json({message:"statics response", totalCards:totalCards,totalUsers: totalProfiles, totalCollections:totalCollections})
    } catch (error) {
        return NextResponse.json({error:"something went wrong getting statics"})
    }
}
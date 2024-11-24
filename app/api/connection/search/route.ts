import CollectionItem from "@/schema/collection";
import FlashCard from "@/schema/flash_card";
import { error } from "console";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



// Helper function for error handling
const handleError = (error: unknown, message: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: message, details: errorMessage },
      { status: 500 }
    );
};
  

const connectToDataBase = async () => {
      //* check if connection already exist
      if (mongoose.connections[0].readyState) {
        return;
    }

    //* connect if no connection exist 
    try {
        //* if connected print connected
        await mongoose.connect(process.env.MONGODB_URI!)
    } catch (error) {
        //* else throw an error 
        console.error("Error connecting to database:", error);
        handleError(error,"Failed to connect to mongo db")
    }
}



const GET = async (req: NextRequest) => {
    try {
        await connectToDataBase()
        //* get search query 
        const {searchParams} = new URL(req.url)
        const searchQuery = searchParams.get("searchQuery")

        if (!searchQuery) {
            return;
        }
        //* get the search result for cards and collections
        const searchResultCards = await FlashCard.find({ title:  { $regex: searchQuery, $options: "i" } }, null, { sort: { "updatedAt": -1 } })
        const searchResultCollections = await CollectionItem.find({ title:  { $regex: searchQuery, $options: "i" } }, null, { sort: { "updatedAt": -1 } })
        return NextResponse.json({message:"search result fetched : ",cardResult:searchResultCards, collectionsResult:searchResultCollections})

    } catch (error) {
        handleError(error, "error cached on search")
    }
}

export {GET}
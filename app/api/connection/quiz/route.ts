import FlashCard from "@/schema/flash_card";
import User from "@/schema/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server"

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



//* PUT: request to update an existing ranking
const PUT = async (req: NextRequest) => {
    try {
      await connectToDataBase();
  
      //* manage the request
      const { userId, numberOfCorrectAnswers, clearTimeInSeconds, cardId } = await req.json();
  
      if (!cardId || !numberOfCorrectAnswers || !userId || !clearTimeInSeconds) {
        return NextResponse.json({ error: "Some fields are missing" });
      }
  
  
      // First attempt to update an existing entry in the rankingBoard array
      const response = await FlashCard.findOneAndUpdate(
        { _id: cardId, "rankingBoard.userId": userId }, // Look for existing userId
        {
          $set: {
            "rankingBoard.$.numberOfCorrectAnswers": numberOfCorrectAnswers,
            "rankingBoard.$.clearTimeInSeconds": clearTimeInSeconds,
          },
        },
        { new: true, upsert: false } // Only update if a match is found
      );
  
      if (response) {
        // If found, return the updated record
        return NextResponse.json({ message: "Record updated!", card: response });
      }
  
      // If no record was found (response is null), we need to add a new ranking entry
      const newRankingResponse = await FlashCard.findByIdAndUpdate(
        cardId,
        {
          $push: {
            rankingBoard: {
              userId,
              numberOfCorrectAnswers,
              clearTimeInSeconds,
            },
          },
        },
        { new: true } // Return the updated document
      );
  
      return NextResponse.json({ message: "New record added to card!", card: newRankingResponse });
    } catch (error) {
      console.error("Error in PUT request:", error);
      return NextResponse.json({ error: "Something went wrong" });
    }
  };
  

//* GET: get the card with ranking or just relative cards 
const GET = async (req: NextRequest) => {
    try {
        await connectToDataBase()

        //* manage the request
        const { searchParams } = new URL(req.url);
        const idPram = searchParams.get("cardId")
        const difficulty = searchParams.get("difficulty")
        const language = searchParams.get("language")


        if (!idPram ) {
            return NextResponse.json({error: "card id is missing"})
        }

        if (difficulty && language) {
            const response = await FlashCard.find({ selectedLanguage: language, selectedDifficulty: difficulty }).limit(3)
        return NextResponse.json({message: "record was cards from card!", cards:response})
        }


        const response = await FlashCard.findById(idPram).populate({
            path: "rankingBoard.userId",
            model:User
        });
        return NextResponse.json({message: "record was received from card!", record:response})
    } catch (error:any) {
        return NextResponse.json({
            error: "Something went wrong!",
            details: error.message || "Unknown error",
        });
    }
}

export {PUT,GET}
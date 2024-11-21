import FlashCard from "@/schema/flash_card";
import profile from "@/schema/profile";
import { error } from "console";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// Helper function for error handling
const handleError = (error: unknown, message: string) => {
    console.error(`${message}:`, error);
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


//* POST to create the item 
const POST = async (req: NextRequest) => {
    await connectToDataBase()
    //* create a new flash card
    try {
        //* get the card data
        const { title, description, selectedLanguage, selectedDifficulty, questions, ownerId } = await req.json();
        //* create the card
        const newFlashCard = new FlashCard({
        title,
        description,
        selectedLanguage,
        selectedDifficulty,
        questions,
      });

        await newFlashCard.save();


        // add the card to user list
        const updateProfile = await profile.findOneAndUpdate({userId: ownerId}, {
            $addToSet : {"flash_cards":newFlashCard._id}
        })

        // Return a success response
      return NextResponse.json({ message: "Card created successfully", card: newFlashCard });
    } catch (error) {
        console.error("Error creating flashcard:", error);
       return NextResponse.json({ error: "Error creating flashcard" });

    }

}

//* get to get the items or specific item by id or ids, mostly ids i guess
const GET = async (req: NextRequest) => {
    try {
        // Connect to database
        await connectToDataBase();

        // Get ids from query parameters
        const { searchParams } = new URL(req.url);
        const idsParam = searchParams.get('ids');

        // Parse ids if provided
        const ids = idsParam ? idsParam.split(',') : null;
        // const idArray = Object.values(ids)
        // Fetch cards
        let response;
        if (ids && ids.length > 0) {
            // Fetch specific cards by IDs
            response = await FlashCard.find({ 
                _id: { $in: ids } 
            }).sort({ updatedAt: 1 });
            return NextResponse.json({
                message: "Specific cards were fetched",
                response
            });
        }

        // Fetch all cards
        response = await FlashCard.find({}).sort({ updatedAt: 1 });
        
        return NextResponse.json({
            message: "All cards were fetched",
            response
        });

    } catch (error) {
        console.error("Error fetching cards:", error);
        
        return NextResponse.json(
            { 
                error: "Something went wrong fetching cards", 
                details: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}

const DELETE = async (req: NextRequest) => {
    try {
        await connectToDataBase()

        const { searchParams } = new URL(req.url)
        const flashCardId = searchParams.get("flashCardId")
        const ownerId = searchParams.get("ownerId")

        if (!flashCardId || !ownerId) {
            return NextResponse.json({
                error: "Specific cards wasn't found",
            });
        }

        const response = await FlashCard.findByIdAndDelete(flashCardId)
         // remove the card from the user list
         const updateProfile = await profile.findOneAndUpdate({userId: ownerId}, {
            $pull : {"flash_cards":flashCardId}
        })
        return NextResponse.json({
            message: "Flash card deleted",
            response
        });
    } catch (error) {
        return NextResponse.json({
            error: "Something went wrong here ",
        });
    }
}


const PUT = async (req: NextRequest) => {
    try {
        await connectToDataBase()

        //* manage the request
        const { searchParams } = new URL(req.url)
        // get the target id
        const cardId = searchParams.get("cardId")
        
        if (!cardId) {
            return NextResponse.json({error: "Couldn't find the flash card"})
        }
        //* get the card data
        const { title, description, selectedLanguage, selectedDifficulty, questions } = await req.json();

        const response = await FlashCard.findByIdAndUpdate(cardId, {
            title, description, selectedLanguage, selectedDifficulty, questions
        },{ new: true })
        return NextResponse.json({message: "flash card updated!", card:response})
    } catch (error) {
        return NextResponse.json({error: "something wrong happen!"})
    }
}

export {POST, GET, DELETE, PUT}
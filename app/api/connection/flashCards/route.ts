import connectToDataBase from "@/lib/connect_to_db";
import FlashCard from "@/schema/flash_card";
import profile from "@/schema/profile";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";



//* POST: request to create the item 
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

//* GET: request to get the items or specific item by id or ids, mostly ids i guess
const GET = async (req: NextRequest) => {
    try {
        // Connect to database
        await connectToDataBase();

        // Get ids from query parameters
        const { searchParams } = new URL(req.url);
        const idsParam = searchParams.get('ids');
        const idPram = searchParams.get("cardId")

        // Parse ids if provided
        const ids = idsParam ? idsParam.split(',').filter(id => mongoose.Types.ObjectId.isValid(id)) : null;
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

        //* fetch a single card 
        if (idPram && mongoose.Types.ObjectId.isValid(idPram)) {
            response = await FlashCard.findById(idPram)
            return NextResponse.json(
                {
                    message: "card fetched ",
                    card: response
                }
            )
        }

        // Fetch all cards if no id was sent
        if (!idPram && !ids) {
            response = await FlashCard.find({}).sort({ updatedAt: 1 });
            
            return NextResponse.json({
                message: "All cards were fetched",
                response
            });
            
        }

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


//* DELETE: request to delete an card from db and remove it's id from it's user 
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


//* PUT: request to update an existing item
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
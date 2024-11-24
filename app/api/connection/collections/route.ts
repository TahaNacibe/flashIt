import CollectionItem from "@/schema/collection";
import profile from "@/schema/profile";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//* some functions to short the work
const handleError = (error: unknown, message: string) => {
// Helper function for error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: message, details: errorMessage },
      { status: 500 }
    );
};
  

//* start a connection to db in case it doesn't exist 
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



//* POST: request to create a new collection
const POST = async (req: NextRequest) => {
   try {
     //* connect to the mongoose db
     await connectToDataBase()

     //* get the data from the request 
     const { title, colorKey, ownerId, description } = await req.json()
     
     const newCollectionFolder = new CollectionItem({
         title,colorKey,description
     })
 
     await newCollectionFolder.save()
 
     // add the collection id to the user list
     const updateProfile = await profile.findOneAndUpdate({userId: ownerId}, {
         $addToSet : {"user_collections":newCollectionFolder._id}
     })
 
      // Return a success response
      return NextResponse.json({ message: "Collection was created successfully", card: newCollectionFolder });
   } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ error: "Error creating collections" });
   }
}


//* GET: request to get collections 
const GET = async (req: NextRequest) => {
    try {
        //* connect 
        await connectToDataBase()

        //* get the user id
        const { searchParams } = new URL(req.url)
        const idsParam = searchParams.get("ids")
        // Parse ids if provided
        const ids = idsParam ? idsParam.split(',') : null; 

        //* if id wasn't received get all items (first 12 here)
        if (!ids) {
            const allCollections = await CollectionItem.find().sort({ createdAt: -1 }) // Sort by createdAt 
            .limit(12)
            return NextResponse.json({ message: "all collections was received successfully", collections: allCollections });
        }


        const userCollections = await CollectionItem.find({ _id: { $in: ids } }, null, { sort: { "updatedAt": 1 } }).populate("collection_cards")
        // Return a success response
        return NextResponse.json({ message: "Collection was received successfully", collections: userCollections });
    } catch (error) {
        console.error("Error getting collection:", error);
    return NextResponse.json({ error: "Error getting collections" });
    }
}


//*DELETE: delete a collection of the data base and remove the id from it's owner 
const DELETE = async (req: NextRequest) => {
    try {
        //* connect 
        await connectToDataBase()

        //* get the user id
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const ownerId = searchParams.get("ownerId")
        // Parse ids if provided

        //* if id wasn't received throw error
        if (!id || !ownerId) {
            console.error("Error deleting collection: id or owner id doesn't exist");
            return NextResponse.json({ error: "Error deleting collections" });
        }
        const deletedCollection = await CollectionItem.findByIdAndDelete(id)
        //* delete the collection from the user data
        const userDataUpdate = await profile.findOneAndUpdate({ userId: ownerId }, {
            $pull : {"user_collections":id}
        })

        // Return a success response
        return NextResponse.json({ message: "Collection was deleted successfully", collections: deletedCollection });
    } catch (error) {
        console.error("Error deleting collection:", error);
    return NextResponse.json({ error: "Error deleting collections" });
    }
}


//*PUT: update an existing collection 
const PUT = async (req: NextRequest) => {
    try {
        //* connect 
        await connectToDataBase()

        //* get the user id
        const {title, colorKey,description, collection_cards} = await req.json()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        // Parse ids if provided

        //* if id wasn't received throw error
        if (!id) {
            console.error("Error editing collection: id doesn't exist");
            return NextResponse.json({ error: "Error editing collections" });
        }
        const editedCollection = await CollectionItem.findByIdAndUpdate(id, {
            title,colorKey,description,collection_cards
        },{ new: true })

        // Return a success response
        return NextResponse.json({ message: "Collection was edited successfully", collection: editedCollection });
    } catch (error) {
        console.error("Error edited collection:", error);
    return NextResponse.json({ error: "Error edited collections" });
    }
}


export {POST,GET,DELETE,PUT}
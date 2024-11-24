import connectToDataBase from "@/lib/connect_to_db";
import FlashCard from "@/schema/flash_card";
import { NextRequest, NextResponse } from "next/server";

//* PUT: request to update an existing item
const PUT = async (req: NextRequest) => {
  try {
    await connectToDataBase();

    //* get the card data
    const { userId, cardId } = await req.json();

    if (!cardId || !userId) {
      return NextResponse.json({ error: "Couldn't find the flash card" });
    }

    //* Find the card and update it
    const flashCard = await FlashCard.findById(cardId);

    if (!flashCard) {
      return NextResponse.json({ error: "Flash card not found" });
    }

      let updatedUpVotes;
    if (flashCard.up_Votes.includes(userId)) {
      //* Remove the userId if it exists
      updatedUpVotes = flashCard.up_Votes.filter((id: string) => id !== userId);
    } else {
      //* Add the userId if it does not exist
      updatedUpVotes = [...flashCard.up_Votes, userId];
    }

    //* Update the card in the database
    flashCard.up_Votes = updatedUpVotes;
    await flashCard.save();

    return NextResponse.json({
      message: "Flash card updated!",
      card: flashCard,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" });
  }
};

export {PUT};

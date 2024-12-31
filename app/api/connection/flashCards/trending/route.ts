import connectToDataBase from "@/lib/connect_to_db";
import FlashCard from "@/schema/flash_card";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDataBase();

    // Fetch flashcards sorted by up_Votes and limited to 12 results
    const flashCards = await FlashCard.aggregate([
      {
        $addFields: {
          upVotesCount: { $size: { $ifNull: ["$up_Votes", []] } }, // Handle missing up_Votes field
        },
      },
      {
        $sort: { upVotesCount: -1 }, // Sort by the length of the array in descending order
      },
      {
        $limit: 12, // Limit the number of results
      },
    ]);
    
    // Return the response with flashcards
    return NextResponse.json({ flashCards });
  } catch (error) {
    console.error("Error fetching flash cards:", error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}

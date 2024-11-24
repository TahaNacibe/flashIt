import connectToDataBase from "@/lib/connect_to_db";
import FlashCard from "@/schema/flash_card";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    //* Connect to DB
    await connectToDataBase();

    //* Get data using aggregation
    const flashCards = await FlashCard.aggregate([
      {
        $addFields: {
          averageScore: {
            $avg: "$rankingBoard.numberOfCorrectAnswers", // Calculate average score
          },
        },
      },
      { $sort: { averageScore: -1 } }, // Sort by averageScore in descending order
      { $limit: 12 }, // Limit the result to 12 documents
    ]);

    //* Return response
    return NextResponse.json({ flashCards });
  } catch (error) {
    console.error("Error fetching flash cards:", error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}

import connectToDataBase from "@/lib/connect_to_db"
import FlashCard from "@/schema/flash_card"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //* Connect to DB
    await connectToDataBase();

    //* Get data
    const flashCards = await FlashCard.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt 
      .limit(12); // Limit to 12 documents

    //* Return response
    return NextResponse.json({ flashCards });
  } catch (error) {
    console.error("Error fetching flash cards:", error);
    return NextResponse.json({ error: "Something went wrong" });
  }
}

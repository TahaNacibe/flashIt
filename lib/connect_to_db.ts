import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

// Helper function for error handling
const handleError = (error: unknown, message: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: message, details: errorMessage },
      { status: 500 }
    );
};
  

export default connectToDataBase
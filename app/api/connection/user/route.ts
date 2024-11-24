import connectToDataBase from "@/lib/connect_to_db"
import User from "@/schema/user"
import { NextRequest, NextResponse } from "next/server"



const PUT = async (req: NextRequest) => {
    try {
        await connectToDataBase()
        //* get user id
        const {userId, userName, pfp} = await req.json()

        if (!userId) {
            return NextResponse.json({error:"no user is signed in"})
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name:userName, image:pfp
        },{new:true})
        return NextResponse.json({message:"user details updated! ",updatedUser})
    } catch (error) {
        return NextResponse.json({error: "something went wrong editing user details"})
    }
}

export {PUT}
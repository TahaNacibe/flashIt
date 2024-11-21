import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import client from "../db";
import Profile from "@/schema/profile";
require("@/schema/flash_card")

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  adapter: MongoDBAdapter(client),

  callbacks: {
    async session({ session, user }) {
      try {
        // Ensure MongoClient is connected
        if (!mongoose.connection.readyState) {
          await mongoose.connect(process.env.MONGODB_URI!, {
          });
        }

        // Fetch the profile associated with the user
        const profile = await Profile.findOne({ userId: user.id }).populate("flash_cards");

        if (profile) {
          session.user.id = profile.userId
          session.user.flash_cards = profile.flash_cards;
          session.user.up_votes_count = profile.up_votes_count;
          session.user.saved_flash_cards = profile.saved_flash_cards;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }

      return session;
    },
  },

  events: {
    async createUser(message) {
      try {
        // Ensure MongoClient is connected
        if (!mongoose.connection.readyState) {
          await mongoose.connect(process.env.MONGODB_URI!, {
          });
        }

        // Create a corresponding profile entry
        await Profile.create({
          userId: message.user.id,
          flash_cards: [],
          up_votes_count: 0,
          saved_flash_cards: [],
        });

      } catch (error) {
        console.error("Error creating profile:", error);
      }
    },
  },
};
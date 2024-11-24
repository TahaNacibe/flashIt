import 'next-auth'
import { DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
      user: {
        id: string
        name?: string
        email?: string
        image?: string
        flash_cards?: string[]
        up_votes_count?: string[]
        saved_flash_cards?: string[]
        user_collections?:string[]
      }
    }
  }
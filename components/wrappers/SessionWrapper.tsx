'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';


//* costume provider so we can use it on the layout file
export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
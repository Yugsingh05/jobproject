'use client'

import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from 'next/navigation'


export default function Home() {

  const router = useRouter();

  const {user} = useAuthStore();

  if(!user?.email){
    router.push('/login')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold underline">
        Welcome  {user?.displayName ? user?.displayName : user?.email} to the app
      </h1>
    </main>
    
  );
} 

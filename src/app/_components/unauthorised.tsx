'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      {/* Optional illustration */}
   

      <h1 className="text-5xl font-bold text-destructive mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2 text-foreground">
        Unauthorized Access
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        You don’t have permission to view this page.  
        Please check your account role or return to a valid section.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => router.push('/')} className="bg-primary text-primary-foreground">
          Go to Login
        </Button>
      </div>
    </div>
  )
}

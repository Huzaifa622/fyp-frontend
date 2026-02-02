"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLogoutMutation } from "@/services/auth"

const PendingPage = () => {
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Profile Pending Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Your profile is currently under review by the admin.
            <br />
            You’ll be notified once it’s approved.
          </p>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default PendingPage

import React from 'react'

export default function DoctorsList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Doctors</h1>
        <p className="text-muted-foreground">View and manage all verified doctors</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center text-muted-foreground py-12">
          No doctors registered yet
        </div>
      </div>
    </div>
  )
}

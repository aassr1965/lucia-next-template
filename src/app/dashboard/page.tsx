import SignOutButton from '@/components/SignOutButton'
import { getUser } from '@/lib/lucia'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardPage = async() => {
  const user =await getUser()
  if(!user) {
    redirect('/authenticate')
  }
  return (
    <>
    <div>Vous êtes connecté en tant que : {user.name}, votre email est {user.email}</div>
    <SignOutButton>Sign out</SignOutButton>
    </>
  )
}

export default DashboardPage
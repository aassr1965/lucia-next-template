import TabSwitcher from '@/components/TabSwitcher'
import React from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { getUser } from '@/lib/lucia'
import { redirect } from 'next/navigation'

const AuthenticatePage = async () => {
  const user = await getUser()
  if(user) {
    redirect('/dashboard')
  }
  return (
    <div className='flex w-full h-screen bg-background'>
      <div className="max-w-3xl mx-auto py-10 ">
       <TabSwitcher SignInTab={<SignInForm/>} SignUpTab={<SignUpForm/>}/>
      </div>
    </div>
  )
}

export default AuthenticatePage
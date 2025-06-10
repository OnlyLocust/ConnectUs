import React from 'react'
import AuthHeader from './AuthHeader'

const AuthPageWrapper = ({children}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <AuthHeader/>
        {children}

        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SocialConnect. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPageWrapper

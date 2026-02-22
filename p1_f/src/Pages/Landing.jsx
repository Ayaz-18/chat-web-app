import React, { useState } from 'react'
import Signin from './Signin'
import Signup from './Signup'
const Landing = () => {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      {!showSignup ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Signin />
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-500 hover:text-blue-400 font-semibold transition"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Signup />
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => setShowSignup(false)}
                className="text-blue-500 hover:text-blue-400 font-semibold transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing

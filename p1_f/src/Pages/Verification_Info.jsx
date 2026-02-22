import React from 'react'

const Verification_Info = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
  <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-8 shadow-lg">
    
    {/* Title */}
    <h2 className="text-xl font-semibold text-white">
      Check your email
    </h2>

    {/* Divider */}
    <div className="my-4 h-px bg-gray-700" />

    {/* Description */}
    <p className="text-sm text-gray-400 leading-relaxed">
      We’ve sent a verification link to your registered email address.
      Please open the email and click on the link to verify your account.
    </p>

    {/* Button */}
  
    {/* Footer */}
    <p className="mt-4 text-xs text-gray-500 text-center">
      Didn’t receive the email? Check your spam folder.
    </p>
  </div>
</div>

  )
}

export default Verification_Info

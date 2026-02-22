import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  
const API = import.meta.env.VITE_BACKEND_URL;

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setMessage('')
    if (!validate()) return
    setSubmitting(true)

    try {
      const response = await axios.post(
        `${API}/user/signin`,   // ✅ fixed route
        { email, password },
        { withCredentials: true }              // ✅ for cookies
      )

      setMessage('Login successful. Redirecting...')
      // console.log('Sign in success:', response.data)

      // If backend sends token in body (optional support)
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }


      setTimeout(() => navigate('/home'), 500)

    } catch (err) {
      console.error('Sign in error:', err)

      // ✅ Always extract string message safely
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Sign in failed. Please try again.'

      setMessage(String(errorMsg))   // ✅ force string
      setSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md text-gray-100">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-100">Sign in to your account</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-900 text-gray-100 border rounded ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1" role="alert">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-900 text-gray-100 border rounded ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1" role="alert">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-200">
              <input type="checkbox" className="h-4 w-4 mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white py-2 rounded disabled:cursor-not-allowed transition"
          >
            {submitting ? '⏳ Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`} role="status">{message}</p>
        )}
      </div>
    </div>
  )
}

export default Signin

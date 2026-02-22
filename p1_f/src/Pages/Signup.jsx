import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  
const API = import.meta.env.VITE_BACKEND_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form Data:", form);
    const response = await axios.post(`${API}/user/signup`, form);
    const data = response.data;
    console.log("Server Response:", data);

  
    // ✅ redirect after signup
    navigate("/v");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700"
        />

        {/* Profile Pic
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleChange}
          className="w-full mb-4 text-gray-300"
        /> */}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-700"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

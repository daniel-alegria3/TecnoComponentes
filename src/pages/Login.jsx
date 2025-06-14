import { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  GoogleIcon,
  FacebookIcon,
  MicrosoftIcon,
  LinkedInIcon,
} from "../components/CustomBrandIcons";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      // Hash the password before sending (SHA-256)
      const hashedPassword = await hashPassword(formData.password);

      const response = await fetch("http://localhost:5000/api/clients/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: formData.email,
          password: hashedPassword, // Send hashed password instead of plain text
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login fallo");
      }

      if (data.loggedIn) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Un error ocurrio durante login");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to hash passwords (SHA-256)
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  return (
    <div
      className="min-h-screen bg-gray-900 bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1390631668/photo/modern-abstract-purple-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=oFCKLavDgNTrsNmqJcgeYNAjAT60WvRBlM7FRCJDqxs=')",
      }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-white text-2xl font-semibold mb-2 text-center">
          High-Quality Components
        </h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Access your account
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center mb-4 text-sm">
            <a
              href="#"
              className="text-violet-400 hover:underline flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Log In <ArrowRightIcon className="h-5 w-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">Or log in with</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black"
          >
            <GoogleIcon className="h-5 w-5" />
            Google
          </button>
          <button
            type="button"
            className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black"
          >
            <FacebookIcon className="h-5 w-5" />
            Facebook
          </button>
          <button
            type="button"
            className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black"
          >
            <MicrosoftIcon className="h-5 w-5" />
            Microsoft
          </button>
          <button
            type="button"
            className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black"
          >
            <LinkedInIcon className="h-5 w-5" />
            LinkedIn
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?
          <a
            href="/register"
            className="text-violet-400 hover:underline ml-1 flex items-center justify-center"
          >
            Sign up now <ArrowRightIcon className="h-4 w-4 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}

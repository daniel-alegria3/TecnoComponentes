import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
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

export default function RegisterForm() {
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
          Join Us Today
        </h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Create your account to get started
        </p>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">First Name<span className="text-violet-600">*</span></label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Last Name<span className="text-violet-600">*</span></label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">
              Email Address<span className="text-violet-600">*</span>
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Password<span className="text-violet-600">*</span></label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Create a password (min 8 chars)"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                minLength="8"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-1">Confirm Password<span className="text-violet-600">*</span></label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the <a href="#" className="text-violet-400 hover:underline">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition duration-200 flex items-center justify-center mb-4"
          >
            Create Account <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>

          <p className="text-gray-400 text-sm text-center">
            Already have an account? <a href="/login" className="text-violet-400 hover:underline">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}``
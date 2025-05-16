import { 
  EnvelopeIcon,
  LockClosedIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowRightIcon,
} from '@heroicons/react/20/solid';
import { 
  GoogleIcon, 
  FacebookIcon,
  MicrosoftIcon,
  LinkedInIcon,
} from '../components/CustomBrandIcons'; // You'll create this

export default function LoginForm() {
  return (
    <div className="min-h-screen bg-gray-900 bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('https://media.istockphoto.com/id/1390631668/photo/modern-abstract-purple-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=oFCKLavDgNTrsNmqJcgeYNAjAT60WvRBlM7FRCJDqxs=')",
      }}>
      <div className="bg-black bg-opacity-60 p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-white text-2xl font-semibold mb-2 text-center">
          High-Quality Components
        </h2>
        <p className="text-gray-300 text-sm mb-6 text-center">Access your account</p>

        <form>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center mb-4 text-sm">
            <a href="#" className="text-violet-400 hover:underline flex items-center">
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded transition duration-200 flex items-center justify-center"
          >
            Log In <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </form>

        <div className="my-4 text-center text-gray-400">Or log in with</div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black">
            <GoogleIcon className="h-5 w-5" />
            Google
          </button>
          <button className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black">
            <FacebookIcon className="h-5 w-5" />
            Facebook
          </button>
          <button className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black">
            <MicrosoftIcon className="h-5 w-5" />
            Microsoft
          </button>
          <button className="bg-black text-violet-400 py-2 rounded flex items-center justify-center gap-2 hover:bg-white hover:text-black">
            <LinkedInIcon className="h-5 w-5" />
            LinkedIn
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?
          <a href="#" className="text-violet-400 hover:underline ml-1 flex items-center justify-center">
            Sign up now <ArrowRightIcon className="h-4 w-4 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}
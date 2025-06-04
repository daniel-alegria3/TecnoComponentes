import { useState } from 'react';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate password match on blur
    if (name === 'confirmPassword' || name === 'password') {
      validatePasswords();
    }
  };

  const validatePasswords = () => {
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!validatePasswords()) return;
    // console.log('Form submitted:', formData);

    try {
      const res = await fetch(`http://localhost:5000/api/clients/register`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:formData.firstName,
          surname:formData.lastName,
          mail:formData.email,
          password:formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registro de cliente fallo");
      }

      if (data.loggedIn) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || 'Un error ocurrio durante login');
    }
  };

  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password && formData.confirmPassword &&
                          formData.password === formData.confirmPassword;

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

        {error && (
            <div className="mb-4 p-2 bg-red-500 text-white text-sm rounded">
              {error}
            </div>
          ) || (
            <p className="text-gray-300 text-sm mb-6 text-center">
            Create your account to get started
            </p>
          )
        }

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">First Name<span className="text-violet-600">*</span></label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First name"
                  className={`w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Last Name<span className="text-violet-600">*</span></label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Last name"
                  className={`w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-violet-500`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className={`w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-1">Password<span className="text-violet-600">*</span></label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password (min 8 chars)"
                className={`w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
              {formData.password && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isPasswordValid ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              )}
            </div>
            {errors.password ? (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            ) : (
              formData.password && !isPasswordValid && (
                <p className="mt-1 text-sm text-yellow-500">
                  Password must be at least 8 characters
                </p>
              )
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-1">Confirm Password<span className="text-violet-600">*</span></label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className={`w-full pl-10 px-4 py-2 rounded bg-gray-800 text-white border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-violet-500`}
              />
              {formData.confirmPassword && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {doPasswordsMatch ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
            {formData.confirmPassword && !doPasswordsMatch && !errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
            )}
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
}

import { useState } from 'react';
import { signInUser } from '../firebase/firebaseAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {signIn} = useAuth();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await signIn(email, password); // Use signIn from context
      navigate('/admin'); // Adjust the route as necessary
    } catch (error) {
      console.error("Failed to log in: ", error.message);
      // Ideally, display this error to the user in a user-friendly manner
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleLogin} className="space-y-6">
            <div className='text-3xl text-center'>Admin Panel</div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full p-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full p-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

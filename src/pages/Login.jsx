import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { FIRESTORE_DB } from '../firebase.config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Fetch the doctors collection
      const doctorsCollectionRef = collection(FIRESTORE_DB, 'doctors');
      const doctorsSnapshot = await getDocs(doctorsCollectionRef);

      // Loop through the doctors documents to find a match
      let doctorFound = false;
      doctorsSnapshot.forEach((doc) => {
        const doctorData = doc.data();
        
        // Check if the email matches and the password matches the document ID
        if (doctorData.email === email && doc.id === password) {
          doctorFound = true;
          navigate(`/doctor/${doc.id}`); // Navigate to doctor/:id if match is found
        }
      });

      if (!doctorFound) {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while trying to log in.");
      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/blurred-abstract-background-interior-view-looking-out-toward-empty-office-lobby-entrance-doors-glass-curtain-wall-with-frame_1339-6363.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white p-8 shadow-md rounded-lg w-96">
        <h1 className="text-3xl text-[#0143BE] font-bold items-center justify-center mb-3 flex gap-2">
          DocSlot
          <img
            src="https://rukminim2.flixcart.com/image/850/1000/xif0q/wall-decoration/j/s/d/doctor-logo-1-doctor-1-6x5in-doctor-logo-decalbazaar-original-imagpnchqbfc3jf2.jpeg?q=90&crop=false"
            alt=""
            className="w-[50px] h-[50px]"
          />
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Doctor's Dashboard</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

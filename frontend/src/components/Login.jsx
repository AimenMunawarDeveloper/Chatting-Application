import { useState } from "react";

const Login = ({ handleSignUpOrLoginChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [passwordVisibilityButtonText, setPasswordVisibilityButtonText] =
    useState("Show");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordVisibilityChange = (e) => {
    e.preventDefault();
    if (passwordVisibility === "password") {
      setPasswordVisibility("text");
      setPasswordVisibilityButtonText("Hide");
    } else {
      setPasswordVisibility("password");
      setPasswordVisibilityButtonText("Show");
    }
  };

  const handleFormSubmission = () => {};

  return (
    <form
      className="bg-darkPurple w-80 sm:w-96 flex flex-col justify-center items-center rounded-lg p-6 sm:p-10 shadow-lg shadow-white"
      onSubmit={handleFormSubmission}
    >
      <h1 className="text-neonPink text-xl font-semibold">Login</h1>
      <label htmlFor="email" className="w-full mb-3 text-magenta">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border-2 border-violetBlue focus:border-neonPink bg-transparent text-white p-2 rounded-lg outline-none mb-5"
      />
      <label htmlFor="password" className="w-full mb-3 text-magenta">
        Password
      </label>
      <div className="w-full flex items-center gap-1">
        <input
          type={passwordVisibility}
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-2 border-violetBlue p-2 rounded-lg bg-transparent text-white focus:border-neonPink flex-grow outline-none"
        />
        <button
          type="button"
          className="bg-neonPink text-white p-2 rounded-md"
          onClick={handlePasswordVisibilityChange}
        >
          {passwordVisibilityButtonText}
        </button>
      </div>
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-neonPink w-full hover:bg-magenta transition duration-300"
      >
        Login
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-neonPink mt-4 w-full text-center hover:text-magenta transition duration-300"
      >
        Create Account
      </button>
    </form>
  );
};

export default Login;

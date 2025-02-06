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
      className="bg-white w-80 sm:w-96 flex flex-col justify-center items-center rounded-lg p-6 sm:p-10"
      onSubmit={handleFormSubmission}
    >
      <h1 className="text-black text-xl font-semibold">Login</h1>
      <label htmlFor="email" className="w-full mb-5">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border-2 mb-5 border-violet-400 focus:border-violet-500 p-2 rounded-lg"
      />
      <label htmlFor="password" className="w-full mb-5">
        Password
      </label>
      <div className="w-full flex items-baseline gap-1">
        <input
          type={passwordVisibility}
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-2 border-violet-400 mb-5 p-2 rounded-lg focus:border-violet-500 flex-grow"
        />
        <button
          type="button"
          className="bg-violet-600 text-white p-2 rounded-md"
          onClick={handlePasswordVisibilityChange}
        >
          {passwordVisibilityButtonText}
        </button>
      </div>
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-violet-600 w-full"
      >
        Login
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-violet-600 mt-4 w-full text-center"
      >
        Create Account
      </button>
    </form>
  );
};

export default Login;

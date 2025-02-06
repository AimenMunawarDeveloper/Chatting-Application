// HomePage.js
import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const HomePage = () => {
  const [signupOrLogin, setSignupOrLogin] = useState("Login");

  const handleSignUpOrLoginChange = () => {
    setSignupOrLogin((prev) => (prev === "Login" ? "SignUp" : "Login"));
  };

  return (
    <div className="min-h-screen bg-violet-700 flex justify-center items-center min-w-screen p-4 sm:p-8">
      {signupOrLogin === "Login" ? (
        <Login handleSignUpOrLoginChange={handleSignUpOrLoginChange} />
      ) : (
        <SignUp handleSignUpOrLoginChange={handleSignUpOrLoginChange} />
      )}
    </div>
  );
};

export default HomePage;

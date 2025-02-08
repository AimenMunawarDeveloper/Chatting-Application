// HomePage.js
import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import background from "../assets/background.jpg";

const HomePage = () => {
  const [signupOrLogin, setSignupOrLogin] = useState("Login");

  const handleSignUpOrLoginChange = () => {
    setSignupOrLogin((prev) => (prev === "Login" ? "SignUp" : "Login"));
  };
  return (
    <div
      className="min-h-screen min-w-screen flex justify-center items-center p-4 sm:p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {signupOrLogin === "Login" ? (
        <Login handleSignUpOrLoginChange={handleSignUpOrLoginChange} />
      ) : (
        <SignUp handleSignUpOrLoginChange={handleSignUpOrLoginChange} />
      )}
    </div>
  );
};

export default HomePage;

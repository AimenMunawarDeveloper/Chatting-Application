import { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import background from "../assets/background.jpg";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

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

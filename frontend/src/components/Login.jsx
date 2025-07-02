import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const Login = ({ handleSignUpOrLoginChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [passwordVisibilityButtonText, setPasswordVisibilityButtonText] =
    useState("Show");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handlePasswordVisibilityChange = (e) => {
    e.preventDefault();
    setPasswordVisibility((prev) =>
      prev === "password" ? "text" : "password"
    );
    setPasswordVisibilityButtonText((prev) =>
      prev === "Show" ? "Hide" : "Show"
    );
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Please enter both email and password", { theme: "dark" });
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Login Successful! 🎉", { theme: "dark" });

        setTimeout(() => {
          navigate("/chats");
        }, 2000);
      } else {
        if (response.status === 401) {
          toast.error("Invalid email or password", { theme: "dark" });
        } else {
          toast.error(data.message || "Login failed. Please try again!", {
            theme: "dark",
          });
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Something went wrong! Please try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="bg-nearBlack w-80 sm:w-96 flex flex-col justify-center items-center rounded-lg p-6 sm:p-10 shadow-lg shadow-deepMagenta"
      onSubmit={handleFormSubmission}
    >
      <h1 className="text-brightMagenta text-xl font-semibold">Login</h1>
      <label htmlFor="email" className="w-full mb-3 text-deepMagenta">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border-2 border-darkViolet focus:border-brightMagenta bg-transparent text-white p-2 rounded-lg outline-none mb-5"
      />
      <label htmlFor="password" className="w-full mb-3 text-deepMagenta">
        Password
      </label>
      <div className="w-full flex items-center gap-1">
        <input
          type={passwordVisibility}
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-2 border-darkViolet p-2 rounded-lg bg-transparent text-white focus:border-brightMagenta flex-grow outline-none"
        />
        <button
          type="button"
          className="bg-brightMagenta text-white p-2 rounded-md"
          onClick={handlePasswordVisibilityChange}
        >
          {passwordVisibilityButtonText}
        </button>
      </div>
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-brightMagenta w-full hover:bg-deepMagenta transition duration-300"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-brightMagenta mt-4 w-full text-center hover:text-deepMagenta transition duration-300"
      >
        Create Account
      </button>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </form>
  );
};

Login.propTypes = {
  handleSignUpOrLoginChange: PropTypes.func.isRequired,
};

export default Login;

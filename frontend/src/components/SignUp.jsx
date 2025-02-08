import { useState } from "react";

const SignUp = ({ handleSignUpOrLoginChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [passwordVisibilityButtonText, setPasswordVisibilityButtonText] =
    useState("Show");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");

  const handlePasswordVisibilityChange = (e) => {
    e.preventDefault();
    setPasswordVisibility((prev) =>
      prev === "password" ? "text" : "password"
    );
    setPasswordVisibilityButtonText((prev) =>
      prev === "Show" ? "Hide" : "Show"
    );
  };

  const postDetails = (pics) => {
    console.log(pics);
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className="bg-nearBlack w-80 sm:w-96 flex flex-col justify-center items-center rounded-lg p-6 sm:p-10 shadow-lg shadow-deepMagenta"
      onSubmit={handleFormSubmission}
    >
      <h1 className="text-brightMagenta text-xl font-semibold">Sign Up</h1>
      <label htmlFor="name" className="w-full mb-3 text-deepMagenta">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
        className="w-full border-2 border-darkViolet focus:border-brightMagenta bg-transparent text-white p-2 rounded-lg outline-none mb-5"
      />
      <label htmlFor="email" className="w-full mb-3 text-deepMagenta">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
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
      <label htmlFor="picture" className="w-full mb-3 text-deepMagenta">
        Upload Your Picture
      </label>
      <input
        type="file"
        name="picture"
        id="picture"
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
        className="w-full border-2 border-darkViolet focus:border-brightMagenta bg-transparent text-white p-2 rounded-lg outline-none mb-5"
      />
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-brightMagenta w-full hover:bg-deepMagenta transition duration-300"
      >
        Sign Up
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-brightMagenta mt-4 w-full text-center hover:text-deepMagenta transition duration-300"
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default SignUp;

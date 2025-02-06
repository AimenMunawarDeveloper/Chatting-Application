import { useState } from "react";

const SignUp = ({ handleSignUpOrLoginChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [passwordVisibilityButtonText, setPasswordVisibilityButtonText] =
    useState("Show");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
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
  const postDetails = (pics) => {
    console.log(pics);
  };
  const handleFormSubmision = () => {};
  return (
    <form
      className="bg-white w-80 sm:w-96 flex flex-col justify-center items-center rounded-lg p-6 sm:p-10"
      onSubmit={handleFormSubmision}
    >
      <h1 className="text-black text-xl font-semibold">SignUp</h1>
      <label htmlFor="name" className="w-full mb-5">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Your Name"
        className="w-full border-2 mb-5 border-violet-400 focus:border-violet-500 p-2 rounded-lg"
      />
      <label htmlFor="email" className="w-full mb-5">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
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

      <label htmlFor="picture" className="w-full mb-5">
        Upload Your Picture
      </label>
      <input
        type="file"
        name="picture"
        id="picture"
        accept="image/"
        onChange={(e) => postDetails(e.target.files[0])}
        className="w-full border-2 mb-5 border-violet-400 focus:border-violet-500 p-2 rounded-lg"
      />
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-violet-600 w-full"
      >
        SignUp
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-violet-600 mt-4 w-full text-center"
      >
        Already have an account? Login
      </button>
    </form>
  );
};

export default SignUp;

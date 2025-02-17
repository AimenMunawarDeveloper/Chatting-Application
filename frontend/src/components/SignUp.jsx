import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SignUp = ({ handleSignUpOrLoginChange }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [passwordVisibilityButtonText, setPasswordVisibilityButtonText] =
    useState("Show");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [file, setFile] = useState(null);
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
  const postDetails = async (pics) => {
    if (!pics) {
      toast.error("No file selected!", { theme: "dark" });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", pics);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "dxwhmwlqo");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dxwhmwlqo/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        if (data.secure_url) {
          setPic(data.secure_url);
          toast.success("Picture uploaded successfully!", { theme: "dark" });
        } else {
          toast.error("Upload failed. Please try again!", { theme: "dark" });
        }
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error("Upload error. Check console for details.", {
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Invalid file format! Only JPEG and PNG allowed.", {
        theme: "dark",
      });
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    postDetails(selectedFile);
  };
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !pic) {
      toast.error("Please enter all the details", { theme: "dark" });
      setLoading(false);
      return;
    }
    const userData = {
      name,
      email,
      password,
      pic,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (response.ok) {
        toast.success("Registration Successful! 🎉", { theme: "dark" });

        setName("");
        setEmail("");
        setPassword("");
        setPic("");
        setFile(null);
        setPasswordVisibility("password");
        setPasswordVisibilityButtonText("Show");
        document.getElementById("picture").value = "";
        navigate("/chats");
      } else {
        toast.error(data.message || "Registration failed. Try again!", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error:", error);
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
      <h1 className="text-brightMagenta text-xl font-semibold">Sign Up</h1>
      <label htmlFor="name" className="w-full mb-3 text-deepMagenta">
        Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        value={name}
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
        value={email}
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
      <label htmlFor="picture" className="w-full mb-3 text-deepMagenta">
        Upload Your Picture
      </label>
      <input
        type="file"
        name="picture"
        id="picture"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border-2 border-darkViolet focus:border-brightMagenta bg-transparent text-white p-2 rounded-lg outline-none mb-5"
      />
      <button
        type="submit"
        className="text-white p-2 rounded-lg mt-4 bg-brightMagenta w-full hover:bg-deepMagenta transition duration-300"
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
      <button
        type="button"
        onClick={handleSignUpOrLoginChange}
        className="text-brightMagenta mt-4 w-full text-center hover:text-deepMagenta transition duration-300"
      >
        Already have an account? Login
      </button>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </form>
  );
};

export default SignUp;

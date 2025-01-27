const Login = () => {
  return (
    <div className="min-h-screen bg-violet-700 flex justify-center items-center min-w-screen">
      <form className="bg-white w-1/3 flex flex-col justify-center items-center rounded-lg p-10">
        <h1 className="text-black text-xl font-semibold">Login</h1>
        <label htmlFor="email" className="w-full mb-5">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="w-full border-2 mb-5 border-violet-400 focus:border-violet-500 p-1 rounded-lg"
        />
        <label htmlFor="password" className="w-full mb-5">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="w-full border-2 border-violet-400 mb-5 p-1 rounded-lg focus:border-violet-500"
        />
      </form>
    </div>
  );
};

export default Login;

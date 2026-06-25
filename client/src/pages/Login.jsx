import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { setCredentials } from "../redux/features/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      dispatch(setCredentials(data));

      const role = data.user.role;

      if (role === "admin") {
        navigate("/admin");
      }

      else if (role === "responder") {
        navigate("/responder");
      }

      else {
        navigate("/citizen");
      }

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
  <div
    className="
    min-h-screen
    bg-slate-950
    flex
    items-center
    justify-center
    px-4
  "
  >
    <div
      className="
      w-full
      max-w-md
      bg-slate-900
      p-8
      rounded-2xl
      shadow-xl
      border
      border-slate-800
    "
    >
      <h1
        className="
        text-3xl
        font-bold
        text-center
        text-white
        mb-8
      "
      >
        ResQNet Login
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            className="
            block
            text-sm
            text-slate-300
            mb-2
          "
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
            w-full
            px-4
            py-3
            rounded-lg
            bg-slate-800
            border
            border-slate-700
            text-white
            outline-none
            focus:border-blue-500
          "
          />
        </div>

        <div>
          <label
            className="
            block
            text-sm
            text-slate-300
            mb-2
          "
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
            w-full
            px-4
            py-3
            rounded-lg
            bg-slate-800
            border
            border-slate-700
            text-white
            outline-none
            focus:border-blue-500
          "
          />
        </div>

        <button
          type="submit"
          className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          py-3
          rounded-lg
          transition
        "
        >
          Login
        </button>
      </form>

      <p
        className="
        text-center
        text-slate-400
        mt-6
      "
      >
        Emergency Response & Disaster
        Management Platform
      </p>
    </div>
  </div>
);
}

export default Login;
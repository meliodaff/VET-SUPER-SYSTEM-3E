import { useState } from "react";
import "../styles/login.css";
import useLogin from "../api/useLogin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loadingForLogin } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    const response = await login({ email, password });

    console.log(response);
    if (!response.success) {
      alert(response.message);
      return;
    }
    // Add your login logic here
    console.log(document.cookie);
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }

    // Get the 'user' cookie
    const userCookie = getCookie("user");

    // Decode and parse JSON
    const user = JSON.parse(decodeURIComponent(userCookie));

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Now you can access it anywhere in your frontend
    // Example: getting it back
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser);

    if (storedUser.role === "HR") {
      navigate("/dashboard");
    } else if (storedUser.role === "Finance") {
      window.location.href = "http://localhost:3000/finance-dashboard";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <img
        className="login-img"
        src="/images/login-img.jpg"
        alt="Fur-Ever Care Logo"
      />

      <div className="login-bg">
        <div className="login-form">
          <h1 className="title">Fur-Ever Care</h1>
          <p className="subtitle">Welcome Back!</p>

          <form id="form" onSubmit={handleSubmit}>
            <input
              className="email"
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <div className="password">
              <input
                className="password-field"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  className="eye-image"
                  src={
                    showPassword ? "/images/Eye on.svg" : "/images/Eye off.png"
                  }
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
            <a className="forget-link" href="/forgot-password">
              Forget Password?
            </a>
            <button type="submit" className="login-button">
              LOG IN
            </button>
          </form>

          <p className="register">
            Don't have an account?{" "}
            <a className="register-link" href="/register">
              Register
            </a>
          </p>
          <img
            className="heart"
            src="/images/heart.png"
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

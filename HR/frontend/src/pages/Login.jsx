import { useEffect, useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    console.log("rerendering");
  }, [email, password]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add your login logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <img className="login-img" src="/images/login-img.jpg" alt="" />

      <div className="login-bg">
        <div className="login-form">
          <h1 className="title">Fur-Ever Care</h1>
          <p className="subtitle">Welcome Back!</p>

          <form onSubmit={handleSubmit}>
            <input
              className="email"
              type="text"
              name="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password">
              <input
                className="password-field"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-button"
                onClick={togglePasswordVisibility}
              >
                <img
                  className="eye-image"
                  src={
                    showPassword ? "/images/Eye on.svg" : "/images/Eye off.png"
                  }
                  alt={showPassword ? "Hide password" : "Show password"}
                />
              </button>
            </div>
            <a className="forget-link" href="">
              Forget Password?
            </a>
            <button type="submit" className="login-button">
              LOG IN
            </button>
          </form>

          <p className="register">
            Don't have an account?
            <a className="register-link" href="/register">
              Register
            </a>
          </p>
          <img className="heart" src="/images/heart.png" alt="" />
        </div>
      </div>
    </div>
  );
}

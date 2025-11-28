import { useState } from "react";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Patient",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms and Privacy Policy");
      return;
    }
    console.log("Form submitted:", formData);
    alert("Registration successful!");
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <img className="card-image" src="/images/register-img.png" alt="Pet" />
        <h1 className="title">Fur-Ever Care</h1>
        <p className="subtitle">Join our Pet Family</p>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="name-inputs">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>

          <input
            type="email"
            name="email"
            className="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
          />

          <div className="password">
            <input
              className="password-field"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create Password"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                className="eye-image"
                src={
                  showPassword ? "/images/Eye off.png" : "/images/Eye on.svg"
                }
              />
            </button>
          </div>

          <div className="password">
            <input
              className="password-field"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <img
                className="eye-image"
                src={
                  showConfirmPassword
                    ? "/images/Eye off.png"
                    : "/images/Eye on.svg"
                }
              />
            </button>
          </div>

          <div className="terms-and-privacy">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <p className="terms-text">
              I agree to the <a href="#">Terms</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        <p className="login">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

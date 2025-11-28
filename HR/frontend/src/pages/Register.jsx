import { useState } from "react";
import "../styles/Register.css";
export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    <>
      <style>{`
        body{
          background-image: url("../Image/background.png");
          background-color: rgba(201, 228, 255, 1);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          padding: 0;
        }
        h1,p{
          margin: 0;
        }
        .container{
          display: flex;
          flex-direction: column;  
          align-items: center;
          position: relative;     
        }

        .register-img{
          height: 165px;
          border-style: solid;
          border-width: 8px;
          border-color: white;
          border-radius: 100px;
          margin-bottom: -70px;
          z-index: 10
        }

        .register-bg {
          background-image: url("../Image/Rectangle 2397.png");
          background-size: cover;   
          background-repeat: no-repeat;
          width: 409px;               
          height: 500px;              
          color: black;
          font-size: 20px
        }
        .register-form{
          display: flex;
          flex-direction: column;  
          align-items: center;
        }

        .title{
          font-family: "Spline Sans";
          color: rgba(2, 32, 122, 1);
          font-size: 23px;
          margin-top: 75px;
        }

        .subtitle{
          font-family: "Spline Sans";
          font-size: 20px; 
          font-weight: 300;
          margin-top: 5px;
          color: rgba(2, 32, 122, 1);
        }

        .form-container{
          display: flex;
          flex-direction: column;
          margin-top: 20px;
          border-bottom: 1px solid rgba(2, 32, 122, 1.0);
          align-items: center;
        }

        .name-inputs{
          width: 100%;
          display: flex;
          justify-content: space-between;
        }

        .name-inputs input{
          width: 140px;
          height: 33px;
          border-width: 1px;
          border-color: rgba(196, 226, 255, 1);
          border-style: solid;
          border-radius: 30px;
          padding-left: 15px;
          outline: none;
          margin-bottom: 16px;
          font-size: 18px;
          font-family: 'Souliyo Unicode', arial;
        }

        .name-inputs input::placeholder{
          color: rgba(2, 32, 122, 1);
          font-size: 14px;
          font-family: 'Souliyo Unicode', arial;
        }

        .email{
          width: 310px;
          height: 33px;
          border-width: 1px;
          border-color: rgba(196, 226, 255, 1);
          border-style: solid;
          border-radius: 30px;
          padding-left: 15px;
          outline: none;
          margin-bottom: 16px;
          font-size: 18px;
          font-family: 'Souliyo Unicode', arial;
        }
        .email::placeholder{
          color: rgba(2, 32, 122, 1);
          font-size: 14px;
          font-family: 'Souliyo Unicode', arial;
        }

        .password{
          border-width: 1px;
          border-color: rgba(196, 226, 255, 1);
          border-style: solid;
          border-radius: 30px;
          padding-left: 13px;
          width: 314px;
          height: 35px;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .password-field{
          width: 280px;
          height: 30px;
          border: none;
          outline: none;
          font-size: 18px;
          font-family: 'Souliyo Unicode', arial;
        }

        .password-field::placeholder{
          color: rgba(2, 32, 122, 1);
          font-size: 14px;
          font-family: 'Souliyo Unicode', arial;
        }

        .eye-button{
          border: none;
          background-color: white;
          cursor: pointer;
          margin-left: 10px;
          border-radius: 20px;
        }

        .eye-button:hover{
         background-color: rgb(240, 240, 240);
        }

        .eye-image{
          width: 15px;
          height: 15px;
          margin-top: 7px;
        }
        .terms-and-privacy{
          display: flex;
          margin-top: -10px;
          align-items: center;
          margin-left: 10px;
          width: 100%;
        }
        a{
          text-decoration: none;
        }
        input[type="checkbox"]{
          width: 10px; 
          height: 10px; 
        }
        .terms-and-privacy-p{
          font-size: 12px;
          color: rgba(2,32,122,1);
          font-family: 'Souliyo Unicode', arial;
          font-family: Tajawal;
        }

        .terms-link{
          font-weight: bold;
          color: rgba(2,32,122,1);
        }

        .privacy-policy-link{
          font-weight: bold;
          color: rgba(2,32,122,1);
        }

        .register-button{
          width: 220px;
          height: 38px;
          border-radius: 13px;
          border: none;
          background-color: rgba(80, 128, 190, 1);
          color: white;
          font-weight: bold;
          margin-bottom: 14px;
          cursor: pointer;
          margin-top: 18px;
        }
        .login{
          font-size: 13px;
          color: rgba(2, 32, 122, 1.0);
          font-weight: 300;
          margin-top: 10px;
          margin-bottom: 10px;
          font-family: Tajawal;
        }
        .login-link{
          color: rgba(2, 32, 122, 1.0);
          font-weight: bold;
          font-family: 'Tharlon' , arial;
        }
        .heart{
          width: 16px;
          opacity: 0.6;
        }
      `}</style>

      <div className="container">
        <img className="register-img" src="/images/register-img.png" alt="" />

        <div className="register-bg">
          <div className="register-form">
            <h1 className="title">Fur-Ever Care</h1>
            <p className="subtitle">Join our Pet Family!</p>

            <div className="form-container">
              {/* First and Last Name */}
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

              {/* Email Address */}
              <input
                className="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
              />

              {/* Create Password */}
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
                      showPassword
                        ? "/images/Eye off.png"
                        : "/images/Eye on.svg"
                    }
                    alt=""
                  />
                </button>
              </div>

              {/* Confirm Password */}
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
                    alt=""
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
                <p className="terms-and-privacy-p">
                  I agree to the{" "}
                  <a href="#" className="terms-link">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="privacy-policy-link">
                    Privacy Policy
                  </a>
                </p>
              </div>

              <button
                type="button"
                className="register-button"
                onClick={handleSubmit}
              >
                REGISTER
              </button>
            </div>

            <p className="login">
              Already have an account?
              <a className="login-link" href="/login">
                {" "}
                Log in
              </a>
            </p>
            <img className="heart" src="/images/heart.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

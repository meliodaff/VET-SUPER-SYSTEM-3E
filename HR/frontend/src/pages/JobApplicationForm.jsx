import React, { useState } from "react";
import SuccessModal from "../components/modals/SucessModal";
import Navbar from "../components/navbar";
import useInsertJobApplicant from "../api/useInsertJobApplicant";
import { useNavigate } from "react-router-dom";
export default function JobApplicationForm() {
  const navigate = useNavigate();
  const { insertJobApplicant, loadingForJobApplicant } =
    useInsertJobApplicant();
  const [formData, setFormData] = useState({
    position: "",
    firstName: "",
    lastName: "",
    middleName: "",
    address: "",
    contactNo: "",
    email: "",
    privacyConsent: false,
  });

  const [files, setFiles] = useState({
    idPicture: null,
    resume: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.privacyConsent) {
      alert("Please agree to the Privacy Policy to submit your application.");
      return;
    }

    if (
      !formData.position ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.middleName
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!files.idPicture || !files.resume) {
      alert("Please upload both ID picture and resume.");
      return;
    }

    if (formData.contactNo.length !== 11) {
      alert("Contact number must be exactly 11 digits!");
      return;
    }

    // console.log("Form Data:", formData);
    // console.log("Files:", files);

    const form = {
      ...formData,
      phoneNumber: formData.contactNo,
      resume: files.resume,
      photo: files.idPicture,
    };

    const response = await insertJobApplicant(form);

    if (!response.success) {
      console.log(response);
      alert(response.message);
      return;
    }

    setIsSubmitted(true);

    setTimeout(() => {
      navigate("/");
    }, 2000);
    // Show success modal
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
    // Reset form
    setFormData({
      position: "",
      firstName: "",
      lastName: "",
      middleName: "",
      address: "",
      contactNo: "",
      email: "",
      privacyConsent: false,
    });
    setFiles({
      idPicture: null,
      resume: null,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto bg-gray-50 rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-6 sm:mb-8">
            JOB APPLICATION
          </h1>

          {/*File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            {/* Position */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Position:
              </label>
              <div className="relative">
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm text-gray-500 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">What position are you applying for?</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="groomer">Groomer</option>
                  <option value="assistant">Veterinary Assistant</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 1x1 ID Picture */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <span className="text-red-500">*</span>1x1 ID Picture:
              </label>
              <label className="flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                <span className="font-semibold text-sm sm:text-base">
                  Choose files
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "idPicture")}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {files.idPicture ? files.idPicture.name : "No file Choosen"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Accepted file types: jpg, png, Max. file size: 1 MB.
              </p>
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <span className="text-red-500">*</span>Resume:
              </label>
              <label className="flex items-center justify-center w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                <span className="font-semibold text-sm sm:text-base">
                  Choose files
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {files.resume ? files.resume.name : "No file Choosen"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max. file size: 2 MB.
              </p>
            </div>
          </div>

          {/* Personal Background */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6">
              PERSONAL BACKGROUND
            </h2>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="text-red-500">*</span>First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="text-red-500">*</span>Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  <span className="text-red-500">*</span>Middle Name:
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Contact No:
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  maxLength={11}
                  placeholder="09XXXXXXXXX"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
              Data Privacy Policy Consent
            </h3>
            <div className="flex items-start mb-3">
              <input
                type="checkbox"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded mt-1 mr-3 flex-shrink-0"
              />
              <label className="text-sm text-gray-900">
                I agree to FUR EVER Privacy Policy
              </label>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed pl-0 sm:pl-7">
              By clicking Submit, you agree to Fur Ever Vet Clinic's Privacy
              Policy. Your information will be used only for documentation and
              official purposes, kept secure by authorized personnel, and stored
              for up to three (3) years in compliance with the Data Privacy Act
              of 2012.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-12 sm:px-16 py-3 bg-blue-600 text-white text-base sm:text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal Component */}
      {isSubmitted && (
        <SuccessModal isOpen={isSubmitted} onClose={handleCloseModal} />
      )}
    </>
  );
}

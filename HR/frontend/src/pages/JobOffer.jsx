import React from "react";
import Navbar from "../components/navbar";
import Button from "../components/Button";
import { Link } from "react-router-dom";
export default function JobOffer() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          JOB OFFER
        </h1>

        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-8 relative">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src="src/assets/images/vet-with-cat.jpg"
                alt="Veterinarian with cat"
                className="w-64 h-64 object-cover rounded-xl shadow"
              />
            </div>

            {/* Job Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  VETERINARIAN
                </h2>
                <p className="text-gray-700 mb-6">
                  Provide medical care, diagnose and treat illnesses, perform
                  surgeries, and guide pet owners in proper animal care.
                </p>

                <div className="mb-6">
                  <p className="font-semibold italic text-gray-800 mb-2">
                    Qualification:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Doctor of Veterinary Medicine (DVM) graduate</li>
                    <li>PRC license holder</li>
                    <li>Strong knowledge in animal health and treatment</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <p className="font-semibold italic text-gray-800 mb-2">
                    Requirements:
                  </p>
                  <p className="text-gray-600">
                    To be discussed upon application.
                  </p>
                </div>
              </div>

              {/* ✅ Apply Button bottom-right */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => console.log("Apply Clicked")}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Link to={"/job-application"}>APPLY</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

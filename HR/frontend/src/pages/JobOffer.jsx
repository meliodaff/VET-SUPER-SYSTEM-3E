import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { jobsData } from "../data/jobsData";

export default function JobOffer() {
  const { jobId } = useParams();

  // Find the specific job or show all if no ID
  const job = jobId ? jobsData.find((j) => j.id === jobId) : null;

  // If jobId provided but not found, redirect
  if (jobId && !job) {
    return <Navigate to="/job-offers" replace />;
  }

  // Show single job
  if (job) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
            JOB OFFER
          </h1>

          <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-8 relative">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-64 h-64 object-cover rounded-xl shadow"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-700 mb-6">{job.description}</p>

                  <div className="mb-6">
                    <p className="font-semibold italic text-gray-800 mb-2">
                      Qualification:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {job.qualifications.map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <p className="font-semibold italic text-gray-800 mb-2">
                      Requirements:
                    </p>
                    <p className="text-gray-600">{job.requirements}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link to={`/job-application/${job.id}`}>APPLY</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show all jobs if no specific ID
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          JOB OFFERS
        </h1>
        <div className="space-y-8">
          {jobsData.map((j) => (
            <div
              key={j.id}
              className="bg-white border border-gray-300 rounded-2xl shadow-sm p-8"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <img
                  src={j.image}
                  alt={j.title}
                  className="w-64 h-64 object-cover rounded-xl shadow"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {j.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{j.description}</p>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link to={`/job-offer/${j.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

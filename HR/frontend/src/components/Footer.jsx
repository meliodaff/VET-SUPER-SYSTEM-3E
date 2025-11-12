import { FaClock, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0A1172] text-white py-10 px-6 sm:px-12 lg:px-20 mt-auto w-full rounded-t-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo and Schedule */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src="/src/assets/images/logo.png" 
              alt="Fur Ever Care Logo" 
              className="w-14 h-14"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-black">FUR EVER CARE</h2>
              <p className="text-sm font-semibold">VETERINARY SERVICE</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <FaClock className="text-white" />
              <h3 className="font-bold">SCHEDULE</h3>
            </div>
            <p className="text-sm">MONDAY - FRIDAY 8:00 AM - 8:00 PM</p>
            <p className="text-sm">SATURDAY - SUNDAY 8:00 AM - 8:00 PM</p>
            <p className="text-sm text-red-400 font-bold">EMERGENCY 24/7</p>
          </div>
        </div>

        {/* Middle Section - Links */}
        <div className="flex flex-col space-y-3 text-center md:text-left">
          <a href="#" className="hover:underline font-semibold">About Us</a>
          <a href="#" className="hover:underline font-semibold">Service</a>
          <a href="#" className="hover:underline font-semibold">Terms and Condition</a>
          <a href="#" className="hover:underline font-semibold">Privacy and Policy</a>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold mb-4">CONTACT INFORMATION</h3>
          <div className="flex items-center space-x-2 mb-2">
            <FaMapMarkerAlt />
            <p>123 Pet Care Avenue</p>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <FaPhoneAlt />
            <p>1234567890</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope />
            <p>furevercare@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm">
        Copyright © 2025 Fur Ever Vet Clinic | All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

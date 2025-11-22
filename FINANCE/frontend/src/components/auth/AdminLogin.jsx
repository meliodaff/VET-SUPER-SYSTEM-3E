import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Globe } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onLogin(formData);
      if (!result.success) {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden shape-3d-container">
      {/* 3D Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none shape-3d-container">
        {/* 3D Rotating Spheres */}
        <div className="absolute top-20 left-20 w-80 h-80 animate-rotate3d" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-full h-full rounded-full blur-3xl" 
               style={{ 
                 background: 'radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(147, 51, 234, 0.1) 100%)',
                 transform: 'rotateX(60deg) rotateY(45deg)',
                 boxShadow: '0 0 100px rgba(192, 132, 252, 0.4), inset 0 0 60px rgba(147, 51, 234, 0.3)'
               }}>
          </div>
        </div>

        <div className="absolute bottom-32 right-32 w-96 h-96 animate-rotate3d-y" style={{ transformStyle: 'preserve-3d', animationDelay: '3s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(126, 34, 206, 0.1) 100%)',
                 transform: 'rotateX(45deg) rotateY(60deg)',
                 boxShadow: '0 0 120px rgba(168, 85, 247, 0.35), inset 0 0 80px rgba(126, 34, 206, 0.25)'
               }}>
          </div>
        </div>

        {/* 3D Floating Geometric Shapes */}
        <div className="absolute top-1/2 left-1/4 w-72 h-72 animate-float3d" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'conic-gradient(from 0deg, rgba(192, 132, 252, 0.2) 0%, rgba(168, 85, 247, 0.25) 50%, rgba(192, 132, 252, 0.2) 100%)',
                 transform: 'rotateX(30deg) rotateY(30deg) rotateZ(45deg)',
                 boxShadow: '0 0 90px rgba(192, 132, 252, 0.3), inset -20px -20px 40px rgba(147, 51, 234, 0.2)'
               }}>
          </div>
        </div>

        <div className="absolute top-1/3 right-1/4 w-64 h-64 animate-rotate3d-x" style={{ transformStyle: 'preserve-3d', animationDelay: '5s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(147, 51, 234, 0.18) 100%)',
                 transform: 'rotateX(75deg) rotateY(15deg)',
                 boxShadow: '0 0 80px rgba(168, 85, 247, 0.28), inset 20px 20px 50px rgba(126, 34, 206, 0.2)'
               }}>
          </div>
        </div>

        {/* 3D Orbiting Elements */}
        <div className="absolute top-1/2 left-1/2 animate-orbit3d" style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
          <div className="w-56 h-56 rounded-full blur-2xl"
               style={{
                 background: 'rgba(192, 132, 252, 0.2)',
                 transform: 'rotateY(45deg)',
                 boxShadow: '0 0 70px rgba(192, 132, 252, 0.25)'
               }}>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 animate-scale3d" style={{ transformStyle: 'preserve-3d', animationDelay: '2s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                 transform: 'rotateX(50deg) rotateY(70deg)',
                 boxShadow: '0 0 85px rgba(147, 51, 234, 0.22), inset 0 0 45px rgba(168, 85, 247, 0.15)'
               }}>
          </div>
        </div>

        {/* Additional 3D Elements */}
        <div className="absolute top-2/3 right-1/5 w-80 h-80 animate-rotate3d" style={{ transformStyle: 'preserve-3d', animationDelay: '4s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'conic-gradient(from 180deg, rgba(168, 85, 247, 0.18) 0%, rgba(192, 132, 252, 0.22) 50%, rgba(168, 85, 247, 0.18) 100%)',
                 transform: 'rotateX(65deg) rotateY(25deg) rotateZ(30deg)',
                 boxShadow: '0 0 100px rgba(168, 85, 247, 0.3), inset -30px 30px 60px rgba(147, 51, 234, 0.18)'
               }}>
          </div>
        </div>

        {/* 3D Pulsing Spheres */}
        <div className="absolute top-40 right-1/3 w-48 h-48 animate-pulse-slow" style={{ transformStyle: 'preserve-3d' }}>
          <div className="w-full h-full rounded-full blur-2xl"
               style={{
                 background: 'rgba(192, 132, 252, 0.15)',
                 transform: 'rotateX(40deg) rotateY(50deg)',
                 boxShadow: '0 0 60px rgba(192, 132, 252, 0.2), inset 0 0 30px rgba(168, 85, 247, 0.15)'
               }}>
          </div>
        </div>

        <div className="absolute bottom-40 left-1/3 w-52 h-52 animate-pulse-slow" style={{ transformStyle: 'preserve-3d', animationDelay: '3s' }}>
          <div className="w-full h-full rounded-full blur-2xl"
               style={{
                 background: 'rgba(192, 132, 252, 0.12)',
                 transform: 'rotateX(55deg) rotateY(35deg)',
                 boxShadow: '0 0 65px rgba(147, 51, 234, 0.18), inset 0 0 35px rgba(192, 132, 252, 0.12)'
               }}>
          </div>
        </div>

        {/* Large 3D Background Blobs */}
        <div className="absolute top-10 left-10 w-96 h-96 animate-float3d" style={{ transformStyle: 'preserve-3d', animationDelay: '1s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'rgba(192, 132, 252, 0.1)',
                 transform: 'rotateX(20deg) rotateY(40deg)',
                 boxShadow: '0 0 150px rgba(168, 85, 247, 0.2)'
               }}>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] animate-rotate3d-y" style={{ transformStyle: 'preserve-3d', animationDelay: '6s' }}>
          <div className="w-full h-full rounded-full blur-3xl"
               style={{
                 background: 'rgba(168, 85, 247, 0.08)',
                 transform: 'rotateX(35deg) rotateY(55deg)',
                 boxShadow: '0 0 180px rgba(147, 51, 234, 0.15)'
               }}>
          </div>
        </div>

        {/* 3D Hexagonal Shapes */}
        <div className="absolute top-1/4 right-1/3 w-40 h-40 animate-rotate3d-complex" style={{ transformStyle: 'preserve-3d', animationDelay: '2s' }}>
          <div className="w-full h-full"
               style={{
                 clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                 background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.15) 100%)',
                 transform: 'rotateX(45deg) rotateY(45deg)',
                 filter: 'blur(40px)',
                 boxShadow: '0 0 60px rgba(192, 132, 252, 0.25)'
               }}>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 w-36 h-36 animate-rotate3d" style={{ transformStyle: 'preserve-3d', animationDelay: '7s' }}>
          <div className="w-full h-full"
               style={{
                 clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                 background: 'rgba(192, 132, 252, 0.15)',
                 transform: 'rotateX(60deg) rotateY(30deg)',
                 filter: 'blur(35px)',
                 boxShadow: '0 0 50px rgba(168, 85, 247, 0.2)'
               }}>
          </div>
        </div>

        {/* 3D Diamond Shapes */}
        <div className="absolute top-3/4 left-1/5 w-32 h-32 animate-float3d" style={{ transformStyle: 'preserve-3d', animationDelay: '4s' }}>
          <div className="w-full h-full"
               style={{
                 clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                 background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.18) 0%, rgba(147, 51, 234, 0.12) 100%)',
                 transform: 'rotateX(55deg) rotateY(45deg) rotateZ(45deg)',
                 filter: 'blur(30px)',
                 boxShadow: '0 0 55px rgba(192, 132, 252, 0.22)'
               }}>
          </div>
        </div>

        {/* Additional 3D Orbiting Sphere */}
        <div className="absolute top-1/5 left-2/3 w-44 h-44 animate-orbit3d" style={{ transformStyle: 'preserve-3d', animationDelay: '1s', transformOrigin: 'center center' }}>
          <div className="w-full h-full rounded-full blur-2xl shape-3d-sphere"
               style={{
                 background: 'radial-gradient(circle at 30% 30%, rgba(192, 132, 252, 0.25), rgba(168, 85, 247, 0.15) 60%, rgba(147, 51, 234, 0.1) 100%)',
                 transform: 'rotateY(30deg)',
                 boxShadow: '0 0 75px rgba(192, 132, 252, 0.3), inset -15px -15px 35px rgba(147, 51, 234, 0.2), inset 15px 15px 35px rgba(255, 255, 255, 0.1)'
               }}>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-fade-in transform transition-all duration-300 hover:shadow-3xl">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">FUR-EVER CARE</h1>
          <p className="text-gray-500 text-sm mb-6">Sales And Finance</p>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 overflow-hidden bg-white">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Fur-Ever Care Logo" 
                  className="w-full h-full object-contain p-2"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full bg-blue-400 rounded-full flex items-center justify-center">
                  <Globe className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-500 text-sm">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg group"
          >
            {loading ? 'Signing In...' : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-gray-500 text-sm mb-3">Need admin access?</p>
            <Link 
              to="/create-account" 
            className="inline-block w-full border-2 border-blue-600 text-blue-600 bg-white py-3 px-4 rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
            Create Admin Account
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

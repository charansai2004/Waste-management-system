import React from 'react';
import { CheckCircle, Users, Target, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green-600 font-semibold text-lg mb-4">ABOUT</p>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn More <span className="text-green-600">About Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            GreenGuard Insights is a pioneering organization dedicated to enhancing the efficiency and sustainability of municipal waste management.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our team comprises innovative scientists, technologists, and environmental experts committed to leveraging advanced classification technologies to ensure that waste is sorted accurately and managed effectively.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Comprehensive analysis and classification of municipal waste based on type and recyclability.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Continuous monitoring of waste processing to ensure efficient recycling and disposal.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Innovative solutions to minimize landfill use by identifying and separating recyclable materials early in the waste management process.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our team is our greatest asset. We are a diverse group of experts in fields such as environmental science, data analytics, software engineering, and waste management. Together, we bring a wealth of knowledge and experience to tackle the challenges of municipal waste classification and management.
            </p>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-green-600 rounded-2xl p-12 text-white mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Globe className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-green-100">Cities Served</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-3xl font-bold mb-2">1M+</h3>
              <p className="text-green-100">Images Processed</p>
            </div>
            <div>
              <Target className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-green-100">Accuracy Rate</p>
            </div>
            <div>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-3xl font-bold mb-2">24/7</h3>
              <p className="text-green-100">Support</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Expertise</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We combine cutting-edge artificial intelligence with deep domain knowledge in environmental science to provide accurate, reliable waste classification solutions that help create a more sustainable future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
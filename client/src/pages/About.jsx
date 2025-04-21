import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope, FaBuilding, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Reimagining Real Estate</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Making it easier for everyone to find their perfect home, invest in properties, and connect with trusted real estate professionals.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We're on a mission to transform the real estate experience through technology and exceptional service. 
                We believe finding a home should be exciting and accessible to everyone, regardless of their background 
                or experience with real estate.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By combining innovative technology with industry expertise, we're creating a platform that simplifies 
                the property journey from search to sale, making real estate transactions more transparent, efficient, 
                and enjoyable for all parties involved.
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <FaBuilding className="text-blue-500 text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Modern Platform</h3>
                <p className="text-gray-600">State-of-the-art technology making property transactions seamless</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <FaUsers className="text-purple-500 text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Customer First</h3>
                <p className="text-gray-600">Dedicated to providing exceptional service and support</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <FaLightbulb className="text-yellow-500 text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">Constantly improving to stay ahead of industry trends</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <svg className="text-green-500 w-8 h-8 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-lg font-semibold mb-2">Trust & Security</h3>
                <p className="text-gray-600">Verified listings and secure transactions you can count on</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Our talented team brings together expertise in real estate, technology, and customer service to deliver an exceptional experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: "Kedar Kolase", 
                role: "Full Stack Developer",
                image: "https://randomuser.me/api/portraits/men/1.jpg"
              },
              { 
                name: "Dattaraj Jadhav", 
                role: "UI/UX Designer",
                image: "https://randomuser.me/api/portraits/men/2.jpg"
              },
              { 
                name: "Pranav Dhebe", 
                role: "Backend Engineer",
                image: "https://randomuser.me/api/portraits/men/3.jpg"
              },
              { 
                name: "Sairaj Magdum", 
                role: "Project Manager",
                image: "https://randomuser.me/api/portraits/men/4.jpg"
              },
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-52 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <div className="flex space-x-4 text-gray-600">
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      <FaLinkedin size={20} />
                    </a>
                    <a href="#" className="hover:text-gray-900 transition-colors">
                      <FaGithub size={20} />
                    </a>
                    <a href="#" className="hover:text-red-500 transition-colors">
                      <FaEnvelope size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have found their perfect property through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/search" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-md transition-colors">
              Browse Listings
            </a>
            <a href="/contact" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold text-center mb-12 md:mb-16 neon-text">
          GET IN TOUCH
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="card flex flex-col justify-between p-6 sm:p-8 bg-black/40 rounded-xl border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-6">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors duration-300"
                >
                  <option value="general">General Inquiry</option>
                  <option value="join">Join the Club</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="event">Event Related</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Message subject"
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white transition-colors duration-300 resize-none"
                ></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-3 text-lg">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-6">
                Contact Information
              </h2>
              <a
                href="mailto:hello@c-square.club"
                className="card flex items-center space-x-4 p-4 bg-black/40 rounded-xl border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center text-black text-xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Email</h3>
                  <p className="text-gray-300">hello@c-square.club</p>
                </div>
              </a>
              <a
                href="#"
                className="card flex items-center space-x-4 p-4 bg-black/40 rounded-xl border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center text-black text-xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Discord</h3>
                  <p className="text-gray-300">Join our community</p>
                </div>
              </a>
              <a
                href="#"
                className="card flex items-center space-x-4 p-4 bg-black/40 rounded-xl border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center text-black text-xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-medium">Location</h3>
                  <p className="text-gray-300">University Campus</p>
                </div>
              </a>
            </div>

            <div className="card p-6 bg-black/40 rounded-xl border border-gray-700">
              <h3 className="text-lg sm:text-xl font-orbitron font-bold text-white mb-4">
                Why Contact Us?
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li>• Join our coding community</li>
                <li>• Collaborate on projects</li>
                <li>• Attend workshops and events</li>
                <li>• Get mentorship and support</li>
                <li>• Network with like-minded developers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

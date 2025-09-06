import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team');
      setTeamMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation button handlers for desktop
  const scrollLeftBtn = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="team" className="py-20 relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-magenta"></div>
            <p className="text-gray-300 mt-4">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-magenta/5"></div>
      </div>

      <div className="container-custom relative z-10" style={{ overflowX: 'visible' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Meet Our <span className="neon-text">Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The brilliant minds driving innovation and building the future of technology
          </p>
        </motion.div>

        {teamMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              Team members coming soon!
            </h3>
            <p className="text-gray-500">
              We're building an amazing team. Check back soon to meet them!
            </p>
          </motion.div>
        ) : (
          <div className="relative" style={{ overflowX: 'visible' }}>
            {/* Drag instruction */}
            <p className="text-center text-gray-400 mb-8 text-sm">
              <span className="hidden md:inline">👆 Drag to explore our team</span>
              <span className="md:hidden">👆 Swipe through team members</span>
            </p>

            {/* Navigation Buttons - Desktop only */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 justify-between pointer-events-none z-20 hidden md:flex">
              <button
                onClick={scrollLeftBtn}
                className="pointer-events-auto bg-black/80 hover:bg-black/90 border-2 border-neon-magenta text-neon-magenta hover:text-white transition-all duration-300 rounded-full p-3 ml-4 shadow-lg hover:shadow-neon-magenta/30"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRightBtn}
                className="pointer-events-auto bg-black/80 hover:bg-black/90 border-2 border-neon-magenta text-neon-magenta hover:text-white transition-all duration-300 rounded-full p-3 mr-4 shadow-lg hover:shadow-neon-magenta/30"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Desktop Team Slider Track */}
            <div
              ref={trackRef}
              className="team-track hidden md:flex"
              style={{
                gap: '1rem',
                overflowX: 'scroll',
                overflowY: 'hidden',
                padding: '1rem 0',
                paddingBottom: '20px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                width: '100%'
              }}
            >
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="team-member-card flex-shrink-0 relative w-[clamp(240px,80vw,320px)] h-[clamp(360px,55vh,440px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Card Background */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-neon-cyan transition-all duration-300 group flex flex-col">

                    {/* Member Photo Section - 3/4 of the card height */}
                    <div className="relative flex-[3] overflow-hidden">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.initials-fallback').style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`initials-fallback ${member.photo ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 items-center justify-center`}>
                        <span className="text-6xl font-bold text-white">
                          {member.initials || member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Member Info Section - 1/4 of the card height */}
                    <div className="flex-[1] p-3 sm:p-4 md:p-6 text-white flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-neon-magenta text-xs sm:text-sm md:text-base font-medium mb-2 line-clamp-1">
                          {member.position}
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                          {member.bio}
                        </p>
                      </div>

                      {/* Social Links */}
                      {(member.email || member.linkedin || member.github) && (
                        <div className="flex justify-start space-x-3 sm:space-x-4 mt-2">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                              title="Email"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                              title="LinkedIn"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                              title="GitHub"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile CSS-Only Carousel */}
            <section className="team-carousel md:hidden w-[278px] md:w-full flex justify-center items-center h-[360px]" aria-label="Team Members">
              <div className="team-carousel__viewport overflow-x-scroll  scroll-snap-x mandatory flex gap-4 p-2 w-full item max-w-screen-sm items-center">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    id={`team__slide${index + 1}`}
                    tabIndex="0"
                    className="team-member-card flex-shrink-0 relative
          max-w-[280px] max-h-[360px] w-[clamp(180px,75vw,245px)] h-[clamp(320px,50vh,360px)]
          scroll-snap-align-start"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl 
          overflow-hidden border-2 border-gray-700 hover:border-neon-cyan transition-all duration-300 group flex flex-col">
                      <div className="relative flex-[3] overflow-hidden p-1">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.querySelector('.initials-fallback').classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`initials-fallback ${member.photo ? 'hidden' : 'flex'} w-full h-full 
              bg-gradient-to-br from-neon-cyan/25 to-neon-magenta/20 items-center justify-center`}>
                          <span className="text-4xl font-bold text-white">
                            {member.initials || member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-[1] p-2 sm:p-3 text-white flex flex-col justify-between gap-1">
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold mb-1 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-neon-magenta text-[0.7rem] sm:text-xs font-medium mb-1 line-clamp-1">
                            {member.position}
                          </p>
                          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>





              {/* Navigation Dots */}
              <div className="team-carousel__navigation">
                <div className="team-carousel__navigation-list">
                  {teamMembers.map((_, index) => (
                    <div key={index} className="team-carousel__navigation-item">
                      <a
                        href={`#team__slide${index + 1}`}
                        className="team-carousel__navigation-button"
                      >
                        Go to slide {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="card bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 border-2 border-transparent bg-clip-padding"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1))',
              borderImage: 'linear-gradient(135deg, rgb(0, 255, 255), rgb(255, 0, 255)) 1'
            }}>
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to Join Our Team?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're always looking for passionate individuals who want to make a difference in technology.
              Join us and be part of something amazing!
            </p>
            <a
              href="#contact"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Get In Touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-neon-cyan opacity-20 rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-neon-magenta opacity-30 rotate-12"></div>
      <div className="absolute top-1/2 left-5 w-2 h-20 bg-gradient-to-b from-transparent via-neon-yellow to-transparent opacity-40"></div>
      <div className="absolute top-1/3 right-5 w-2 h-16 bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-30"></div>

      <style jsx>{`
        .team-track {
          scrollbar-width: thin;
          scrollbar-color: #ff00ff transparent;
        }
        .team-track::-webkit-scrollbar {
          height: 8px;
        }
        .team-track::-webkit-scrollbar-track {
          background: transparent;
        }
        .team-track::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #ff00ff, #00ffff);
          border-radius: 4px;
        }
        .team-track::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #dd00dd, #00dddd);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* CSS-only carousel styles for mobile */
        .team-carousel {
          position: relative;
          padding-top: 75%;
          filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.3));
          perspective: 100px;
        }

        .team-carousel__viewport {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          overflow-x: scroll;
          counter-reset: item;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .team-carousel__viewport::-webkit-scrollbar {
          display: none;
        }

        .team-carousel__slide {
          position: relative;
          flex: 0 0 100%;
          width: 100%;
          counter-increment: item;
          scroll-snap-align: center;
          padding: 0 1rem;
        }

        .team-carousel__snapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          scroll-snap-align: center;
        }

        .team-carousel__navigation {
          position: absolute;
          right: 0;
          bottom: -3rem;
          left: 0;
          text-align: center;
        }

        .team-carousel__navigation-list {
          display: inline-flex;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .team-carousel__navigation-item {
          display: inline-block;
        }

        .team-carousel__navigation-button {
          display: inline-block;
          width: 0.75rem;
          height: 0.75rem;
          background-color: rgba(255, 255, 255, 0.3);
          background-clip: content-box;
          border: 0.125rem solid transparent;
          border-radius: 50%;
          font-size: 0;
          transition: all 0.2s;
          text-decoration: none;
        }

        .team-carousel__navigation-button:hover,
        .team-carousel__navigation-button:focus {
          background-color: #ff00ff;
          transform: scale(1.2);
        }

        .team-carousel__prev,
        .team-carousel__next {
          position: absolute;
          top: 50%;
          width: 3rem;
          height: 3rem;
          transform: translateY(-50%);
          border-radius: 50%;
          font-size: 0;
          outline: 0;
          background-color: rgba(0, 0, 0, 0.7);
          background-size: 1rem 1rem;
          background-repeat: no-repeat;
          background-position: center center;
          color: #fff;
          border: 2px solid #ff00ff;
          text-decoration: none;
          transition: all 0.2s;
          z-index: 10;
        }

        .team-carousel__prev {
          left: 0.5rem;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,50 80,100 80,0' fill='%23fff'/%3E%3C/svg%3E");
        }

        .team-carousel__next {
          right: 0.5rem;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='100,50 20,100 20,0' fill='%23fff'/%3E%3C/svg%3E");
        }

        .team-carousel__prev:hover,
        .team-carousel__next:hover {
          background-color: rgba(255, 0, 255, 0.2);
          border-color: #00ffff;
          transform: translateY(-50%) scale(1.1);
        }

        /* Target specific slides for active navigation indicator */
        #team__slide1:target ~ .team-carousel__navigation .team-carousel__navigation-item:nth-child(1) .team-carousel__navigation-button,
        #team__slide2:target ~ .team-carousel__navigation .team-carousel__navigation-item:nth-child(2) .team-carousel__navigation-button,
        #team__slide3:target ~ .team-carousel__navigation .team-carousel__navigation-item:nth-child(3) .team-carousel__navigation-button,
        #team__slide4:target ~ .team-carousel__navigation .team-carousel__navigation-item:nth-child(4) .team-carousel__navigation-button,
        #team__slide5:target ~ .team-carousel__navigation .team-carousel__navigation-item:nth-child(5) .team-carousel__navigation-button {
          background-color: #ff00ff;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
};

export default TeamSection;

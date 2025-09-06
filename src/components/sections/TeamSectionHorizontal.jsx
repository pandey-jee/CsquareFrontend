import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);
  const [activeMember, setActiveMember] = useState(null);

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
            <p className="text-center text-gray-400 mb-8 text-sm">
              <span className="hidden md:inline">👆 Drag to explore our team</span>
              <span className="md:hidden">👆 Swipe through team members</span>
            </p>

            {/* Desktop Navigation Buttons */}
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

            {/* Desktop Team Slider */}
            <div
              ref={trackRef}
              className="team-track hidden md:flex"
              style={{
                gap: '1rem',
                overflowX: 'scroll',
                overflowY: 'hidden',
                padding: '1rem 0',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                width: '100%'
              }}
            >
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="team-member-card flex-shrink-0 relative w-[clamp(240px,80vw,320px)] h-[clamp(360px,55vh,440px)]"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-neon-cyan transition-all duration-300 group flex flex-col items-center justify-center cursor-pointer"
                    style={{ minWidth: '220px', maxWidth: '240px', height: '340px', position: 'relative' }}
                    onClick={() => setActiveMember(member)}
                  >
                    {/* Photo */}
                    <div className="relative flex-[3] overflow-hidden">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                          draggable={false}
                          style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '18px', display: 'block' }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-[1] p-3 sm:p-4 md:p-6 text-white flex flex-col justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-neon-magenta text-xs sm:text-sm md:text-base font-medium mb-2 line-clamp-1">
                          {member.position}
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                          {member.bio && member.bio.length > 60 ? member.bio.slice(0, 60) + '...' : member.bio}
                        </p>
                      </div>
                      {(member.email || member.linkedin || member.github) && (
                        <div className="flex justify-start space-x-3 sm:space-x-4 mt-2">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-neon-cyan transition-colors duration-300" title="Email">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-cyan transition-colors duration-300" title="LinkedIn">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-cyan transition-colors duration-300" title="GitHub">
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

            {/* Popup */}
            {activeMember && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setActiveMember(null)}>
                <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()} style={{ boxShadow: '0 0 40px #00ffff88' }}>
                  <button className="absolute top-3 right-3 text-neon-cyan text-2xl font-bold" onClick={() => setActiveMember(null)}>&times;</button>
                  <div className="flex flex-col items-center">
                    {activeMember.photo && (
                      <img src={activeMember.photo} alt={activeMember.name} className="w-32 h-32 object-cover rounded-full mb-4" />
                    )}
                    <h2 className="text-2xl font-bold text-white mb-2">{activeMember.name}</h2>
                    <p className="text-neon-magenta text-base font-medium mb-2">{activeMember.position}</p>
                    <p className="text-gray-300 text-sm mb-4">{activeMember.bio}</p>
                    {activeMember.linkedin && (
                      <a href={activeMember.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-4 py-2 rounded-full bg-neon-cyan text-black font-semibold text-sm hover:bg-neon-magenta transition-colors duration-300">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;

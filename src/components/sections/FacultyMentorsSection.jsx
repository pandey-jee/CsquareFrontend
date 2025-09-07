
import { useRef } from 'react';
import { motion } from 'framer-motion';
import sachinAhuja from '../../assets/faculty-mentors/sachin-ahuja.jpeg';
import puneetKumar from '../../assets/faculty-mentors/puneet-kumar.jpeg';
import gurmeetKaur from '../../assets/faculty-mentors/gurmeet-kaur.jpeg';
import dilshadKaur from '../../assets/faculty-mentors/dilshad-kau.jpeg';
import komalpreetSaini from '../../assets/faculty-mentors/komalpreet-saini.jpeg';
import jaspreetSinghBatth from '../../assets/faculty-mentors/jaspreet-singh-batth.jpeg';

const facultyMentors = [
  {
    id: 1,
    name: 'Dr. (Prof.) Sachin Ahuja',
    photo: sachinAhuja,
    designation: 'Executive Director',
    bio: 'Guiding the club with years of academic and industry experience in Computer Science.',
    linkedin: 'https://www.linkedin.com/in/dr-sachin-ahuja-0885a235/',
  },
  {
    id: 2,
    name: 'Dr. (Prof.) Puneet Kumar',
    photo: puneetKumar,
    designation: 'Associate Director',
    bio: 'Passionate about student development and research in AI and Data Science.',
    linkedin: 'https://www.linkedin.com/in/dr-puneet-kumar-2a84b531/',
  },
  {
    id: 3,
    name: 'Dr. (Prof.) Jaspreet Singh Batth',
    photo: jaspreetSinghBatth,
    designation: 'Batchhead CSE 2nd Year',
    bio: 'Renowned researcher and educator with expertise in advanced computing technologies and student mentorship.',
    linkedin: 'https://linkedin.com/in/jaspreet-singh-batth',
  },
  {
    id: 4,
    name: 'Dr. Gurmeet Kaur Saini',
    photo: gurmeetKaur,
    designation: 'Associate Professor',
    bio: 'Expert in software engineering and a constant motivator for the club.',
    linkedin: 'https://www.linkedin.com/in/gurmeet-kaur-saini-4b6815213/',
  },
  {
    id: 5,
    name: 'Er. Dilshad Kaur',
    photo: dilshadKaur,
    designation: 'Faculty Advisor',
    bio: 'Encourages innovation and creativity among students.',
    linkedin: 'https://www.linkedin.com/in/dilshad-kaur-201158254/',
  },
  {
    id: 6,
    name: 'Er. Kamalpreet Saini',
    photo: komalpreetSaini,
    designation: 'Faculty Co-Advisor',
    bio: 'Dedicated to bridging the gap between academia and industry.',
    linkedin: 'https://www.linkedin.com/in/komalpreet-saini-8a239664/',
  },
];const FacultyMentorsSection = () => {
  const trackRef = useRef(null);

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

  return (
    <section id="faculty-mentors" className="py-20 relative">
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
            Our <span className="neon-text">Faculty Mentors</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the dedicated faculty guiding and inspiring our club members
          </p>
        </motion.div>
        <div className="relative" style={{ overflowX: 'visible' }}>
          <p className="text-center text-gray-400 mb-8 text-sm">
            <span className="hidden md:inline">👆 Drag to explore our mentors</span>
            <span className="md:hidden">👆 Swipe through mentors</span>
          </p>
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
            {facultyMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="team-member-card flex-shrink-0 relative w-[clamp(240px,80vw,320px)] h-[clamp(360px,55vh,440px)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-neon-cyan transition-all duration-300 group flex flex-col">
                  <div className="relative flex-[3] overflow-hidden">

                    {mentor.photo ? (
                      <img
                        src={mentor.photo}
                        alt={mentor.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                        onError={e => {
                          e.target.classList.add('hidden');
                          const fallback = e.target.parentElement.querySelector('.initials-fallback');
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`initials-fallback${mentor.photo ? ' hidden' : ' flex'} w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 items-center justify-center`}>
                      <span className="text-6xl font-bold text-white">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex-[1] p-3 sm:p-4 md:p-6 text-white flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
                        {mentor.name}
                      </h3>
                      <p className="text-neon-magenta text-xs sm:text-sm md:text-base font-medium mb-2 line-clamp-1">
                        {mentor.designation}
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                        {mentor.bio}
                      </p>
                    </div>
                    <div className="flex justify-start space-x-3 sm:space-x-4 mt-2">
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                        title="LinkedIn"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile Carousel */}
          <section className="team-carousel md:hidden w-[278px] md:w-full flex justify-center items-center h-[360px]" aria-label="Faculty Mentors">
            <div className="team-carousel__viewport overflow-x-scroll  scroll-snap-x mandatory flex gap-4 p-2 w-full max-w-screen-sm items-center">
              {facultyMentors.map((mentor, index) => (
                <div
                  key={mentor.id}
                  id={`mentor__slide${index + 1}`}
                  tabIndex="0"
                  className="team-member-card flex-shrink-0 relative max-w-[280px] max-h-[360px] w-[clamp(180px,75vw,245px)] h-[clamp(320px,50vh,360px)] scroll-snap-align-start"
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-neon-cyan transition-all duration-300 group flex flex-col">
                    <div className="relative flex-[3] overflow-hidden p-1">

                      {mentor.photo ? (
                        <img
                          src={mentor.photo}
                          alt={mentor.name}
                          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          onError={e => {
                            e.target.classList.add('hidden');
                            const fallback = e.target.parentElement.querySelector('.initials-fallback');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`initials-fallback${mentor.photo ? ' hidden' : ' flex'} w-full h-full bg-gradient-to-br from-neon-cyan/25 to-neon-magenta/20 items-center justify-center`}>
                        <span className="text-4xl font-bold text-white">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-[1] p-2 sm:p-3 text-white flex flex-col justify-between gap-1">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold mb-1 group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1">
                          {mentor.name}
                        </h3>
                        <p className="text-neon-magenta text-[0.7rem] sm:text-xs font-medium mb-1 line-clamp-1">
                          {mentor.designation}
                        </p>
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
                          {mentor.bio}
                        </p>
                      </div>
                      <div className="flex justify-start space-x-3 sm:space-x-4 mt-2">
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                          title="LinkedIn"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-neon-cyan opacity-20 rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-neon-magenta opacity-30 rotate-12"></div>
      <div className="absolute top-1/2 left-5 w-2 h-20 bg-gradient-to-b from-transparent via-neon-yellow to-transparent opacity-40"></div>
      <div className="absolute top-1/3 right-5 w-2 h-16 bg-gradient-to-b from-transparent via-neon-cyan to-transparent opacity-30"></div>
    </section>
  );
};

export default FacultyMentorsSection;

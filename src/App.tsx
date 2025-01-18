import React, { useEffect, useState } from 'react';
import { MailIcon, Code2Icon, CloudIcon, DatabaseIcon } from 'lucide-react';
import MovingText from './components/MovingText';
import ProjectCard from './components/ProjectCard';
import ExpertiseCard from './components/ExpertiseCard';
import ParallaxSection from './components/ParallaxSection';
import CursorEffect from './components/CursorEffect';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/next';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <CursorEffect />

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <span className='text-2xl font-bold text-pink-600'>AQ</span>
            <div className='space-x-8'>
              <button
                onClick={() => scrollToSection('about')}
                className='hover:text-pink-600 transition-colors'
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('expertise')}
                className='hover:text-pink-600 transition-colors'
              >
                Expertise
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className='hover:text-pink-600 transition-colors'
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className='hover:text-pink-600 transition-colors'
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <ParallaxSection>
        <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-pink-900'></div>
          <div className='relative z-10 text-center space-y-8'>
            <MovingText
              texts={[
                'Coding for Impact',
                'Creating Cloud Solutions for Change',
                'Driven by Data, Powered by Purpose',
              ]}
            />
            <h2 className='text-2xl font-light tracking-wide'>
              Ayabonga Qwabi | Cloud Architect & Software Developer
            </h2>
            <button
              onClick={() => scrollToSection('about')}
              className='px-8 py-3 bg-pink-600 rounded-full hover:bg-pink-700 transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-600/20'
            >
              Learn More
            </button>
          </div>
        </div>
      </ParallaxSection>

      {/* About Section */}
      <section
        id='about'
        className='py-20 relative  bg-gradient-to-tr from-black via-gray-900 to-pink-900'
      >
        <div className='container mx-auto px-6 text-white'>
          <div className='max-w-4xl mx-auto space-y-12'>
            <div className='space-y-6'>
              <h2 className='text-5xl font-bold text-center mb-12'>
                Who is Ayabonga Qwabi?
              </h2>
              <p className='text-xl leading-relaxed text-gray-300'>
                Ayabonga Qwabi is a talented and passionate software developer
                from Queenstown, South Africa. With a keen focus on leveraging
                technology for impactful solutions, Ayabonga's expertise lies in
                building innovative cloud-based systems designed to solve
                real-world challenges.
              </p>
              <p className='text-xl leading-relaxed text-gray-300'>
                Often described as a Cloud Software Wrangler, Ayabonga
                specializes in creating seamless, scalable, and effective
                software architectures that drive both business growth and
                social impact. He's deeply committed to using data to fuel
                results, from building intuitive user interfaces to crafting
                customized backend solutions.
              </p>
            </div>

            <div className='space-y-6'>
              <h3 className='text-3xl font-bold text-pink-600'>
                Technical Philosophy
              </h3>
              <p className='text-xl leading-relaxed text-gray-300'>
                A JavaScript & Clojure developer, Ayabonga is also well-versed
                in mining & transforming data, which enables him to deliver
                flexible and efficient code for complex systems. His work often
                focuses on developing platforms that empower individuals and
                organizations, ranging from non-profits to corporate clients,
                with a special emphasis on integrating data-driven insights into
                every project he takes on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id='expertise' className='py-20 relative'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(236,72,153,0.1),transparent)] text-white pointer-events-none'></div>
        <div className='container mx-auto px-6 text-white'>
          <h2 className='text-5xl font-bold mb-16 text-center'>
            Areas of Expertise
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <ExpertiseCard
              title='Full-Stack Development'
              description='Creating scalable and efficient solutions with modern technologies'
              icon={<Code2Icon className='w-8 h-8' />}
              details={[
                'React & Next.js',
                'Node.js & Express',
                'TypeScript',
                'Clojure & ClojureScript',
              ]}
            />
            <ExpertiseCard
              title='Cloud Architecture'
              description='Designing reliable and performant cloud-native solutions'
              icon={<CloudIcon className='w-8 h-8' />}
              details={[
                'GCP & AWS',
                'Serverless Architecture',
                'Microservices',
                'DevOps & CI/CD',
              ]}
            />
            <ExpertiseCard
              title='Data Solutions'
              description='Transforming raw data into actionable insights'
              icon={<DatabaseIcon className='w-8 h-8' />}
              details={[
                'Data Analysis',
                'Web Scraping',
                'API Development',
                'Database Design',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='py-20 relative'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(236,72,153,0.1),transparent)] pointer-events-none'></div>
        <div className='container mx-auto px-6'>
          <h2 className='text-5xl font-bold mb-16 text-center'>
            Featured Projects
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
            <ProjectCard
              title='Inaethe'
              description='NPO donation platform with affiliate marketing rewards'
              url='https://inaethe.netlify.app'
              image='https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800'
              tech={['NextJS', 'Node.js', 'Netlify', 'Firebase']}
              tagline='Ubuntu Rewards'
            />
            <ProjectCard
              title='Xhosa Hip Hop'
              description='Xhosa Hip Hop music platform promoting Xhosa Hip Hop talent from the Eastern and Western Cape.'
              url='https://xhosahiphop.co.za'
              image='https://dusk2dawn2020.wordpress.com/wp-content/uploads/2020/10/img_20201029_121210_428.jpg'
              tech={['React', 'Express', 'Mongo DB']}
              tagline='Xhosa Hip Hop music platform'
            />
            <ProjectCard
              title='NMT Play'
              description='File sharing and downloads website in the Xhosa vernac language to promote and spread awareness of the use of technology in the Eastern Cape.'
              url='https://nmtplay.co.za'
              image='https://nmtplay.co.za/og.png'
              tech={['Vite', 'React', 'NextJS', 'Firebase']}
              tagline='Xhosa Vernac File Sharing Platform'
            />
            <ProjectCard
              title='ClinicPlus Bookings'
              description='Medical booking platform for mine workers in the Witbank and Hendrina regions.'
              url='https://clinicplusbookings.co.za'
              image='https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800'
              tech={['React', 'Express', 'Mongo DB']}
              tagline='Healthcare Access Simplified'
            />
            <ProjectCard
              title='Nomava'
              description='Indigenous African Knowledge Repository'
              url='https://www.youtube.com/@NomavaTV'
              image='https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800'
              tech={['YouTube', 'Content Creation']}
              tagline='Preserving African Wisdom'
            />
            <ProjectCard
              title='Ayabonga'
              description='Ayabongas developer profile website'
              url='https://www.ayabonga.com'
              image='https://ayabonga.com/og.png'
              tech={['React', 'Supabase']}
              tagline='Showcasing my profile to the world'
            />
            <ProjectCard
              title='Qwabi'
              description='Qwabi Private Cloud'
              url='https://www.ayabonga.com'
              image='https://ayabonga.com/og.png'
              tech={['React', 'Supabase']}
              tagline='Manage the private cloud at qwabi.co.za'
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-pink-900/20 to-transparent pointer-events-none'></div>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-5xl font-bold mb-16'>Get in Touch</h2>
          <div className='text-4xl md:text-6xl font-bold text-white mb-8 hover:scale-105 transition-transform'>
            <a
              href='mailto:aya@qwabi.co.za'
              className='hover:text-pink-500 flex items-center justify-center gap-4'
            >
              <MailIcon className='w-12 h-12' />
              aya@qwabi.co.za
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

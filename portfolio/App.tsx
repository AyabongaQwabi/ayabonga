import React, { useEffect, useState } from "react"
import { MailIcon, Code2Icon, CloudIcon, DatabaseIcon, ArrowRight } from "lucide-react"
import MovingText from "./components/MovingText"
import ProjectCard from "./components/ProjectCard"
import ExpertiseCard from "./components/ExpertiseCard"
import ParallaxSection from "./components/ParallaxSection"
import CursorEffect from "./components/CursorEffect"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/next"
import CollaborationCard from "./components/CollaborationCard"
import { TrustSignals } from "./components/TrustSignals"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ConsultationModal } from "./components/ConsultationModal"

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CursorEffect />

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="container text-xs md:text-base mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-pink-600">AQ</span>
            <div className="space-x-8">
              <button onClick={() => scrollToSection("about")} className="hover:text-pink-600 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection("expertise")} className="hover:text-pink-600 transition-colors">
                Expertise
              </button>
              <button onClick={() => scrollToSection("projects")} className="hover:text-pink-600 transition-colors">
                Projects
              </button>
              <button
                onClick={() => scrollToSection("collaborations")}
                className="hover:text-pink-600 transition-colors"
              >
                Collaborations
              </button>
              <button onClick={() => scrollToSection("contact")} className="hover:text-pink-600 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <ParallaxSection>
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-pink-900"></div>
          <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            <MovingText texts={["Transforming Ideas", "Building Solutions", "Engineering Excellence"]} />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-gray-300">
              Empowering businesses through innovative cloud solutions and impactful software development
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Specialized in helping organizations overcome technical challenges and achieve digital transformation
              through custom cloud architecture and software solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => scrollToSection("contact")}
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 rounded-full group"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button onClick={() => scrollToSection("expertise")} variant="outline" size="lg" className="rounded-full">
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* About Section */}
      <section id="about" className="py-20 relative bg-gradient-to-tr from-black via-gray-900 to-pink-900">
        <div className="container mx-auto px-6 text-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-center mb-12">Who is Ayabonga Qwabi?</h2>
              <p className="text-xl leading-relaxed text-gray-300">
                As a dedicated Cloud Systems Specialist based in the beautiful town of Queenstown, South Africa, I am
                deeply passionate about harnessing the power of cloud-based applications to address pressing challenges
                and support initiatives that spark positive social change. To learn more about my journey and the values
                that drive me, feel free to visit www.qwabi.co.za.
              </p>
              <p className="text-xl leading-relaxed text-gray-300">
                In my role as a Cloud Engineering Specialist, I focus on designing and developing innovative systems
                that utilize the cloud to amplify meaningful causes and ideas. I blend technical expertise with creative
                solutions, aiming to create scalable, efficient, and user-friendly applications that empower individuals
                and organizations in achieving their goals. I am committed to using cloud-based tools and technologies
                as a means to bridge the digital divide and address both social and individual needs.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-pink-600">Technical Philosophy</h3>
              <p className="text-xl leading-relaxed text-gray-300">
                I specialize in modern engineering technologies, including LLMs, React, NodeJS, Clojure, Firebase,
                Twilio, and the Google Cloud Platform, to build adaptable systems that respond to users' needs. Every
                challenge presents a unique opportunity to devise tailored solutions that tackle problems at their core.
                My expertise in data transformation and analysis allows me to create systems that are not only effective
                but also insightful. Whether optimizing workflows, constructing robust platforms, or facilitating
                data-driven decision-making, my goal is to develop tools that create a lasting positive impact. I
                believe in building to nurture, fostering an expressive, inclusive, and connected world for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(236,72,153,0.1),transparent)] text-white pointer-events-none"></div>
        <div className="container mx-auto px-6 text-white">
          <h2 className="text-5xl font-bold mb-16 text-center">Areas of Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ExpertiseCard
              title="Full-Stack Development"
              description="Building enterprise-grade solutions using cutting-edge technologies"
              icon={<Code2Icon className="w-8 h-8" />}
              details={["React & Next.js", "Node.js & Express", "TypeScript", "Clojure & ClojureScript"]}
            />
            <ExpertiseCard
              title="Cloud Architecture"
              description="Designing reliable and performant cloud-native solutions"
              icon={<CloudIcon className="w-8 h-8" />}
              details={["GCP & AWS", "Serverless Architecture", "Microservices", "DevOps & CI/CD"]}
            />
            <ExpertiseCard
              title="Data Solutions"
              description="Transforming raw data into actionable insights"
              icon={<DatabaseIcon className="w-8 h-8" />}
              details={["Data Analysis", "Web Scraping", "API Development", "Database Design"]}
            />
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <TrustSignals />

      {/* Collaborations Section */}
      <section id="collaborations" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(236,72,153,0.1),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center">Companies I Have Collaborated With</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CollaborationCard
              company="Project Codex"
              description="Project Codex, also known as codeX, is dedicated to unlocking South Africa's digital talent. They offer coding programs and support young people in navigating the pathway to a career in software development."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/codeX-logo-uJsdV8NTdzwFxSuAiSbL9Fj6QVqNfF.svg"
              url="https://www.projectcodex.co"
            />
            <CollaborationCard
              company="Western Cape Labs"
              description="Western Cape Labs is an eCommerce company based in Cape Town. They focus on creating solutions that power eCommerce platforms and have been active since 1938."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/western%20cape%20labs-xmaFXzqUjUX6sye8Mn4vSycyHfKqlL.png"
              url="https://www.westerncapelabs.com"
            />
            <CollaborationCard
              company="Picsa"
              description="Picsa provides financial services aimed at improving the financial health of employees. They offer products like short- and long-term investments, affordable funeral plans, and responsible loans."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picsa+Logo-IjyNZErNOy7eejVKEunMyZwlNNglTZ.png"
              url="https://www.picsa.com"
            />
            <CollaborationCard
              company="Simply Financial Services"
              description="Simply Financial Services offers life insurance products that are easy to sign up for, with no medical tests or paperwork required. They are based in Cape Town and provide services both online and through brokers."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/simply-cMoo869b5a5U9BYSMthaI8lE9dVZ2K.svg"
              url="https://www.simply.co.za"
            />
            <CollaborationCard
              company="Cloudsure"
              description="Cloudsure started in 2014 as a cloud-based compliance engine for life insurance businesses. They have since expanded to offer a comprehensive, user-friendly life insurance platform."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cloudsure-HSSd2QMJDWW1U1UA7wG597dC5tTicg.png"
              url="https://www.cloudsure.mu"
            />
            <CollaborationCard
              company="AN Consulting"
              description="AN Consulting provides expert tax, audit and advisory services for small and medium enterprises in South Africa."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anconsulting-TV4QRUT7YvgAHc7YMdRmIOd7uPqWpT.png"
              url="https://www.anconsulting.co.za"
            />
            <CollaborationCard
              company="Bakeni"
              description="An independent consultancy offering a range of professional services within the fields of Water, Environmental and Earth Sciences, providing quality environmental consulting services across South Africa."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bakeni.jpg-XTPrzUugbDoa85muNpoRd8oI6dlIHS.jpeg"
              url="https://bakeni.netlify.app/"
            />
            <CollaborationCard
              company="Tecla Digital"
              description="A results-oriented agency creating custom and unique digital products that showcase brand identity and values. Experts in Start-up Services Solutions helping attract new customers through exceptional tech innovations."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tecla.jpg-UspgtfLgl0ZEWyMQWMlaMrQHrrZxEl.jpeg"
              url="https://www.tecla.co.za"
            />
            <CollaborationCard
              company="Siavista Electrical"
              description="An aspirational entity with a broader vision to utilize and employ more diversified, innovative, and integrated thinking and applications within electrical services industry."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/siavista-I5PvbBUADV4dz6tX0ue1EIfhJ9XQzz.png"
              url="https://siavistaelectrical.com/"
            />
            <CollaborationCard
              company="ClinicPlusWTB"
              description="Established in 2007, ClinicPlusWTB specializes in Occupational Health Screening for fitness to work, led by forward-thinking professionals committed to personal responsibility and accountability."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Clinic-Plus-Logos-300x200-1-ck5TT2Ek4Ei5dSBFYT1ra4p0MzdGwZ.png"
              url="https://www.clinicpluswtb.co.za/"
            />
            <CollaborationCard
              company="Warner Music Africa - Culture Shifters"
              description="A student ambassador program offering tertiary arts students the opportunity to gain first-hand experience in the music industry through workshops, creative meetings, and launches with a leading record label."
              logo="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Culture-Shifters-Logo-Cream-qxvAqKUvn1urbMckbVhf1OKocc84Lk.png"
              url="https://wmacultureshifters.com/"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(236,72,153,0.1),transparent)] pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-16 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <ProjectCard
              title="Inaethe"
              description="NPO donation platform with affiliate marketing rewards"
              url="https://inaethe.netlify.app"
              image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800"
              tech={["NextJS", "Node.js", "Netlify", "Firebase"]}
              tagline="Ubuntu Rewards"
            />
            <ProjectCard
              title="Xhosa Hip Hop"
              description="Xhosa Hip Hop music platform promoting Xhosa Hip Hop talent from the Eastern and Western Cape."
              url="https://xhosahiphop.co.za"
              image="https://dusk2dawn2020.wordpress.com/wp-content/uploads/2020/10/img_20201029_121210_428.jpg"
              tech={["React", "Express", "Mongo DB"]}
              tagline="Xhosa Hip Hop music platform"
            />
            <ProjectCard
              title="NMT Play"
              description="File sharing and downloads website in the Xhosa vernacular language to promote and spread awareness of the use of technology in the Eastern Cape."
              url="https://nmtplay.co.za"
              image="https://nmtplay.co.za/og.png"
              tech={["Vite", "React", "NextJS", "Firebase"]}
              tagline="Xhosa Vernac File Sharing Platform"
            />
            <ProjectCard
              title="ClinicPlus Bookings"
              description="Medical booking platform enhancing occupational healthcare access across mining and construction sectors"
              url="https://clinicplusbookings.co.za"
              image="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800"
              tech={["React", "Express", "Mongo DB"]}
              tagline="Healthcare Access Simplified"
            />
            <ProjectCard
              title="Nomava"
              description="Indigenous African Knowledge Repository"
              url="https://www.youtube.com/@NomavaTV"
              image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=800"
              tech={["YouTube", "Content Creation"]}
              tagline="Preserving African Wisdom"
            />
            <ProjectCard
              title="Ayabonga"
              description="Ayabongas developer profile website"
              url="https://www.ayabonga.com"
              image="https://ayabonga.com/og.png"
              tech={["React", "Supabase"]}
              tagline="Showcasing my profile to the world"
            />
            <ProjectCard
              title="Qwabi"
              description="Qwabi Private Cloud"
              url="https://www.ayabonga.com"
              image="https://ayabonga.com/og.png"
              tech={["React", "Supabase"]}
              tagline="Manage the private cloud at qwabi.co.za"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-bold mb-4">Let's Build Something Amazing</h2>
            <p className="text-xl text-gray-300">
              Ready to transform your digital presence? Let's discuss how we can help you achieve your goals.
            </p>
            <div className="flex flex-col items-center space-y-6">
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-full group"
                onClick={() => setIsModalOpen(true)}
              >
                <MailIcon className="mr-2 h-5 w-5" />
                Schedule a Consultation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
              <p className="text-gray-400">
                or email directly at{" "}
                <a
                  href="mailto:aya@qwabi.co.za"
                  className="text-pink-600 hover:text-pink-500 underline underline-offset-4"
                >
                  aya@qwabi.co.za
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default App


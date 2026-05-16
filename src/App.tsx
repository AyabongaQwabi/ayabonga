import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Menu, X, FileText, MessageCircle, Cloud, Brain, Code2, Calculator } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_PAGE_TITLE,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from './lib/site-config';

const projects = [
  {
    title: 'Laundry Marketplace',
    description: 'A turnkey laundry marketplace connecting customers with local laundry service providers.',
    url: 'https://laundry.qwabi.co.za',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    title: 'ClinicPlus',
    description: 'A clinic appointments booking platform for mining companies in Witbank, streamlining occupational healthcare access.',
    url: 'https://clinicplusbookings.co.za',
    tech: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Queens Connect',
    description: 'A friendly AI companion for the Queenstown community, providing local information and assistance.',
    url: 'https://queensconnect.qwabi.co.za',
    tech: ['AI', 'Next.js', 'OpenAI'],
  },
  {
    title: 'Kingly',
    description: 'An AI tool for creating vibe coding documents and prompts, enhancing developer productivity.',
    url: 'https://kingly.qwabi.co.za',
    tech: ['AI', 'React', 'TypeScript'],
  },
  {
    title: 'UTap',
    description: 'A university NFC access card mobile wallet for seamless campus access and payments.',
    url: 'https://utaptech.co.za',
    tech: ['React Native', 'NFC', 'Firebase'],
  },
  {
    title: 'eSpazza',
    description: 'A Xhosa hip hop music streaming and blogging website celebrating Eastern Cape hip hop culture.',
    url: 'https://xhosahiphop.co.za',
    tech: ['React', 'Express', 'MongoDB'],
  },
];

const collaborations = [
  { name: 'Project Codex', url: 'https://www.projectcodex.co' },
  { name: 'Western Cape Labs', url: 'https://www.westerncapelabs.com' },
  { name: 'Picsa', url: 'https://www.picsa.com' },
  { name: 'Simply Financial', url: 'https://www.simply.co.za' },
  { name: 'Warner Music Africa', url: 'https://wmacultureshifters.com/' },
  { name: 'Cloudsure', url: 'https://www.cloudsure.mu' },
];

const profileImages = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/502571183_4100934353486953_3497090813393292917_n-JZeh0AXL3p9vhL4YFUIQOVEnlzSXI5.jpg',
    alt: 'Ayabonga Qwabi working at his desk with code on screen',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg',
    alt: 'Ayabonga Qwabi professional headshot',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/489134843_4041244449455944_7049585150293422937_n-vFbZulwyco6e3O9hATq8IfT32IZDGT.jpg',
    alt: 'Ayabonga Qwabi casual portrait with African print shirt',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/503308818_4100825546831167_2412953019296727296_n-5z82XXW0FGvqtIZQZ4MUsrqAHvstlo.jpg',
    alt: 'Ayabonga Qwabi portrait with traditional headband',
  },
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % profileImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{DEFAULT_PAGE_TITLE}</title>
        <meta name="description" content={DEFAULT_PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:title" content={DEFAULT_PAGE_TITLE} />
        <meta property="og:description" content={DEFAULT_PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_PAGE_TITLE} />
        <meta name="twitter:description" content={DEFAULT_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Ayabonga Qwabi",
            "jobTitle": "Senior Product Engineer",
            "url": "https://qwabi.co.za",
            "sameAs": [
              "https://github.com/ayabongaqwabi",
              "https://linkedin.com/in/ayabongaqwabi",
              "https://twitter.com/ayabongaqwabi"
            ],
            "description": "Technical Co-founder as a Service. Building full-stack digital products and AI solutions for founders and agencies in South Africa.",
            "image": profileImages[1].src,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Queenstown",
              "addressRegion": "Eastern Cape",
              "addressCountry": "ZA"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Technical Co-founder as a Service",
            "provider": {
              "@type": "Person",
              "name": "Ayabonga Qwabi"
            },
            "description": "End-to-end product engineering, AI integration, and cloud architecture for non-technical founders.",
            "areaServed": "South Africa",
            "offers": {
              "@type": "Offer",
              "description": "Fixed-price Phase 1 builds starting from R50,000"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xl font-bold tracking-tight text-foreground">Ayabonga</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('expertise')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Expertise
              </button>
              <button onClick={() => scrollToSection('projects')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </button>
              <button onClick={() => scrollToSection('collaborations')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Work
              </button>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Writing
              </Link>
              <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link
                to="/get-a-quote"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" aria-hidden />
                Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-border mt-4">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                  About
                </button>
                <button onClick={() => scrollToSection('expertise')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                  Expertise
                </button>
                <button onClick={() => scrollToSection('projects')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                  Projects
                </button>
                <button onClick={() => scrollToSection('collaborations')} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                  Work
                </button>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Writing
                </Link>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </Link>
                <Link
                  to="/get-a-quote"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" aria-hidden />
                  Quote
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero / About Section */}
        <section id="about" className="pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
            {/* Left Column - Photo & Info */}
            <div className="space-y-6">
              {/* Profile Image with rotating gallery */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 transform rotate-6"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-border/50 shadow-2xl group cursor-pointer">
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Hero Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="/images/hero-taas-premium.png" 
                      alt="Premium Technical Leadership" 
                      className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-40"
                    />
                  </div>

                  {profileImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.src}
                      alt={img.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-5 ${
                        index === activeImage ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ))}
                </div>
                {/* Image indicators */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  {profileImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeImage ? 'bg-primary w-4' : 'bg-muted-foreground/30'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center md:text-left pt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
                  Ayabonga Qwabi
                </h1>
                <p className="text-primary font-semibold text-lg">
                  Technical Co-founder as a Service
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Queenstown, Eastern Cape, South Africa
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a 
                  href="https://github.com/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:aya@qwabi.co.za"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email Ayabonga"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column - Bio */}
            <div className="space-y-6">
              <p className="text-xl md:text-2xl leading-relaxed text-foreground font-medium text-balance">
                I turn your business idea into a working digital product (apps, platforms, AI tools) without the agency overhead or the junior dev lottery.
              </p>
              
              <p className="leading-relaxed text-muted-foreground">
                As an <span className="text-foreground font-medium">AI Specialist</span> and <span className="text-foreground font-medium">Cloud Architect</span>, I combine cutting-edge artificial intelligence with robust cloud infrastructure to solve complex challenges. My expertise spans designing scalable systems on <span className="text-foreground font-medium">Google Cloud Platform</span>, <span className="text-foreground font-medium">AWS</span>, and <span className="text-foreground font-medium">Azure</span>, while leveraging AI and machine learning to create intelligent, automated solutions.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                With deep proficiency in <span className="text-foreground font-medium">React</span>, <span className="text-foreground font-medium">Node.js</span>, <span className="text-foreground font-medium">TypeScript</span>, <span className="text-foreground font-medium">Python</span>, and <span className="text-foreground font-medium">Clojure</span>, I build full-stack applications that harness the power of large language models, computer vision, and predictive analytics. I leverage <span className="text-foreground font-medium">Supabase</span> and <span className="text-foreground font-medium">Firebase</span> for rapid development of real-time, scalable backends. My work focuses on bridging the digital divide and empowering communities through technology.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                I believe in building to nurture, fostering an expressive, inclusive, and connected world where technology serves humanity.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="https://wa.me/27603116777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  <span>View Projects</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-20 border-t border-border">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Expertise
            </h2>
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-foreground max-w-xl text-balance">
                Senior engineering spanning AI, cloud architecture, and technical product leadership.
              </p>
              <Link to="/services" className="text-sm text-primary hover:underline font-medium shrink-0">
                View all services →
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI & Machine Learning */}
            <article className="group p-6 rounded-xl glass-gold border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI & Machine Learning</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Building intelligent applications with LLMs, natural language processing, computer vision, and predictive analytics. <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Message me</a> for a full walkthrough.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-200 border border-amber-500/20">OpenAI</span>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-200 border border-amber-500/20">LangChain</span>
                <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-200 border border-amber-500/20">Python</span>
              </div>
            </article>

            {/* Cloud Architecture */}
            <article className="group p-6 rounded-xl glass-dark border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cloud Architecture</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Designing and implementing scalable, secure cloud infrastructure on GCP, AWS, and Azure. Expert in serverless architectures and Kubernetes.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-foreground/70 border border-primary/20">GCP</span>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-foreground/70 border border-primary/20">AWS</span>
                <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-foreground/70 border border-primary/20">Azure</span>
              </div>
            </article>

            {/* Full-Stack Development */}
            <article className="group p-6 rounded-xl glass-emerald border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Full-Stack Development</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Crafting performant web and mobile applications with modern frameworks. Expertise in React, Next.js, Node.js, and TypeScript.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">React</span>
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">Node.js</span>
                <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">Clojure</span>
              </div>
            </article>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 border-t border-border">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Projects
            </h2>
            <p className="text-foreground max-w-xl text-balance">
              A selection of AI-powered and cloud-native projects I have built to solve real problems and create meaningful impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                title={project.title}
                description={project.description}
                url={project.url}
                tech={project.tech}
              />
            ))}
          </div>
        </section>

        {/* Collaborations Section */}
        <section id="collaborations" className="py-20 border-t border-border">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Work
            </h2>
            <p className="text-foreground max-w-xl text-balance">
              Companies and organizations I have had the privilege of collaborating with on cloud and AI initiatives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {collaborations.map((collab, index) => (
              <a
                key={index}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-lg glass-dark border-white/5 hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-slate-300 group-hover:text-primary transition-colors font-medium">
                  {collab.name}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </section>

        {/* Writing Section */}
        <section id="writing" className="py-20 border-t border-border">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Writing
            </h2>
            <p className="text-foreground max-w-xl text-balance">
              Thoughts on AI, cloud architecture, development, and building technology for impact.
            </p>
          </div>

          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>View all posts</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t border-border">
          <div className="max-w-xl">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Contact
            </h2>
            <p className="text-foreground mb-6 text-balance">
              Building something and need a senior technical mind in your corner? Message me directly on WhatsApp and we'll figure out if I can help.
            </p>
            
            <div className="space-y-3">
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message me on WhatsApp</span>
              </a>
              <a 
                href="mailto:aya@qwabi.co.za"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors mt-4"
              >
                <Mail className="w-4 h-4" />
                <span>aya@qwabi.co.za</span>
              </a>
              <p className="text-xs text-muted-foreground pt-2">
                Want a ballpark before you reach out?{' '}
                <Link to="/get-a-quote" className="text-primary hover:underline underline-offset-4">
                  See how I scope and price work
                </Link>.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Ayabonga Qwabi. AI Specialist & Cloud Architect.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link to="/technical-cofounder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              TaaS
            </Link>
            <Link to="/developers/eastern-cape" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              EC developers
            </Link>
            <a href="/llms.txt" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Brain className="w-3 h-3" />
              llms.txt
            </a>
            <a href="/pricing.md" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Calculator className="w-3 h-3" />
              Pricing
            </a>
            <a 
              href="https://github.com/ayabongaqwabi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/ayabongaqwabi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <SpeedInsights />
      <Analytics />
    </div>
    </>
  );
}

export default App;

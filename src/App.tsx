import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Menu, X, FileText, MessageCircle, Cloud, Brain, Code2 } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">AQ</span>
            
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
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-border shadow-xl">
                  {profileImages.map((img, index) => (
                    <img
                      key={index}
                      src={img.src}
                      alt={img.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
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
                  AI Specialist & Cloud Architect
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
                With 10 years of software engineering experience, I architect intelligent cloud solutions and build AI-powered applications that drive meaningful change across Africa and beyond.
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
            <p className="text-foreground max-w-xl text-balance">
              Core competencies spanning AI, cloud architecture, and full-stack development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI & Machine Learning */}
            <article className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI & Machine Learning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building intelligent applications with LLMs, natural language processing, computer vision, and predictive analytics. Specializing in OpenAI, TensorFlow, and custom ML pipelines.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">OpenAI</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">LangChain</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Python</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">TensorFlow</span>
              </div>
            </article>

            {/* Cloud Architecture */}
            <article className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cloud Architecture</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designing and implementing scalable, secure cloud infrastructure on GCP, AWS, and Azure. Expert in serverless architectures, Kubernetes, and infrastructure as code.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">GCP</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">AWS</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Azure</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Kubernetes</span>
              </div>
            </article>

            {/* Full-Stack Development */}
            <article className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Full-Stack Development</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crafting performant web and mobile applications with modern frameworks. Expertise in React, Next.js, Node.js, and TypeScript for end-to-end solutions.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">React</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Clojure</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Supabase</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Firebase</span>
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
                className="group flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {collab.name}
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
              Looking to build AI-powered solutions or architect your cloud infrastructure? Let&apos;s connect.
            </p>
            
            <div className="space-y-3">
              <a 
                href="mailto:aya@qwabi.co.za"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>aya@qwabi.co.za</span>
              </a>
              <a 
                href="https://www.qwabi.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>qwabi.co.za</span>
              </a>
              <a 
                href="https://wa.me/27603116777"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-4 py-2 mt-4 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
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
          <div className="flex items-center gap-6">
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
            <a 
              href="https://twitter.com/ayabongaqwabi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>

      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;

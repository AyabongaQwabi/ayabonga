import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Menu, X, FileText } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/next';

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

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-16">
            {/* Left Column - Name & Navigation */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Ayabonga Qwabi
                </h1>
                <p className="text-primary font-medium">
                  Cloud Engineer
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Queenstown, South Africa
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com/in/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/ayabongaqwabi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:aya@qwabi.co.za"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Column - Bio */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                I build cloud-based applications that address real challenges and support initiatives that spark positive social change. My work lies at the intersection of technology and community impact.
              </p>
              
              <p className="leading-relaxed text-muted-foreground">
                As a Cloud Engineering Specialist, I focus on designing systems that utilize modern cloud infrastructure to amplify meaningful causes. I specialize in <span className="text-foreground font-medium">React</span>, <span className="text-foreground font-medium">Node.js</span>, <span className="text-foreground font-medium">TypeScript</span>, and <span className="text-foreground font-medium">Google Cloud Platform</span> to build scalable, user-friendly applications.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                Currently focused on building tools that bridge the digital divide and empower individuals and organizations in achieving their goals. I believe in building to nurture, fostering an expressive, inclusive, and connected world.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 border-t border-border">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Projects
            </h2>
            <p className="text-foreground max-w-xl">
              A selection of projects I have built to solve real problems and create meaningful impact.
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
            <p className="text-foreground max-w-xl">
              Companies and organizations I have had the privilege of collaborating with.
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
            <p className="text-foreground max-w-xl">
              Thoughts on technology, development, and building for impact.
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
            <p className="text-foreground mb-6">
              Interested in working together or just want to say hello? Feel free to reach out.
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Ayabonga Qwabi
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

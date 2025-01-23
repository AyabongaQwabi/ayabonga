import { TestimonialCard } from "./TestimonialCard"
import { StatCard } from "./StatCard"
import { Trophy, Users, Star, Code } from "lucide-react"

export function TrustSignals() {
  return (
    <section className="py-20 relative bg-navy-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(236,72,153,0.1),transparent)] pointer-events-none"></div>
      <div className="container mx-auto px-6">
        <div className="space-y-16">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Years of Experience"
              value="8+"
              description="Building impactful solutions"
              icon={<Trophy className="w-8 h-8" />}
            />
            <StatCard
              title="Projects Delivered"
              value="50+"
              description="Across various industries"
              icon={<Star className="w-8 h-8" />}
            />
            <StatCard
              title="Client Satisfaction"
              value="98%"
              description="Based on client feedback"
              icon={<Users className="w-8 h-8" />}
            />
            <StatCard
              title="Code Commits"
              value="2.5k+"
              description="Open source contributions"
              icon={<Code className="w-8 h-8" />}
            />
          </div>

          {/* Testimonials */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TestimonialCard
                content="Ayabonga's expertise in cloud architecture and development has been instrumental in helping us deliver innovative solutions to our clients. His technical knowledge and ability to solve complex problems is exceptional."
                author="Humphrey Odilo"
                role="CEO"
                company="Tecla Digital"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tecla.jpg-UspgtfLgl0ZEWyMQWMlaMrQHrrZxEl.jpeg"
              />
              <TestimonialCard
                content="Working with Ayabonga has transformed our digital capabilities. His understanding of environmental tech solutions and cloud infrastructure has greatly improved our service delivery."
                author="Sphiwokuhle Bakeni"
                role="Director"
                company="Bakeni Public Services"
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bakeni.jpg-XTPrzUugbDoa85muNpoRd8oI6dlIHS.jpeg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


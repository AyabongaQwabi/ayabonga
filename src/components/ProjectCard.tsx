import type React from "react"
import { ExternalLink } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  url: string
  tech: string[]
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, url, tech }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {tech.map((t, index) => (
          <span 
            key={index} 
            className="px-2 py-1 text-xs font-mono bg-secondary text-muted-foreground rounded"
          >
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}

export default ProjectCard

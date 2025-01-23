import type React from "react"
import { useState } from "react"

interface ProjectCardProps {
  title: string
  description: string
  url: string
  image: string
  tech: string[]
  tagline: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, url, image, tech, tagline }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative h-[400px] w-full overflow-hidden rounded-lg transform transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform transition-all duration-500">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-300 mb-4">{description}</p>
          <p className="text-pink-500 font-semibold mb-4">{tagline}</p>

          <div
            className={`transform transition-all duration-500 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.map((t, index) => (
                <span key={index} className="px-3 py-1 bg-pink-600/20 rounded-full text-sm text-pink-400">
                  {t}
                </span>
              ))}
            </div>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-pink-600 rounded-full text-sm hover:bg-pink-700 transition-colors"
            >
              View Project
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard


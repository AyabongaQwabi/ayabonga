import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProblemSolutionCardProps {
  title: string
  description: string
  solutions: string[]
}

export function ProblemSolutionCard({ title, description, solutions }: ProblemSolutionCardProps) {
  return (
    <Card className="border-none bg-gray-950 hover:bg-gray-900 transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {solutions.map((solution, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-pink-600/10 text-pink-400 hover:bg-pink-600/20 transition-colors"
            >
              {solution}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


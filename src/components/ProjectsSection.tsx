import { FolderOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  name: string;
  description: string;
  urlDisplay: string;
  url: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <Card className="border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <FolderOpen className="w-5 h-5" />
            Recent Projects
          </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl border border-gray-300 hover:border-foreground/20 hover:bg-secondary/50 transition-all"
            >
              <h3 className="font-semibold text-foreground text-sm">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                {project.description}
              </p>
              <span className="inline-block px-2 py-1 bg-secondary text-xs text-muted-foreground font-mono rounded">
                {project.urlDisplay}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;

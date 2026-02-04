import { FolderOpen, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  name: string;
  description: string;
  url: string;
  urlDisplay: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <FolderOpen className="w-5 h-5" />
            Recent Projects
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl border border-border/50 hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                {project.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <ExternalLink className="w-3 h-3" />
                {project.urlDisplay}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsSection;

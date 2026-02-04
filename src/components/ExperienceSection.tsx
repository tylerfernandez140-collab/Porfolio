import { Briefcase } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  year: string;
  isCurrent?: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection = ({ experiences }: ExperienceSectionProps) => {
  return (
    <div>
      <h2 className="section-title">
        <Briefcase className="w-5 h-5" />
        Experience
      </h2>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-2">
              {exp.isCurrent ? (
                <div className="timeline-dot" />
              ) : (
                <div className="timeline-dot-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {exp.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;

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
    <div className="h-full flex flex-col p-5 bg-card rounded-lg border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1">
      <h2 className="section-title">
        <Briefcase className="w-5 h-5" />
        Experience
      </h2>

      <div className="space-y-3 flex-1 flex flex-col justify-between">
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

import { GraduationCap } from "lucide-react";

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface EducationSectionProps {
  education: Education[];
}

const EducationSection = ({ education }: EducationSectionProps) => {
  return (
    <div className="p-5 bg-card rounded-lg border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1">
      <h2 className="section-title">
        <GraduationCap className="w-5 h-5" />
        Education
      </h2>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-2">
              <div className="timeline-dot" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.school}</p>
            </div>
            <span className="text-sm text-muted-foreground shrink-0">
              {edu.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationSection;

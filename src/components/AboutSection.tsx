import { User } from "lucide-react";

interface AboutSectionProps {
  paragraphs: string[];
}

const AboutSection = ({ paragraphs }: AboutSectionProps) => {
  return (
    <div className="p-5 bg-card rounded-lg border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1">
      <h2 className="section-title">
        <User className="w-5 h-5" />
        About
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;

import { User } from "lucide-react";

interface AboutSectionProps {
  paragraphs: string[];
}

const AboutSection = ({ paragraphs }: AboutSectionProps) => {
  return (
    <div>
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

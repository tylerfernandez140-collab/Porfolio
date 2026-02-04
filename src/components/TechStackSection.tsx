import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TechCategory {
  name: string;
  items: string[];
}

interface TechStackSectionProps {
  categories: TechCategory[];
}

const TechStackSection = ({ categories }: TechStackSectionProps) => {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <Layers className="w-5 h-5" />
            Tech Stack
          </h2>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="tech-badge">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechStackSection;

import { Layers, ChevronRight } from "lucide-react";
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
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">
            <Layers className="w-5 h-5" />
            Tech Stack
          </h2>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-semibold text-foreground mb-2">
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FullTechStack = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({
    header: false,
    categories: false,
  });

  const fullTechStack = {
    categories: [
      {
        name: "Frontend",
        items: [
          "HTML", "CSS", "JavaScript", "Blade", "Next.js", 
          "React", "Vue.js", "Tailwind CSS", "Vite", "Figma"
        ],
      },
      {
        name: "Backend & Database",
        items: [
          "PHP", "Laravel", "Python", "Node.js",
          "MySQL", "PostgreSQL", "Supabase"
        ],
      },
      {
        name: "DevOps & Cloud",
        items: ["AWS", "Docker", "Vercel", "GitHub Actions"],
      },
      {
        name: "AI & Intelligent Systems",
        items: [
          "Gemini AI API", "Prompt Engineering", "Jotform AI", "OpenAI", 
          "AI-Driven Content"
        ],
      },
    ],
  };

  useEffect(() => {
    // Simultaneous fade-in animation on page load
    const timer = setTimeout(() => {
      setVisibleSections({
        header: true,
        categories: true,
      });
    }, 300); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 ease-out ${
          visibleSections.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-1.5 py-0.5 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-foreground mb-4">Full Tech Stack</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl">
          Comprehensive list of tools and technologies I use.
        </p>
        </div>

        {/* Tech Stack Categories */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all  duration-700 ease-out ${
          visibleSections.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {fullTechStack.categories.map((category) => (
            <div key={category.name} className="p-6 bg-card rounded-lg border border-gray-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-md font-medium hover:bg-secondary/80 transition-colors cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Ivan Fernandez. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default FullTechStack;

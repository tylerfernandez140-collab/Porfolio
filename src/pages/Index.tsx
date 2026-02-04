import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import BeyondCodingSection from "@/components/BeyondCodingSection";
import profilePhoto from "@/assets/profile-photo.jpg";

const Index = () => {
  // Portfolio data - customize this with your own information
  const portfolioData = {
    profile: {
      name: "Your Name",
      location: "Your City, Country",
      roles: ["Software Engineer", "Full-Stack Developer", "Creator"],
      avatarUrl: profilePhoto,
      email: "hello@example.com",
      calendlyUrl: "https://calendly.com/your-username",
      blogUrl: "https://blog.example.com",
      achievement: {
        text: "Featured Achievement 2024",
        link: "#",
      },
    },
    about: {
      paragraphs: [
        "I'm a full-stack software engineer specializing in developing solutions with JavaScript, TypeScript, and React. I work on projects including building modern web applications, mobile apps, and creating seamless user experiences.",
        "I've helped startups and businesses grow and streamline their processes through software solutions. I enjoy building products that make a real difference in people's lives.",
        "I'm passionate about clean code, performance optimization, and staying up-to-date with the latest technologies. Currently exploring AI integration and building intelligent applications.",
      ],
    },
    techStack: {
      categories: [
        {
          name: "Frontend",
          items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js"],
        },
        {
          name: "Backend",
          items: ["Node.js", "Python", "PostgreSQL", "MongoDB", "GraphQL"],
        },
        {
          name: "DevOps & Cloud",
          items: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Vercel"],
        },
      ],
    },
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Company",
        year: "2024",
        isCurrent: true,
      },
      {
        title: "Full-Stack Developer",
        company: "Startup Inc",
        year: "2023",
      },
      {
        title: "Software Developer",
        company: "Digital Agency",
        year: "2022",
      },
      {
        title: "Junior Developer",
        company: "Web Solutions",
        year: "2021",
      },
      {
        title: "Computer Science Degree",
        company: "University",
        year: "2020",
      },
    ],
    projects: [
      {
        name: "Project Alpha",
        description: "A modern web application for task management",
        url: "https://example.com",
        urlDisplay: "project-alpha.com",
      },
      {
        name: "Project Beta",
        description: "E-commerce platform with AI recommendations",
        url: "https://example.com",
        urlDisplay: "project-beta.com",
      },
      {
        name: "Project Gamma",
        description: "Real-time collaboration tool",
        url: "https://example.com",
        urlDisplay: "project-gamma.com",
      },
      {
        name: "Project Delta",
        description: "Mobile-first fitness tracking app",
        url: "https://example.com",
        urlDisplay: "project-delta.com",
      },
    ],
    beyondCoding: [
      "When not writing code, I focus on learning about emerging technologies, design principles, and startup culture.",
      "I share my knowledge through content creation, open-source contributions, and community building.",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Profile Header */}
        <ProfileHeader
          name={portfolioData.profile.name}
          location={portfolioData.profile.location}
          roles={portfolioData.profile.roles}
          avatarUrl={portfolioData.profile.avatarUrl}
          email={portfolioData.profile.email}
          calendlyUrl={portfolioData.profile.calendlyUrl}
          blogUrl={portfolioData.profile.blogUrl}
          achievement={portfolioData.profile.achievement}
        />

        {/* About Section */}
        <section className="mt-10">
          <AboutSection paragraphs={portfolioData.about.paragraphs} />
        </section>

        {/* Main Grid Layout */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tech Stack & Beyond Coding */}
          <div className="space-y-6">
            <TechStackSection categories={portfolioData.techStack.categories} />
            <BeyondCodingSection paragraphs={portfolioData.beyondCoding} />
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-6">
            <ExperienceSection experiences={portfolioData.experience} />
            <ProjectsSection projects={portfolioData.projects} />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {portfolioData.profile.name}. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;

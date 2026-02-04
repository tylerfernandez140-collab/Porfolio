import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ExperienceSection from "@/components/ExperienceSection";
import BeyondCodingSection from "@/components/BeyondCodingSection";
import ProjectsSection from "@/components/ProjectsSection";
import profilePhoto from "@/assets/profile-photo.jpg";

const Index = () => {
  const portfolioData = {
    profile: {
      name: "Your Name",
      location: "Your City, Country",
      roles: ["AI", "Software Engineer", "Content Creator"],
      avatarUrl: profilePhoto,
      email: "hello@example.com",
      calendlyUrl: "https://calendly.com/your-username",
      blogUrl: "https://blog.example.com",
      achievement: {
        text: "Featured Achievement 2025",
        link: "#",
      },
    },
    about: {
      paragraphs: [
        "I'm a full-stack software engineer specializing in developing solutions with JavaScript, Python, and PHP. I work on projects including building modern web applications, mobile apps, search engine optimization, digital marketing, and making code tutorials.",
        "I've helped startups and MSMEs grow and streamline their processes through software solutions. I've also built a community of over 200,000 developers sharing knowledge and mentorship.",
        "Lately, I've been diving deeper into the world of artificial intelligence, focusing on integrating AI tools and techniques into modern applications. My work now includes developing AI-powered solutions, creating intelligent applications, and leveraging generative AI to optimize development workflows and deliver cutting-edge technology.",
      ],
    },
    techStack: {
      categories: [
        {
          name: "Frontend",
          items: ["JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS"],
        },
        {
          name: "Backend",
          items: ["Node.js", "Python", "PHP", "Laravel", "PostgreSQL", "MongoDB"],
        },
        {
          name: "DevOps & Cloud",
          items: ["AWS", "Docker", "Kubernetes", "GitHub Actions"],
        },
      ],
    },
    experience: [
      {
        title: "Principal AI Engineer",
        company: "Standard Chartered",
        year: "2025",
        isCurrent: true,
      },
      {
        title: "AI Ops Engineer",
        company: "Centre of Excellence for GenAI, Cambridge",
        year: "2025",
      },
      {
        title: "Senior Full-Stack Developer",
        company: "Core Technology, Cambridge",
        year: "2024",
      },
      {
        title: "Software Engineering Lead",
        company: "PocketDevs",
        year: "2022",
      },
      {
        title: "Lead Application Developer",
        company: "Bluewind Asia",
        year: "2021",
      },
      {
        title: "Software Engineer",
        company: "GCM",
        year: "2020",
      },
      {
        title: "BS Information Technology",
        company: "University of San Carlos",
        year: "2019",
      },
      {
        title: "Hello World! 👋",
        company: "Wrote my first line of code",
        year: "2015",
      },
    ],
    beyondCoding: [
      "When not writing code, I focus on learning about emerging technologies, minimalism, and startup culture.",
      "I share my knowledge through content creation and community building.",
    ],
    projects: [
      {
        name: "CodeCred",
        description: "Online certifications for programmers",
        url: "https://codecred.dev",
        urlDisplay: "codecred.dev",
      },
      {
        name: "BASE404",
        description: "Online coding bootcamp",
        url: "https://base-404.com",
        urlDisplay: "base-404.com",
      },
      {
        name: "DIIN.PH",
        description: "AI-powered wardrobe assistant",
        url: "https://diin.ph",
        urlDisplay: "diin.ph",
      },
      {
        name: "DYNAMIS Workout Tracker",
        description: "AI-powered workout tracker",
        url: "https://dynamis.app",
        urlDisplay: "dynamis.app",
      },
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

        {/* Main Two-Column Layout */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - About & Tech Stack */}
          <div className="lg:col-span-3 space-y-6">
            <AboutSection paragraphs={portfolioData.about.paragraphs} />
            <TechStackSection categories={portfolioData.techStack.categories} />
          </div>

          {/* Right Column - Experience */}
          <div className="lg:col-span-2">
            <ExperienceSection experiences={portfolioData.experience} />
          </div>
        </section>

        {/* Bottom Section - Beyond Coding & Projects */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Beyond Coding */}
          <div className="lg:col-span-2">
            <BeyondCodingSection paragraphs={portfolioData.beyondCoding} />
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-3">
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

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import ProfileHeader from "@/components/ProfileHeader";

import AboutSection from "@/components/AboutSection";

import TechStackSection from "@/components/TechStackSection";

import ExperienceSection from "@/components/ExperienceSection";

import EducationSection from "@/components/EducationSection";

import BeyondCodingSection from "@/components/BeyondCodingSection";

import ProjectsSection from "@/components/ProjectsSection";
import AIChatBot from "@/components/AIChatBot";
import ScrollToTop from "@/components/ScrollToTop";

import profileLight from "@/assets/light-main.png";

import profileDark from "@/assets/dark-main.png";

import profileHoverLight from "@/assets/light-hover.png";

import profileHoverDark from "@/assets/dark-hover.png";

import profileClickLight from "@/assets/light-click.png";

import profileClickDark from "@/assets/dark-click.png";



const Index = () => {

  const navigate = useNavigate();

  const [showAll, setShowAll] = useState(false);

  const portfolioData = {

    profile: {

      name: "Ivan Fernandez",

      location: "Pangasinan, Philippines",

      roles: ["Student Freelancer", "Junior UI/UX Designer", "Aspiring Full-Stack Developer"],

      avatarUrl: {

        light: profileLight,

        dark: profileDark,

        hoverLight: profileHoverLight,

        hoverDark: profileHoverDark,

        clickLight: profileClickLight,

        clickDark: profileClickDark,

      },

      email: "fernandezivan140@gmail.com",

      calendlyUrl: "https://calendly.com/fernandezivan140/30min",

    },

    about: {

      paragraphs: [

        "I am a graduating student and freelance developer with experience in building web and mobile application projects. I focus on creating user-friendly and functional systems while applying UI/UX design principles and full-stack development skills.",

        "Through academic and personal projects, I have developed various web-based and application solutions. I am also capable of integrating artificial intelligence tools into applications using platforms like Jotform AI, Google Gemini, and OpenAI APIs.",

        "I continuously improve my development and design skills while exploring modern technologies and best practices. As a graduating student, I am motivated to gain real-world experience, contribute to meaningful projects, and grow into a professional full-stack developer.",

      ],

    },

    techStack: {

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

            "PHP", "Laravel", "Node.js", "Python", "PostgreSQL", 

            "MongoDB", "MySQL", "Supabase"

          ],

        },

        {

          name: "DevOps & Cloud",

          items: ["AWS", "Docker", "Vercel", "GitHub Actions"],

        },

      ],

    },

experience: [

  {

    title: "Web & AI Application Developer (Project-Based)",

    company: "Academic & Personal Projects",

    year: "2025 - Present",

    isCurrent: true,

  },

  {

    title: "Web & Application Project Developer",

    company: "Academic & Personal Projects",

    year: "2025 - 2026",

  },

  {

    title: "UI/UX Designer (Project-Based)",

    company: "Academic & Freelance Projects",

    year: "2024 - 2025",

  },

  {

    title: "Freelance Student Developer",

    company: "Self-Employed",

    year: "2024 - 2025",

  },

  {

    title: "System Prototype Developer",

    company: "School Projects",

    year: "2022 - 2024",

  },

],

    education: [

      {

        degree: "Bachelor of Science in Information Technology",

        school: "Pangasinan State University - Lingayen Campus",

        year: "2021 - 2026",

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

      

       

        />



        {/* Main Two-Column Layout */}

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

          {/* Top Row - About & Experience side by side */}

          <div className="lg:col-span-3">

            <AboutSection paragraphs={portfolioData.about.paragraphs} />

          </div>

          <div className="lg:col-span-2 mt-0">

            <ExperienceSection experiences={portfolioData.experience} />

          </div>

          

          {/* Bottom Row - Tech Stack, Education & Beyond Coding */}

          <div className="lg:col-span-3 flex flex-col">

            <TechStackSection 

            categories={portfolioData.techStack.categories} 

            className="flex-1"

            showAll={showAll}

            onToggle={() => navigate('/full-tech-stack')}

          />

          </div>

          

          <div className="lg:col-span-2 space-y-6">

            <EducationSection education={portfolioData.education} />

            <BeyondCodingSection paragraphs={portfolioData.beyondCoding} />

          </div>

        </section>



        {/* Bottom Section - Recent Projects Only */}

        <section className="mt-6">

          {/* Recent Projects */}

          <div>

            <ProjectsSection projects={portfolioData.projects} />

          </div>

        </section>



        {/* Footer */}

        <footer className="mt-12 pt-8 border-t border-border text-center">

          <p className="text-sm text-muted-foreground">

            © {new Date().getFullYear()} {portfolioData.profile.name}. All rights reserved.

          </p>

        </footer>

      </main>
      
      {/* Scroll to Top Arrow */}
      <ScrollToTop />
      
      {/* AI ChatBot */}
      <AIChatBot />
    </div>

  );

};



export default Index;


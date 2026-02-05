"use client";

import { Skiper39, CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import { HeroSection } from "@/components/blocks/hero-section-1";
import { PatternText } from "@/components/ui/pattern-text";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/modem-animated-footer";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  NotepadTextDashed,
} from "lucide-react";

export default function Home() {
  const socialLinks = [
    {
      icon: <Twitter className="w-6 h-6" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Github className="w-6 h-6" />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:contact@resumegpt.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Pricing", href: "/" },
    { label: "Templates", href: "/" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];

  return (
    <>
      <div>
        <HeroSection />
      </div>
      <div className="relative">
        <div className="">
          <Footer
            brandName="SessionStory"
            brandDescription="AI-powered resume builder for modern professionals. Create stunning resumes optimized for ATS systems."
            socialLinks={socialLinks}
            navLinks={navLinks}
            creatorName="Yash Verma"
            creatorUrl="https://yashverma.tech"
            // brandIcon={
            //   <NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
            // }
          />
        </div>
        {/* <div className="absolute bottom-0 h-[90vh] w-full">
          <CrowdCanvas src="https://skiper-ui.com/images/peeps/all-peeps.png" />
        </div> */}
      </div>
    </>
  );
}

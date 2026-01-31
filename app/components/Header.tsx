"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/context/language-context";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const params = useParams();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [lastScrollY]);

  if (!mounted) return null;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { type: "scroll", id: "about", label: t("header.about") },
    { type: "scroll", id: "experience", label: t("header.experience") },
    { type: "scroll", id: "skills", label: t("header.skills") },
    { type: "scroll", id: "services", label: t("header.services") },
    { type: "scroll", id: "education", label: t("header.education") },
    { type: "link", href: `/${language}/blog`, label: t("nav.blog") },
    { type: "scroll", id: "contact", label: t("header.contact") },
  ];

  return (
    <header
      className={`
        fixed w-full z-50 transition-all duration-300
        ${isVisible ? "top-0" : "-top-20"}
        ${theme === "dark" ? "bg-gray-900/95" : "bg-white/95"}
        backdrop-blur-sm shadow-md
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between sm:justify-center items-center">
          <ul className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-6 sm:flex-wrap sm:justify-center">
            {navItems.map((item) => (
              <li key={item.id || item.href} className="flex-shrink-0">
                {item.type === "link" ? (
                  <Link
                    href={item.href!}
                    className={`
                      text-sm sm:text-base whitespace-nowrap transition-colors duration-300
                      ${
                        theme === "dark"
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-800 hover:text-blue-600"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.id!)}
                    className={`
                      text-sm sm:text-base whitespace-nowrap transition-colors duration-300
                      ${
                        activeSection === item.id
                          ? "text-blue-600 dark:text-blue-400"
                          : theme === "dark"
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-800 hover:text-blue-600"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile menu button if needed */}
          </div>
        </div>
      </nav>
    </header>
  );
}

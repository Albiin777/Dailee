import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Sidebar from "./Sidebar.jsx";
import BackgroundPattern from "./BackgroundPattern.jsx";
import HeroSection from "./HeroSection.jsx";
import NotebookEntry from "./NotebookEntry.jsx";
import CalendarSection from "./CalendarSection.jsx";
import MonthlyInsights from "./MonthlyInsights.jsx";
import { uploadImageToCloudinary } from "../cloudinary.js";
import { auth, db, signInWithGoogle, signOutUser } from "../firebase.js";

const emptyEntry = {
  technical: {
    title: "",
    description: "",
    screenshotName: "",
    screenshotUrl: "",
    cloudinaryPublicId: "",
  },
  nonTechnical: {
    title: "",
    description: "",
    screenshotName: "",
    screenshotUrl: "",
    cloudinaryPublicId: "",
  },
};

const navSections = [
  { label: "Home", id: "home" },
  { label: "Entry", id: "entry" },
  { label: "Insights", id: "summary" },
  { label: "Calendar", id: "calendar" },
];

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(auth));
  const [entries, setEntries] = useState(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      return JSON.parse(localStorage.getItem("evenlog-entries")) || {};
    } catch {
      return {};
    }
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const saved = localStorage.getItem("evenlog-theme");
    if (saved) {
      return saved;
    }
    return "light";
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("evenlog-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("evenlog-entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (!db || !user) {
      return undefined;
    }

    const entriesRef = collection(db, "users", user.uid, "entries");

    return onSnapshot(
      entriesRef,
      (snapshot) => {
        const firestoreEntries = {};
        snapshot.forEach((entryDoc) => {
          firestoreEntries[entryDoc.id] = entryDoc.data();
        });
        setEntries(firestoreEntries);
      },
      (error) => {
        console.error("Could not load Firestore entries:", error);
      }
    );
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const currentSection = navSections.reduce((active, section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          return section;
        }
        return active;
      }, navSections[0]);

      setActiveNav(currentSection.label);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const revealElements = document.querySelectorAll("main section");
    revealElements.forEach((element) => {
      element.classList.add("reveal-section");
    });

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entriesList) => {
        entriesList.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
  }, []);

  const todayKey = getTodayKey();
  const todayEntry = entries[todayKey] || emptyEntry;

  const handleSaveTodayEntry = async (entry) => {
    setEntries((current) => ({
      ...current,
      [todayKey]: entry,
    }));

    if (!db) {
      throw new Error("Firestore is not configured. Entry was saved locally only.");
    }

    if (!user) {
      throw new Error("Sign in first to save this entry to Firestore.");
    }

    await setDoc(
      doc(db, "users", user.uid, "entries", todayKey),
      {
        ...entry,
        dateKey: todayKey,
        userId: user.uid,
        userEmail: user.email || "",
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  return (
    <div className="relative min-h-screen bg-white text-black dark:bg-[#0b0b0b] dark:text-white">
      <Sidebar
        isOpen={sidebarOpen}
        activeItem={activeNav}
        onSelect={setActiveNav}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        user={user}
        authLoading={authLoading}
        onSignIn={signInWithGoogle}
        onSignOut={signOutUser}
      />
      <main className="relative min-h-screen w-full">
        <BackgroundPattern />
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-4 pt-10 md:px-10 lg:px-12">
          <HeroSection />
          <div className="mt-36 lg:mt-44">
            <NotebookEntry
              todayEntry={todayEntry}
              onSaveEntry={handleSaveTodayEntry}
              onUploadImage={uploadImageToCloudinary}
            />
          </div>
          <MonthlyInsights entries={entries} />
          <CalendarSection entries={entries} />
          <footer className="mt-20 border-t border-gray-200 py-4 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
            <div className="flex flex-col items-center justify-between gap-1 sm:flex-row">
              <p>© {new Date().getFullYear()} Dailee. All rights reserved.</p>
              <p>
                Created with{" "}
                <span className="inline-block min-w-4 text-center text-base leading-none text-black dark:text-white">
                  ♥
                </span>{" "}
                by{" "}
                <a
                  href="https://www.albiin.me"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-black transition hover:opacity-70 dark:text-white"
                >
                  Albin
                </a>
                .
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Layout;

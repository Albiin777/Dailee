import { useEffect, useRef, useState } from "react";
import {
  FiHome,
  FiEdit3,
  FiBarChart2,
  FiCalendar,
  FiChevronDown,
  FiLogIn,
  FiX,
  FiMenu,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import daileeLogoBlack from "../assets/Dailee-logo-black.png";
import daileeLogoWhite from "../assets/Dailee-logo-white.png";

const navItems = [
  { label: "Home", href: "#home", icon: FiHome },
  { label: "Entry", href: "#entry", icon: FiEdit3 },
  { label: "Insights", href: "#summary", icon: FiBarChart2 },
  { label: "Calendar", href: "#calendar", icon: FiCalendar },
];

function Sidebar({
  isOpen,
  activeItem,
  onSelect,
  onClose,
  onToggle,
  theme,
  onToggleTheme,
  user,
  authLoading,
  onSignIn,
  onSignOut,
}) {
  const headerRef = useRef(null);
  const [authError, setAuthError] = useState("");

  const handleAuthClick = async () => {
    setAuthError("");
    try {
      if (user) {
        await onSignOut();
      } else {
        await onSignIn();
      }
      onClose();
    } catch (error) {
      setAuthError(error.message || "Authentication failed.");
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 bg-transparent">
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-6 md:px-10 lg:px-12">
          <div className="rounded-[28px] border border-gray-200/30 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0f0f0f]/20 dark:shadow-sm">
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <a
                  href="#home"
                  onClick={onClose}
                  className="flex items-center gap-1.5 pl-2 transition hover:opacity-80 sm:gap-1.5 sm:pl-5"
                  aria-label="Go to home section"
                >
                  <img
                    src={theme === "dark" ? daileeLogoWhite : daileeLogoBlack}
                    alt="Dailee"
                    className="h-7 w-auto object-contain sm:h-6"
                  />
                  <span className="text-lg font-semibold leading-none tracking-wide text-black dark:text-white sm:text-xl">
                    Dailee
                  </span>
                </a>
              </div>

              <nav
                className={`absolute right-0 top-[58px] w-[240px] rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition backdrop-blur-md dark:border-white/10 dark:bg-[#121212]/95 lg:absolute lg:left-1/2 lg:right-auto lg:top-1/2 lg:flex lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent ${
                  isOpen ? "opacity-100" : "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100"
                }`}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.label === activeItem;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        onSelect(item.label);
                        onClose();
                      }}
                      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold leading-none transition lg:py-2 lg:font-medium ${
                        isActive
                          ? "border border-gray-200 bg-gray-100 text-black shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white lg:border-transparent lg:bg-transparent lg:text-black lg:shadow-none lg:dark:bg-transparent lg:dark:text-white"
                          : "border border-transparent text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon className="text-base" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-200 pt-3 dark:border-white/10 lg:hidden">
                  <div className="grid w-full gap-2">
                    {user && (
                      <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-[#1f1f1f] dark:text-white">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.displayName?.[0] || user.email?.[0] || "U"
                          )}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p className="truncate text-sm font-semibold text-black dark:text-white">
                            {user.displayName || "Signed in"}
                          </p>
                          {user.email && (
                            <p className="max-w-full truncate text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-transparent px-3 py-2 text-sm font-medium leading-none text-gray-700 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                      onClick={onToggleTheme}
                    >
                      {theme === "dark" ? <FiSun /> : <FiMoon />}
                      {theme === "dark" ? "Light" : "Dark"}
                    </button>
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold leading-none text-black transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                      onClick={handleAuthClick}
                      disabled={authLoading}
                    >
                      {user ? <FiChevronDown /> : <FiLogIn />}
                      {authLoading
                        ? "Checking"
                        : user
                          ? "Sign out"
                          : "Sign in"}
                    </button>
                    {authError && (
                      <p className="px-1 text-xs text-gray-500 dark:text-gray-400">
                        {authError}
                      </p>
                    )}
                  </div>
                </div>
              </nav>

              <div className="hidden items-center gap-2 lg:flex">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-transparent px-3 py-1.5 text-sm font-medium leading-none text-gray-700 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                  onClick={onToggleTheme}
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
                <button
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-transparent px-3 py-1.5 text-sm leading-none transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                  onClick={handleAuthClick}
                  disabled={authLoading}
                  title={user ? "Sign out" : "Sign in"}
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-[#1f1f1f] dark:text-white">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : user ? (
                      user.displayName?.[0] || user.email?.[0] || "U"
                    ) : (
                      <FiLogIn />
                    )}
                  </div>
                  <span className="max-w-28 truncate font-medium leading-none">
                    {authLoading
                      ? "Checking"
                      : user
                        ? user.displayName || user.email || "Account"
                        : "Sign in"}
                  </span>
                  {user && <FiChevronDown className="text-gray-500" />}
                </button>
              </div>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-transparent text-gray-600 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10 lg:hidden"
                onClick={onToggle}
                aria-label="Toggle menu"
              >
                {isOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Sidebar;

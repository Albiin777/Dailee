import { FiPlus, FiArrowRight } from "react-icons/fi";

function HeroSection() {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(today);

  return (
    <section id="home" className="relative flex min-h-[calc(80vh-64px)] flex-col items-center justify-center text-center">
      <div className="max-w-3xl">
        <h1 className="landing-title text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl">
          Growth,
          <br />
          Documented.
        </h1>
        <p className="landing-copy mt-6 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            A quiet space to record your progress, reflect on your journey, and see how far you've come.
        </p>
        <div className="landing-action mt-14 flex items-center justify-center sm:mt-10">
          <a
            href="#entry"
            className="flex items-center gap-3 rounded-full bg-[#242424] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#333] dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <FiPlus />
            Add Today&apos;s Progress
            <FiArrowRight />
          </a>
        </div>
        <div className="landing-date mt-10 text-sm font-semibold text-gray-600 dark:text-gray-300 sm:mt-6">
          {formattedDate}
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {weekday}
          </div>
        </div>
        <div className="landing-scroll mt-12 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-300 dark:text-gray-600 sm:mt-10">
          <span>Scroll</span>
          <span className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

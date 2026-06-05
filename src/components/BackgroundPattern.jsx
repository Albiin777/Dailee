function BackgroundPattern() {
  const today = new Date();
  const dayNumber = String(today.getDate()).padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="relative mx-auto h-full w-full max-w-[1400px] px-6 md:px-10 lg:px-12">
        <div className="absolute left-1/2 top-[190px] -translate-x-1/2 text-[300px] font-extrabold tracking-tight text-gray-200 opacity-60 dark:text-white dark:opacity-[0.055] sm:top-20 sm:text-[420px] sm:text-black sm:opacity-[0.035] sm:dark:text-white sm:dark:opacity-[0.07]">
          {dayNumber}
        </div>

        <div
          className="absolute -left-10 top-36 h-40 w-40 opacity-[0.035] dark:opacity-[0.06] sm:left-0 sm:top-4 sm:h-56 sm:w-56 sm:opacity-[0.08] sm:dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.35) 2.5px, transparent 3px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div
          className="absolute -left-6 top-[360px] h-44 w-44 opacity-[0.035] dark:opacity-[0.06] sm:left-12 sm:top-64 sm:h-64 sm:w-64 sm:opacity-[0.08] sm:dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.25) 2px, transparent 2.5px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div
          className="absolute -right-14 top-44 h-40 w-40 opacity-[0.03] dark:opacity-[0.055] sm:right-6 sm:top-16 sm:h-56 sm:w-56 sm:opacity-[0.08] sm:dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.28) 2px, transparent 2.5px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div
          className="absolute -right-10 top-[390px] h-44 w-44 opacity-[0.03] dark:opacity-[0.055] sm:right-10 sm:top-64 sm:h-64 sm:w-64 sm:opacity-[0.08] sm:dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.2) 1.5px, transparent 2.5px)",
            backgroundSize: "12px 12px",
          }}
        />

        <div
          className="absolute left-2 top-52 h-40 w-40 opacity-[0.025] dark:opacity-[0.05] sm:left-8 sm:top-10 sm:h-56 sm:w-56 sm:opacity-[0.06] sm:dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          className="absolute right-0 top-[500px] h-40 w-40 opacity-[0.025] dark:opacity-[0.05] sm:right-4 sm:top-[420px] sm:h-56 sm:w-56 sm:opacity-[0.06] sm:dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div
          className="absolute left-4 top-[120px] h-28 w-28 opacity-[0.045] dark:opacity-[0.07] sm:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.4) 1.4px, transparent 2px)",
            backgroundSize: "11px 11px",
          }}
        />

        <div
          className="absolute right-5 top-[310px] h-24 w-24 opacity-[0.04] dark:opacity-[0.065] sm:hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div
          className="absolute left-1/2 top-[440px] h-32 w-32 -translate-x-1/2 rounded-full border border-black/5 dark:border-white/10 sm:hidden"
        />
      </div>
    </div>
  );
}

export default BackgroundPattern;

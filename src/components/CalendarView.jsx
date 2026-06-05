const eventsByDay = {
  1: ["Login Page"],
  2: ["Firebase Setup"],
  3: ["Auth Flow", "Bug Fixes"],
  4: ["UI Fixes"],
  5: ["API Integration"],
  8: ["Database Design"],
  10: ["State Management"],
  12: ["Deployment"],
  15: ["Performance Optimization"],
  17: ["Refactor Code"],
  19: ["Testing"],
  22: ["UI/UX Improvement"],
  24: ["Security Enhancements"],
  29: ["Documentation"],
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarCell({ day, isToday }) {
  const events = eventsByDay[day] || [];

  return (
    <div className="flex min-h-[120px] flex-col gap-2 border border-gray-200 bg-white p-3 text-xs transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#121212] dark:hover:bg-[#1a1a1a]">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            isToday
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {day}
        </span>
      </div>
      <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
        {events.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span className="mt-[5px] h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarView() {
  const totalDays = 30;
  const firstDayIndex = 1;
  const blanks = Array.from({ length: firstDayIndex });
  const days = Array.from({ length: totalDays }, (_, index) => index + 1);

  return (
    <section id="calendar">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">June 2026</h2>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#1a1a1a]">
            &lt;
          </button>
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#1a1a1a]">
            Today
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#1a1a1a]">
            &gt;
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[900px] rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-7 gap-2 border-b border-gray-200 pb-3 text-xs font-semibold text-gray-400 dark:border-white/10 dark:text-gray-500">
            {weekDays.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {blanks.map((_, index) => (
              <div key={`blank-${index}`} className="min-h-[120px]" />
            ))}
            {days.map((day) => (
              <CalendarCell key={day} day={day} isToday={day === 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalendarView;

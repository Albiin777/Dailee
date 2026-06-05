import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiImage, FiX } from "react-icons/fi";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const emptyEntry = {
  technical: { title: "", description: "", screenshotName: "", screenshotUrl: "" },
  nonTechnical: {
    title: "",
    description: "",
    screenshotName: "",
    screenshotUrl: "",
  },
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatHeading(date) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatSelectedDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function hasEntryData(entry) {
  return Boolean(
    entry?.technical?.title ||
      entry?.technical?.description ||
      entry?.technical?.screenshotName ||
      entry?.technical?.screenshotUrl ||
      entry?.nonTechnical?.title ||
      entry?.nonTechnical?.description ||
      entry?.nonTechnical?.screenshotName ||
      entry?.nonTechnical?.screenshotUrl
  );
}

function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = firstDay.getDay();

  return [
    ...Array.from({ length: leadingDays }, (_, index) => ({
      key: `empty-${index}`,
      date: null,
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return {
        key: formatDateKey(date),
        date,
      };
    }),
  ];
}

function EntryPreview({ label, entry, onOpenImage }) {
  const hasContent =
    entry?.title || entry?.description || entry?.screenshotName || entry?.screenshotUrl;
  const imageAlt = entry?.screenshotName || `${label} uploaded image`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-[#fcfcfc] p-4 dark:border-white/10 dark:bg-[#101010]">
      <div className="text-sm font-semibold text-black dark:text-white">
        {label}
      </div>
      {hasContent ? (
        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {entry.title && (
            <p className="font-medium text-black dark:text-white">{entry.title}</p>
          )}
          {entry.description && <p>{entry.description}</p>}
          {entry.screenshotUrl && (
            <button
              type="button"
              onClick={() =>
                onOpenImage({
                  src: entry.screenshotUrl,
                  alt: imageAlt,
                  name: entry.screenshotName || "Uploaded image",
                })
              }
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-white/10 dark:bg-[#171717] dark:focus:ring-white/40"
              aria-label={`Open ${imageAlt}`}
            >
              <img
                src={entry.screenshotUrl}
                alt={imageAlt}
                className="max-h-48 w-full object-contain"
                loading="lazy"
              />
            </button>
          )}
          {(entry.screenshotName || entry.screenshotUrl) && (
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FiImage />
              <span>{entry.screenshotName || "Uploaded image"}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          No entry saved.
        </p>
      )}
    </div>
  );
}

function CalendarSection({ entries }) {
  const todayKey = formatDateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [openImage, setOpenImage] = useState(null);
  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth]
  );
  const selectedEntry = entries[selectedDate] || emptyEntry;
  const savedCount = Object.values(entries).filter(hasEntryData).length;

  useEffect(() => {
    if (!openImage) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openImage]);

  const changeMonth = (offset) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  return (
    <section id="calendar" className="mt-28 scroll-mt-32">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Calendar
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {savedCount} saved {savedCount === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
          >
            <FiChevronLeft />
          </button>
          <div className="min-w-40 text-center text-sm font-semibold text-black dark:text-white">
            {formatHeading(visibleMonth)}
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-black/5 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[24px] border border-gray-200 bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212] sm:rounded-[28px] sm:p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold text-gray-500 dark:text-gray-400 sm:gap-2 sm:text-xs">
            {weekdays.map((day) => (
              <div key={day} className="py-1.5 sm:py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 sm:mt-2 sm:gap-2">
            {calendarDays.map(({ key, date }) => {
              if (!date) {
                return <div key={key} className="aspect-square" />;
              }

              const dateKey = formatDateKey(date);
              const entry = entries[dateKey];
              const hasData = hasEntryData(entry);
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === todayKey;

              return (
                <button
                  type="button"
                  key={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative flex aspect-square min-h-0 flex-col rounded-lg border p-1 text-left transition sm:min-h-14 sm:rounded-2xl sm:p-2 ${
                    isSelected
                      ? "border-gray-500 bg-gray-100 text-black shadow-inner dark:border-white/25 dark:bg-[#1d1d1d] dark:text-white"
                      : "border-gray-200 bg-[#fcfcfc] text-black hover:border-gray-500 dark:border-white/10 dark:bg-[#101010] dark:text-white dark:hover:border-white/40"
                  }`}
                >
                  <span className="text-xs font-semibold leading-none sm:text-sm">
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span className="mt-auto text-[0.45rem] font-semibold uppercase leading-none sm:text-[0.65rem]">
                      Today
                    </span>
                  )}
                  {hasData && (
                    <span
                      className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full sm:bottom-2 sm:right-2 sm:h-2.5 sm:w-2.5 ${
                        isSelected ? "bg-gray-600 dark:bg-white" : "bg-emerald-500"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212]">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Selected Day
          </p>
          <h3 className="mt-1 text-lg font-semibold text-black dark:text-white">
            {formatSelectedDate(selectedDate)}
          </h3>
          <div className="mt-5 space-y-3">
            <EntryPreview
              label="Technical"
              entry={selectedEntry.technical}
              onOpenImage={setOpenImage}
            />
            <EntryPreview
              label="Non-Technical"
              entry={selectedEntry.nonTechnical}
              onOpenImage={setOpenImage}
            />
          </div>
        </aside>
      </div>

      {openImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={openImage.name}
          onClick={() => setOpenImage(null)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-[94vw] items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenImage(null)}
              className="absolute -right-2 -top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white dark:bg-[#161616] dark:text-white dark:hover:bg-[#222]"
              aria-label="Close image preview"
            >
              <FiX />
            </button>
            <img
              src={openImage.src}
              alt={openImage.alt}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default CalendarSection;

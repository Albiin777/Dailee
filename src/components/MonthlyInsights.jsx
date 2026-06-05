import { useEffect, useMemo, useState } from "react";
import { FiCpu, FiDownload, FiFileText } from "react-icons/fi";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const stopWords = new Set([
  "about",
  "again",
  "also",
  "because",
  "been",
  "being",
  "build",
  "created",
  "daily",
  "done",
  "entry",
  "from",
  "have",
  "into",
  "made",
  "more",
  "need",
  "progress",
  "project",
  "that",
  "this",
  "today",
  "used",
  "using",
  "were",
  "what",
  "when",
  "with",
  "work",
  "worked",
  "your",
]);

function hasText(entry) {
  return Boolean(entry?.title?.trim() || entry?.description?.trim());
}

function getEntryText(entry) {
  return [entry?.title, entry?.description].filter(Boolean).join(" ");
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthTiming(year, month, now) {
  const daysInMonth = getDaysInMonth(year, month);
  const isCurrent = year === now.getFullYear() && month === now.getMonth();
  const isPast =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth());
  const elapsedDays = isCurrent ? now.getDate() : isPast ? daysInMonth : 0;

  return {
    daysInMonth,
    elapsedDays,
    remainingDays: isCurrent ? daysInMonth - now.getDate() : 0,
    isCurrent,
  };
}

function getTopTerms(textBlocks, limit = 5) {
  const counts = textBlocks
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^-+|-+$/g, ""))
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}

function buildSummary(entries, selectedMonth, selectedYear, now) {
  const monthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
  const monthEntries = Object.entries(entries)
    .filter(([dateKey]) => dateKey.startsWith(monthPrefix))
    .sort(([a], [b]) => a.localeCompare(b));
  const activeDays = monthEntries.filter(([, entry]) => {
    return hasText(entry.technical) || hasText(entry.nonTechnical);
  });
  const technicalDays = monthEntries.filter(([, entry]) => hasText(entry.technical));
  const nonTechnicalDays = monthEntries.filter(([, entry]) =>
    hasText(entry.nonTechnical)
  );
  const timing = getMonthTiming(selectedYear, selectedMonth, now);
  const basisDays = timing.elapsedDays || timing.daysInMonth;
  const consistencyRate = basisDays ? activeDays.length / basisDays : 0;
  const consistencyLabel =
    activeDays.length === 0
      ? "No activity yet"
      : consistencyRate >= 0.7
        ? "Consistent"
        : consistencyRate >= 0.4
          ? "Building rhythm"
          : "Getting started";
  const textBlocks = monthEntries.flatMap(([, entry]) => [
    getEntryText(entry.technical),
    getEntryText(entry.nonTechnical),
  ]);
  const focusTerms = getTopTerms(textBlocks);
  const highlights = activeDays.slice(0, 5).map(([dateKey, entry]) => ({
    dateKey,
    technical: entry.technical?.title || entry.technical?.description || "",
    nonTechnical:
      entry.nonTechnical?.title || entry.nonTechnical?.description || "",
  }));

  return {
    activeDays,
    technicalDays,
    nonTechnicalDays,
    focusTerms,
    highlights,
    timing,
    consistencyRate,
    consistencyLabel,
  };
}

function createLocalInsight(summary, periodLabel) {
  if (!summary.activeDays.length) {
    return {
      title: "No insight yet",
      summary: `No activity has been saved for ${periodLabel}. Add a few entries to generate a meaningful report.`,
      takeaways: [
        "Start by saving short daily notes.",
        "Include both what you built and what you learned.",
        "Use specific titles so the report can identify real patterns.",
      ],
      nextStep: "Save at least three days of entries for a useful monthly insight.",
      source: "Local analysis",
    };
  }

  const focus = summary.focusTerms[0]?.term || "your recorded activities";
  const balance =
    summary.technicalDays.length > summary.nonTechnicalDays.length
      ? "technical activity is stronger than reflection"
      : summary.nonTechnicalDays.length > summary.technicalDays.length
        ? "reflection is stronger than technical activity"
        : "technical and reflection work are balanced";
  const timingContext = summary.timing.isCurrent
    ? `${summary.activeDays.length} of ${summary.timing.elapsedDays} elapsed days`
    : `${summary.activeDays.length} of ${summary.timing.daysInMonth} days`;

  return {
    title: `${periodLabel}: ${summary.consistencyLabel}`,
    summary: `You logged activity on ${timingContext}. The month currently shows ${summary.consistencyLabel.toLowerCase()} with ${balance}. The clearest theme from your notes is ${focus}.`,
    takeaways: [
      `Consistency is based on elapsed days, so ${summary.activeDays.length}/${summary.timing.elapsedDays || summary.timing.daysInMonth} days is the real progress signal.`,
      `Main focus detected: ${focus}.`,
      balance.charAt(0).toUpperCase() + balance.slice(1) + ".",
    ],
    nextStep:
      summary.nonTechnicalDays.length < summary.technicalDays.length
        ? "Add a short reflection about planning, communication, or decisions after technical work."
        : "Keep writing concrete titles and outcomes so future reports become sharper.",
    source: "Local analysis",
  };
}

function buildGeminiPrompt({ periodLabel, summary }) {
  const entries = summary.highlights
    .map((item) => {
      return [
        `Date: ${item.dateKey}`,
        item.technical ? `Technical: ${item.technical}` : "",
        item.nonTechnical ? `Non-technical: ${item.nonTechnical}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return `Analyze this personal diary/monthly activity data for ${periodLabel}.

Context:
- Active days: ${summary.activeDays.length}
- Elapsed days considered: ${summary.timing.elapsedDays || summary.timing.daysInMonth}
- Remaining days in month: ${summary.timing.remainingDays}
- Technical entries: ${summary.technicalDays.length}
- Non-technical entries: ${summary.nonTechnicalDays.length}

Entries:
${entries || "No entries"}

Return only JSON with this exact shape:
{
  "title": "short report title",
  "summary": "one concise paragraph, not generic, based on the actual entries",
  "takeaways": ["3 short practical insights"],
  "nextStep": "one specific next step"
}`;
}

async function generateGeminiInsight({ periodLabel, summary }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildGeminiPrompt({ periodLabel, summary }) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    let message = `Gemini request failed with status ${response.status}.`;
    try {
      const errorData = await response.json();
      message = errorData?.error?.message || message;
    } catch {
      message = `${message} Check your API key, model name, and quota.`;
    }
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);
  return { ...parsed, source: "Gemini Generated" };
}

function escapePdfText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxLength = 78) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

function createPdfBlob({ periodLabel, summary, insight }) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 46;
  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };
  const regularFontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  );
  const boldFontId = addObject(
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
  );
  const commands = [];
  const color = (r, g, b) => `${r} ${g} ${b} rg`;
  const rect = (x, y, w, h, r, g, b) => {
    commands.push(`${color(r, g, b)} ${x} ${y} ${w} ${h} re f`);
  };
  const text = (value, x, y, options = {}) => {
    const font = options.bold ? "F2" : "F1";
    const size = options.size || 11;
    const rgb = options.rgb || [0.08, 0.08, 0.08];
    commands.push(
      `BT ${color(...rgb)} /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`
    );
  };
  const paragraph = (value, x, y, maxChars, options = {}) => {
    let nextY = y;
    wrapText(value, maxChars).forEach((line) => {
      text(line, x, nextY, options);
      nextY -= options.lineHeight || 15;
    });
    return nextY;
  };

  rect(0, pageHeight - 112, pageWidth, 112, 0.06, 0.06, 0.06);
  text("DAILEE", margin, pageHeight - 46, {
    bold: true,
    size: 13,
    rgb: [1, 1, 1],
  });
  text("Monthly Insights Report", margin, pageHeight - 76, {
    bold: true,
    size: 24,
    rgb: [1, 1, 1],
  });
  text(periodLabel, pageWidth - 168, pageHeight - 76, {
    bold: true,
    size: 12,
    rgb: [0.86, 0.86, 0.86],
  });

  let y = pageHeight - 148;
  const metrics = [
    ["Active days", summary.activeDays.length],
    ["Elapsed days", summary.timing.elapsedDays || summary.timing.daysInMonth],
    ["Consistency", `${Math.round(summary.consistencyRate * 100)}%`],
    ["Remaining", summary.timing.remainingDays],
  ];

  metrics.forEach(([label, value], index) => {
    const x = margin + index * 130;
    rect(x, y - 58, 118, 58, 0.96, 0.96, 0.95);
    text(label, x + 12, y - 22, { size: 9, rgb: [0.38, 0.38, 0.38] });
    text(String(value), x + 12, y - 45, { bold: true, size: 18 });
  });

  y -= 94;
  text(insight.title, margin, y, { bold: true, size: 17 });
  y -= 26;
  rect(margin, y - 96, pageWidth - margin * 2, 108, 0.97, 0.98, 0.98);
  y = paragraph(insight.summary, margin + 16, y - 18, 74, {
    size: 10.5,
    lineHeight: 15,
    rgb: [0.18, 0.18, 0.18],
  });

  y -= 38;
  text("Key Takeaways", margin, y, { bold: true, size: 14 });
  y -= 22;
  insight.takeaways.slice(0, 3).forEach((item) => {
    y = paragraph(`- ${item}`, margin + 8, y, 76, {
      size: 10.5,
      lineHeight: 15,
      rgb: [0.22, 0.22, 0.22],
    });
    y -= 5;
  });

  y -= 16;
  text("Next Step", margin, y, { bold: true, size: 14 });
  y -= 22;
  y = paragraph(insight.nextStep, margin, y, 78, {
    size: 10.5,
    lineHeight: 15,
    rgb: [0.22, 0.22, 0.22],
  });

  y -= 28;
  text("Activity Highlights", margin, y, { bold: true, size: 14 });
  y -= 22;
  if (summary.highlights.length) {
    summary.highlights.forEach((item) => {
      text(item.dateKey, margin, y, { bold: true, size: 10.5 });
      y -= 16;
      if (item.technical) {
        y = paragraph(`Technical: ${item.technical}`, margin + 12, y, 76, {
          size: 10,
          lineHeight: 14,
        });
      }
      if (item.nonTechnical) {
        y = paragraph(`Non-technical: ${item.nonTechnical}`, margin + 12, y, 76, {
          size: 10,
          lineHeight: 14,
        });
      }
      y -= 10;
    });
  } else {
    text("No saved activity for this period.", margin, y, { size: 10.5 });
  }

  text(`${insight.source}`, margin, 28, {
    size: 9,
    rgb: [0.48, 0.48, 0.48],
  });

  const stream = `${commands.join("\n")}\n`;
  const contentId = addObject(
    `<< /Length ${stream.length} >>\nstream\n${stream}endstream`
  );
  const pageId = addObject(
    `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`
  );
  const pagesId = addObject(`<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  objects[pageId - 1] = objects[pageId - 1].replace(
    "/Parent 0 0 R",
    `/Parent ${pagesId} 0 R`
  );

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function MonthlyInsights({ entries }) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [aiInsight, setAiInsight] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const summary = useMemo(
    () => buildSummary(entries, selectedMonth, selectedYear, now),
    [entries, selectedMonth, selectedYear, now]
  );
  const years = useMemo(() => {
    const entryYears = Object.keys(entries).map((dateKey) => Number(dateKey.slice(0, 4)));
    const min = Math.min(now.getFullYear(), ...entryYears);
    const max = Math.max(now.getFullYear(), ...entryYears);
    return Array.from({ length: max - min + 1 }, (_, index) => min + index);
  }, [entries, now]);
  const periodLabel = `${monthNames[selectedMonth]} ${selectedYear}`;
  const localInsight = useMemo(
    () => createLocalInsight(summary, periodLabel),
    [summary, periodLabel]
  );
  const insight = aiInsight || localInsight;

  useEffect(() => {
    setAiInsight(null);
    setAiError("");
  }, [periodLabel, summary.activeDays.length]);

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setAiError("");
    try {
      const generated = await generateGeminiInsight({ periodLabel, summary });
      setAiInsight(generated);
    } catch (error) {
      setAiError(error.message || "Could not generate Gemini insight.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    const blob = createPdfBlob({ periodLabel, summary, insight });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dailee-insights-${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="summary" className="mt-28 scroll-mt-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
            Monthly Report
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-black dark:text-white">
            Insights Summary
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none dark:border-white/10 dark:bg-[#121212] dark:text-white dark:focus:border-white"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(Number(event.target.value))}
            aria-label="Select month"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none dark:border-white/10 dark:bg-[#121212] dark:text-white dark:focus:border-white"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
            aria-label="Select year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-black/5 disabled:opacity-60 dark:border-white/10 dark:bg-[#121212] dark:text-white dark:hover:bg-white/10"
          >
            <FiCpu />
            {isGenerating ? "Generating" : "Gemini"}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1f1f1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#333] dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <FiDownload />
            PDF
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212]">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl text-black dark:bg-white/10 dark:text-white">
            <FiFileText />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              {periodLabel}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {summary.timing.isCurrent
                ? `${summary.timing.remainingDays} days remaining this month.`
                : "Report uses the full selected month."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Active days", summary.activeDays.length],
            ["Elapsed days", summary.timing.elapsedDays || summary.timing.daysInMonth],
            ["Consistency", `${Math.round(summary.consistencyRate * 100)}%`],
            ["Status", summary.consistencyLabel],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-200 bg-[#fcfcfc] p-4 dark:border-white/10 dark:bg-[#101010]"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="mt-2 text-xl font-semibold text-black dark:text-white">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fcfcfc] p-5 dark:border-white/10 dark:bg-[#101010]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {insight.source}
              </p>
              <h4 className="mt-2 text-xl font-semibold text-black dark:text-white">
                {insight.title}
              </h4>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {insight.summary}
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold text-black dark:text-white">
                Key takeaways
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {insight.takeaways.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-white/10 dark:bg-[#121212] dark:text-gray-300">
              <span className="font-semibold text-black dark:text-white">
                Next step:
              </span>{" "}
              {insight.nextStep}
            </div>
          </div>
          {aiError && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {aiError}
            </p>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-[#fcfcfc] p-4 dark:border-white/10 dark:bg-[#101010]">
          <h4 className="text-sm font-semibold text-black dark:text-white">
            Activity Highlights
          </h4>
          {summary.highlights.length ? (
            <div className="mt-3 space-y-3">
              {summary.highlights.map((item) => (
                <div
                  key={item.dateKey}
                  className="border-t border-gray-200 pt-3 first:border-t-0 first:pt-0 dark:border-white/10"
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {item.dateKey}
                  </p>
                  {item.technical && (
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Technical: {item.technical}
                    </p>
                  )}
                  {item.nonTechnical && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      Non-technical: {item.nonTechnical}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Save entries during this period to generate highlights.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MonthlyInsights;

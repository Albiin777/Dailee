import { useEffect, useId, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

function hasEntryContent(entry) {
  return Boolean(
    entry?.title?.trim() ||
      entry?.description?.trim() ||
      entry?.screenshotName ||
      entry?.screenshotUrl
  );
}

function EntryForm({ title, value, onSave, onUploadImage }) {
  const inputId = useId();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    screenshotName: "",
    screenshotUrl: "",
    cloudinaryPublicId: "",
  });
  const [isEditing, setIsEditing] = useState(!hasEntryContent(value));
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const isSaved = hasEntryContent(value);

  useEffect(() => {
    setFormData({
      title: value?.title || "",
      description: value?.description || "",
      screenshotName: value?.screenshotName || "",
      screenshotUrl: value?.screenshotUrl || "",
      cloudinaryPublicId: value?.cloudinaryPublicId || "",
    });
    setIsEditing(!hasEntryContent(value));
  }, [value]);

  const handleFileChange = async (event) => {
    if (!isEditing) {
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setFileError("");

    try {
      const uploadedImage = await onUploadImage(file);
      setFormData((current) => ({
        ...current,
        screenshotName: file.name,
        screenshotUrl: uploadedImage.url,
        cloudinaryPublicId: uploadedImage.publicId,
      }));
    } catch (error) {
      setFormData((current) => ({
        ...current,
        screenshotName: file.name,
      }));
      setFileError(error.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");
    setSaveStatus("");
    try {
      await onSave({
        ...formData,
        savedAt: new Date().toISOString(),
      });
      setSaveStatus("Saved to Firestore");
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message || "Could not save to Firestore.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="space-y-5 rounded-2xl bg-transparent p-2 sm:p-4"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
        <span className="h-6 w-6 rounded-md border border-gray-200 dark:border-white/15" />
        {title}
      </div>

      <div>
        <label
          htmlFor={`${inputId}-title`}
          className="text-sm font-semibold text-gray-500 dark:text-gray-400"
        >
          Title
        </label>
        <input
          id={`${inputId}-title`}
          value={formData.title}
          disabled={!isEditing}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/10 dark:bg-[#121212] dark:text-white dark:focus:border-white dark:disabled:bg-white/5 dark:disabled:text-gray-400"
          placeholder={title === "Technical" ? "What did you work on?" : "What did you do?"}
        />
      </div>

      <div>
        <label
          htmlFor={`${inputId}-desc`}
          className="text-sm font-semibold text-gray-500 dark:text-gray-400"
        >
          Description
        </label>
        <textarea
          id={`${inputId}-desc`}
          rows="3"
          value={formData.description}
          disabled={!isEditing}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 dark:border-white/10 dark:bg-[#121212] dark:text-white dark:focus:border-white dark:disabled:bg-white/5 dark:disabled:text-gray-400"
          placeholder={
            title === "Technical"
              ? "Describe your progress, learnings or challenges..."
              : "Reflect on soft skills, leadership, or personal growth..."
          }
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Images</label>
        <label
          htmlFor={`${inputId}-file`}
          className={`mt-2 flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 transition dark:border-white/15 dark:text-gray-400 ${
            isEditing
              ? "cursor-pointer hover:border-black dark:hover:border-white"
              : "cursor-default bg-gray-50 dark:bg-white/5"
          }`}
        >
          <FiUploadCloud className="text-lg" />
          <span>Drag and drop or click to upload</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {isUploading
              ? "Uploading to Cloudinary..."
              : formData.screenshotName || "No file selected"}
          </span>
        </label>
        <input
          id={`${inputId}-file`}
          type="file"
          className="sr-only"
          accept="image/*"
          disabled={!isEditing}
          onChange={handleFileChange}
        />
        {formData.screenshotUrl && (
          <a
            href={formData.screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs font-semibold text-gray-600 underline underline-offset-4 transition hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            View uploaded image
          </a>
        )}
        {fileError && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {fileError}
          </p>
        )}
      </div>

      {isSaved && !isEditing ? (
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Saved
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5 dark:border-white/10 dark:bg-[#121212] dark:text-white dark:hover:bg-white/10"
          >
            Edit
          </button>
        </div>
      ) : (
        <button
          disabled={isUploading || isSaving}
          className="w-full rounded-xl bg-[#1f1f1f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isUploading
            ? "Uploading Image..."
            : isSaving
              ? "Saving..."
              : isSaved
                ? "Update Entry"
                : "Save Entry"}
        </button>
      )}
      {saveStatus && (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {saveStatus}
        </p>
      )}
      {saveError && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{saveError}</p>
      )}
    </form>
  );
}

function NotebookEntry({ todayEntry, onSaveEntry, onUploadImage }) {
  const saveEntryType = async (type, data) => {
    await onSaveEntry({
      ...todayEntry,
      [type]: data,
    });
  };

  return (
    <section id="entry" className="scroll-mt-32">
      <h2 className="text-2xl font-semibold text-black dark:text-white">Today&apos;s Entry</h2>
      <div className="relative mt-5 w-full overflow-hidden rounded-[30px] border-2 border-[#222] bg-[#fbfbf7] p-4 shadow-[0_18px_42px_rgba(20,20,18,0.12)] dark:border-white/50 dark:bg-[#171717] dark:shadow-[0_18px_44px_rgba(0,0,0,0.55)] sm:p-5">
        <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/80 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:border-white/10 dark:shadow-none" />
        <div className="pointer-events-none absolute left-1/2 top-5 bottom-5 hidden w-px -translate-x-1/2 bg-black/15 md:block dark:bg-white/20" />
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative rounded-[22px] border border-black/10 bg-[#fffffc] p-4 shadow-[0_8px_18px_rgba(20,20,18,0.055),inset_-12px_0_18px_rgba(20,20,18,0.03)] md:rounded-r-none md:border-r-0 md:pr-8 dark:border-white/10 dark:bg-[#101010] dark:shadow-[inset_-12px_0_20px_rgba(0,0,0,0.32)] sm:p-5">
            <EntryForm
              title="Technical"
              value={todayEntry.technical}
              onSave={(data) => saveEntryType("technical", data)}
              onUploadImage={onUploadImage}
            />
          </div>
          <div className="relative mt-4 rounded-[22px] border border-black/10 bg-[#fffffc] p-4 shadow-[0_8px_18px_rgba(20,20,18,0.055),inset_12px_0_18px_rgba(20,20,18,0.03)] md:mt-0 md:rounded-l-none md:border-l-0 md:pl-8 dark:border-white/10 dark:bg-[#101010] dark:shadow-[inset_12px_0_20px_rgba(0,0,0,0.32)] sm:p-5">
            <EntryForm
              title="Non-Technical"
              value={todayEntry.nonTechnical}
              onSave={(data) => saveEntryType("nonTechnical", data)}
              onUploadImage={onUploadImage}
            />
          </div>
        </div>

        <div className="absolute left-1/2 top-8 bottom-8 hidden w-10 -translate-x-1/2 flex-col items-center justify-between md:flex">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="relative flex h-7 w-9 items-center justify-center">
              <span className="absolute left-1/2 h-6 w-5 -translate-x-1/2 rounded-full border-2 border-[#303030] bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.16)] dark:border-white/70" />
              <span className="absolute left-0 h-2.5 w-2.5 rounded-full border-2 border-[#303030] bg-[#fffffc] dark:border-white/70 dark:bg-[#101010]" />
              <span className="absolute right-0 h-2.5 w-2.5 rounded-full border-2 border-[#303030] bg-[#fffffc] dark:border-white/70 dark:bg-[#101010]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NotebookEntry;

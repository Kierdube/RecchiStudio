"use client";

import { Monitor, Smartphone, X } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";

import type { EmailPreviewDocument, EmailPreviewId } from "@/lib/send-email-previews";

type SendResult =
  | {
      ok: boolean;
      to: string;
      results: Array<{ label: string; ok: boolean; error?: string }>;
    }
  | { error: string };

const TAB_ORDER: EmailPreviewId[] = ["contact", "order", "quote"];

function EmailFrame({
  title,
  html,
  width,
  icon: Icon,
  deviceLabel,
}: {
  title: string;
  html: string;
  width: number;
  icon: typeof Monitor;
  deviceLabel: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
        <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
        {deviceLabel}
        <span className="text-xs font-normal text-zinc-500">({width}px)</span>
      </div>
      <div
        className="mx-auto w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm"
        style={{ maxWidth: width }}
      >
        <iframe
          title={title}
          srcDoc={html}
          className="block h-[min(72vh,760px)] w-full bg-white"
          sandbox=""
        />
      </div>
    </div>
  );
}

export function EmailPreviewPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<EmailPreviewDocument[]>([]);
  const [activeId, setActiveId] = useState<EmailPreviewId>("contact");
  const [sendPending, startSend] = useTransition();
  const [sendResult, setSendResult] = useState<SendResult | null>(null);

  const loadPreviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/email-previews");
      const json = (await res.json()) as { previews?: EmailPreviewDocument[]; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load previews");
        return;
      }
      const next = json.previews ?? [];
      setPreviews(next);
      if (next.length > 0) {
        setActiveId((current) => (next.some((preview) => preview.id === current) ? current : next[0].id));
      }
    } catch {
      setError("Could not load previews (network error)");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadPreviews();
  }, [open, loadPreviews]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activePreview = previews.find((preview) => preview.id === activeId) ?? previews[0];

  function sendTestEmails() {
    setSendResult(null);
    startSend(async () => {
      try {
        const res = await fetch("/api/admin/test-emails", { method: "POST" });
        const json = (await res.json()) as SendResult;
        if (!res.ok) {
          setSendResult({ error: "error" in json ? json.error : "Could not send test emails" });
          return;
        }
        setSendResult(json);
      } catch {
        setSendResult({ error: "Could not send test emails (network error)" });
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Preview emails
        </button>
        <button
          type="button"
          onClick={sendTestEmails}
          disabled={sendPending}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
        >
          {sendPending ? "Sending…" : "Send test emails"}
        </button>
      </div>

      {sendResult ? (
        <div className="mt-3 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700">
          {"error" in sendResult ? (
            <p className="text-red-700">{sendResult.error}</p>
          ) : (
            <div className="space-y-1">
              <p>
                Sent to <span className="font-semibold">{sendResult.to}</span>
                {sendResult.ok ? " — all succeeded." : " — some failed."}
              </p>
              <ul className="space-y-0.5">
                {sendResult.results.map((item) => (
                  <li key={item.label} className={item.ok ? "text-zinc-700" : "text-red-700"}>
                    {item.label}: {item.ok ? "OK" : item.error ?? "Failed"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/50 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-preview-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close preview"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-zinc-200 bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id="email-preview-title" className="text-lg font-semibold text-zinc-900">
                  Email preview
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Sample data with your saved copy. Save changes below, then click Refresh.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => void loadPreviews()}
                  disabled={loading}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
                >
                  {loading ? "Refreshing…" : "Refresh"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {error ? (
              <div className="px-4 py-8 text-sm text-red-700 sm:px-6">{error}</div>
            ) : loading && previews.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-zinc-600 sm:px-6">Loading previews…</div>
            ) : activePreview ? (
              <>
                <div className="shrink-0 border-b border-zinc-100 px-4 pt-3 sm:px-6">
                  <div className="flex flex-wrap gap-2" role="tablist" aria-label="Email type">
                    {TAB_ORDER.map((id) => {
                      const preview = previews.find((item) => item.id === id);
                      if (!preview) return null;
                      const selected = activeId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setActiveId(id)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                            selected
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          {preview.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 pb-3 text-sm text-zinc-600">
                    <span className="font-medium text-zinc-800">Subject:</span> {activePreview.subject}
                  </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    <EmailFrame
                      title={`${activePreview.label} — desktop`}
                      html={activePreview.html}
                      width={640}
                      icon={Monitor}
                      deviceLabel="Desktop"
                    />
                    <EmailFrame
                      title={`${activePreview.label} — mobile`}
                      html={activePreview.html}
                      width={375}
                      icon={Smartphone}
                      deviceLabel="Mobile"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { requestDatasheetCode, verifyDatasheetCode } from "@/lib/datasheet.functions";

const field =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";

function forceDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noreferrer";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function DatasheetDownload({
  productSlug,
  productName,
  brochureUrl,
  access,
}: {
  productSlug: string;
  productName: string;
  brochureUrl: string;
  access: "public" | "gated";
}) {
  const requestCode = useServerFn(requestDatasheetCode);
  const verifyCode = useServerFn(verifyDatasheetCode);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"details" | "code" | "ready">("details");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [verifiedUrl, setVerifiedUrl] = useState<string | null>(null);
  const [delivered, setDelivered] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filename = `${productSlug}-datasheet.pdf`;

  if (access !== "gated") {
    return (
      <Button variant="outline" size="lg" onClick={() => forceDownload(brochureUrl, filename)}>
        <Download className="size-4" /> Download datasheet
      </Button>
    );
  }

  const sendCode = async (form: FormData) => {
    setBusy(true);
    setError(null);
    try {
      const result = await requestCode({
        data: {
          productSlug,
          email: String(form.get("email") ?? ""),
          name: String(form.get("name") ?? ""),
          company: String(form.get("company") ?? ""),
          phone: String(form.get("phone") ?? ""),
        },
      });
      if (!result.gated) {
        forceDownload(result.url, filename);
        setOpen(false);
        return;
      }
      setRequestId(result.requestId);
      setDelivered(result.delivered);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async (code: string) => {
    if (!requestId) return;
    setBusy(true);
    setError(null);
    try {
      const { url } = await verifyCode({ data: { requestId, code } });
      setVerifiedUrl(url);
      setStep("ready");
      forceDownload(url, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setStep("details");
          setRequestId(null);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <Lock className="size-4" /> Download datasheet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {step === "code" ? "Enter your verification code" : "Protected datasheet"}
          </DialogTitle>
          <DialogDescription>
            {step === "code"
              ? `We sent a 6-digit code to your email for ${productName}. It expires in 10 minutes.`
              : `The ${productName} datasheet is available after a quick email verification.`}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendCode(new FormData(event.currentTarget));
            }}
            className="grid gap-3"
          >
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">Work email *</span>
              <input name="email" type="email" required className={field} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Name</span>
                <input name="name" className={field} />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Company</span>
                <input name="company" className={field} />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">Phone</span>
              <input name="phone" className={field} />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="hero" size="lg" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              Send verification code
            </Button>
          </form>
        )}

        {step === "code" && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const code = String(new FormData(event.currentTarget).get("code") ?? "");
              void confirmCode(code);
            }}
            className="grid gap-3"
          >
            {!delivered && (
              <p className="rounded-md border border-border bg-surface p-3 text-xs text-muted-foreground">
                Email delivery is still being activated for this site, so the code may not arrive
                yet. Please contact our sales team and we'll send the datasheet directly.
              </p>
            )}
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-foreground">6-digit code</span>
              <input
                name="code"
                inputMode="numeric"
                maxLength={6}
                required
                className={`${field} tracking-[0.5em]`}
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" variant="hero" size="lg" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />} Verify &amp; download
            </Button>
          </form>
        )}

        {step === "ready" && (
          <div className="grid gap-3 py-2 text-center">
            <ShieldCheck className="mx-auto size-10 text-accent" />
            <p className="text-sm text-muted-foreground">
              Verified — your download has started. If it didn't, use the button below.
            </p>
            <Button
              variant="hero"
              onClick={() => verifiedUrl && forceDownload(verifiedUrl, filename)}
            >
              <Download className="size-4" /> Download again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

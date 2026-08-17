import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitQuoteRequest } from "@/lib/quote.functions";

const REQUIREMENTS = [
  "Request a quote",
  "Product enquiry",
  "Solution / project discussion",
  "Technical support",
  "Partnership",
  "Feedback",
];

const field =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";

export function QuoteDialog({
  trigger,
  productInterest,
  source = "website",
  title = "Talk to our team",
  description = "Share your requirement and a CoreIP specialist will get back to you within one business day.",
}: {
  trigger: ReactNode;
  productInterest?: string;
  source?: string;
  title?: string;
  description?: string;
}) {
  const submit = useServerFn(submitQuoteRequest);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await submit({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          company: String(form.get("company") ?? ""),
          phone: String(form.get("phone") ?? ""),
          country: String(form.get("country") ?? ""),
          requirement_type: String(form.get("requirement") ?? ""),
          product_interest: productInterest,
          message: String(form.get("message") ?? ""),
          source,
        },
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
          setDone(false);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-12 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
              Thank you — we've received your request
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team will contact you shortly using the details you provided.
            </p>
            <Button className="mt-6" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Full name *</span>
                  <input name="name" required maxLength={120} className={field} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Work email *</span>
                  <input name="email" type="email" required maxLength={200} className={field} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Company</span>
                  <input name="company" maxLength={160} className={field} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Phone</span>
                  <input name="phone" maxLength={40} className={field} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">Country</span>
                  <input name="country" maxLength={80} className={field} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-foreground">I need help with</span>
                  <select name="requirement" className={field} defaultValue={REQUIREMENTS[0]}>
                    {REQUIREMENTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {productInterest && (
                <p className="text-xs text-muted-foreground">
                  Product of interest: <span className="text-foreground">{productInterest}</span>
                </p>
              )}
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">
                  Your requirement / query / feedback *
                </span>
                <textarea name="message" required rows={4} maxLength={2000} className={field} />
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" size="lg" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                Submit request
              </Button>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree that CoreIP may contact you about your enquiry.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

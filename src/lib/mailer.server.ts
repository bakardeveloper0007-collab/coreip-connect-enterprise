/**
 * Thin wrapper around the project's transactional email sender.
 *
 * The sender module is created by Lovable's email scaffolding once an email
 * domain is configured. Until then this resolves to `false` so calling code can
 * degrade gracefully instead of crashing.
 */
export async function sendOtpMail(
  to: string,
  code: string,
  productName: string,
): Promise<boolean> {
  const spec = "./email-templates/send-email";
  try {
    const mod = (await import(/* @vite-ignore */ spec)) as {
      sendTemplateEmail?: (
        template: string,
        to: string,
        opts: { templateData?: Record<string, unknown>; idempotencyKey?: string },
      ) => Promise<{ sent: boolean }>;
    };
    if (!mod.sendTemplateEmail) return false;
    const result = await mod.sendTemplateEmail("datasheet-otp", to, {
      templateData: { code, productName },
    });
    return result.sent;
  } catch (error) {
    console.error("OTP email not sent — email sending is not configured yet", error);
    return false;
  }
}

// Submits data to Netlify Forms — a free, built-in form backend.
// Netlify scans the static HTML forms in public/forms.html at deploy
// time to register each form name, then this function submits real
// entries to it via a normal POST. No server code required.
// You'll see submissions (and get email notifications, if you turn
// those on) in your Netlify site dashboard under "Forms".

export async function submitToNetlifyForm(
  formName: string,
  data: Record<string, string | number | undefined>,
): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName });
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) body.append(key, String(value));
  }

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to submit — please try again in a moment.");
  }
}

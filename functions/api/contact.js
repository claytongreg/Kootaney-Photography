export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const body = await request.json();
    const { name, email, kind, when, message, turnstileToken } = body;

    if (!name || !email || !turnstileToken) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers,
      });
    }

    const tsForm = new FormData();
    tsForm.append("secret", env.TURNSTILE_SECRET_KEY);
    tsForm.append("response", turnstileToken);
    tsForm.append("remoteip", request.headers.get("CF-Connecting-IP"));

    const tsResult = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: tsForm }
    );
    const tsData = await tsResult.json();

    if (!tsData.success) {
      return new Response(JSON.stringify({ error: "Verification failed" }), {
        status: 403,
        headers,
      });
    }

    const emailHtml = `
      <h2>New inquiry from ${name}</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:8px 16px 8px 0;color:#888;">Name</td><td style="padding:8px 0;">${name}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#888;">Email</td><td style="padding:8px 0;">${email}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#888;">Type</td><td style="padding:8px 0;">${kind || "—"}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#888;">When & Where</td><td style="padding:8px 0;">${when || "—"}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${message || "—"}</td></tr>
      </table>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "Kootenay Photography <onboarding@resend.dev>",
        to: [env.TO_EMAIL || "Gregclayton@gmail.com"],
        reply_to: email,
        subject: `New inquiry from ${name} — ${kind || "General"}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      return new Response(JSON.stringify({ error: "Email send failed", detail: err }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers,
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

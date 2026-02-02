export default async function handler(req, res) {
  // Minimal API route (optional). Capture works even if this fails.
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const lead = req.body || {};
    if (!lead.name || !lead.phone || !lead.city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("LEAD_RECEIVED", lead);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.log("API_ERROR", e);
    return res.status(500).json({ error: "Server error" });
  }
}

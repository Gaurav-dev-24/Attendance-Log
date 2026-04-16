const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzfCB4CQ-vN2jITzDTse2OBNVproL_LSmX3UyIQ0OlW12QnHCu9zBbXUjkmN7gc-P3I/exec";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();

    // Try to parse as JSON, otherwise return as text
    try {
      const jsonData = JSON.parse(data);
      return res.status(200).json(jsonData);
    } catch {
      return res.status(200).json({ status: "success", message: data });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}

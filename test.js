const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzfCB4CQ-vN2jITzDTse2OBNVproL_LSmX3UyIQ0OlW12QnHCu9zBbXUjkmN7gc-P3I/exec";

async function test() {
  try {
    console.log("Sending request...");
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "testing", name: "Test User From Backend Test" }),
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzfCB4CQ-vN2jITzDTse2OBNVproL_LSmX3UyIQ0OlW12QnHCu9zBbXUjkmN7gc-P3I/exec";

async function test() {
  try {
    console.log("Sending request...");
    const payloadStr = JSON.stringify({ role: "ieee_faculty", contactNo: "1234567890", name: "Prof. Parimal Patel" });
    const url = `${APPS_SCRIPT_URL}?payload=${encodeURIComponent(payloadStr)}`;
    const response = await fetch(url, {
      method: "GET"
    });
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();

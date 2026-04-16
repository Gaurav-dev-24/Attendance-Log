const SHEET_ID = "14GjQsdF6fiC0_r0w0WdwGPWySLhqX-LHE9tm2ozTbVg";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const role = data.role;
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName("Attendance_Log");

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Single row format — blank jahan applicable nahi
    const row = [
      timestamp,                          // A - Timestamp
      getRoleLabel(role),                 // B - Role
      data.name || "",                    // C - Name
      data.membershipId || "",            // D - Membership ID
      data.enrollmentNo || "",            // E - Enrollment No
      data.email || "",                   // F - Email
      data.contactNo || "",              // G - Contact No
      data.college || "",                 // H - College
      data.branch || "",                  // I - Branch
      data.semester || "",                // J - Semester
      data.division || "",                // K - Division
      data.designation || "",             // L - Designation
    ];

    sheet.appendRow(row);
    return response({ status: "success" });

  } catch (err) {
    return response({ status: "error", message: err.toString() });
  }
}

function doOptions(e) {
  // Handle preflight requests for CORS
  return HtmlService.createHtmlOutput();
}

function getRoleLabel(role) {
  const labels = {
    "ieee_student": "IEEE Student",
    "non_ieee_student": "Non-IEEE Student",
    "ieee_faculty": "IEEE Faculty Advisor",
    "sou_professor": "SOU Professor",
    "visitor": "Visitor"
  };
  return labels[role] || role;
}

function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

const SHEET_ID = "14GjQsdF6fiC0_r0w0WdwGPWySLhqX-LHE9tm2ozTbVg";
const LOG_SHEET_NAME = "Attendance_Log";

function doPost(e) {
  try {
    // Log incoming request
    Logger.log("doPost called");
    Logger.log("Raw data: " + e.postData.contents);

    const data = JSON.parse(e.postData.contents);
    Logger.log("Parsed data: " + JSON.stringify(data));

    const role = data.role;

    // Open spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    Logger.log("Spreadsheet opened");

    // Get sheet
    const sheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (!sheet) {
      Logger.log("ERROR: Sheet not found. Available sheets: " + ss.getSheets().map(s => s.getName()).join(", "));
      return response({ status: "error", message: "Sheet 'Attendance_Log' not found" });
    }
    Logger.log("Sheet found: " + LOG_SHEET_NAME);

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    Logger.log("Timestamp: " + timestamp);

    const row = [
      timestamp,
      getRoleLabel(role),
      data.name || "",
      data.membershipId || "",
      data.enrollmentNo || "",
      data.email || "",
      data.contactNo || "",
      data.college || "",
      data.branch || "",
      data.semester || "",
      data.division || "",
      data.designation || "",
    ];

    Logger.log("Row to append: " + JSON.stringify(row));
    sheet.appendRow(row);
    Logger.log("Row appended successfully");

    return response({ status: "success", message: "Data recorded" });

  } catch (err) {
    Logger.log("ERROR: " + err.toString());
    Logger.log("Stack: " + err.stack);
    return response({ status: "error", message: err.toString() });
  }
}

function doOptions(e) {
  return HtmlService.createHtmlOutput("");
}

function doGet(e) {
  return response({ status: "ok", message: "Apps Script is running" });
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

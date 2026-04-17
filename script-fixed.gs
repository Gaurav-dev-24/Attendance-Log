const SHEET_ID = "14GjQsdF6fiC0_r0w0WdwGPWySLhqX-LHE9tm2ozTbVg";
const VALIDATION_SHEET_ID = "1s4ICEH0vC978mCvcOUJMw83VRXGuQeYs647V4JBheik";
const MASTER_SHEET_NAME = "Master-Attendance-Log";

const ROLE_SHEET_MAP = {
  "ieee_student": "IEEE-Student-Log",
  "non_ieee_student": "Non-IEEE-Student-Log",
  "ieee_faculty": "IEEE-Faculty-Log",
  "sou_professor": "Sou-Professor-Log",
  "visitor": "Visitor-Log"
};

function isMembershipIdValid(searchId) {
  if (!searchId) return false;
  const validationSS = SpreadsheetApp.openById(VALIDATION_SHEET_ID);
  const allSheets = validationSS.getSheets();
  
  // Search through every tab in the validation document
  for (let i = 0; i < allSheets.length; i++) {
    const dataRange = allSheets[i].getDataRange().getValues();
    const allData = dataRange.flat().map(String);
    if (allData.includes(String(searchId))) {
      return true;
    }
  }
  return false;
}

function processRequest(data) {
  // === VALIDATION SECTION ===
  if (data.role === "ieee_student") {
    if (!isMembershipIdValid(data.membershipId)) {
      return response({ status: "error", message: "Invalid IEEE Membership ID. You are not found in the valid members sheet." });
    }
  } else if (data.role === "ieee_faculty") {
    if (!isMembershipIdValid(data.contactNo)) {
      return response({ status: "error", message: "Invalid Contact Number. You are not found in the faculty sheet." });
    }
  }
  // ==========================

  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // Master sheet logic
  let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!masterSheet) {
    // If master sheet is not found, attempt to use old name or return error
    let oldSheet = ss.getSheetByName("Attendance_Log");
    if(oldSheet) {
        masterSheet = oldSheet;
    } else {
        return response({ status: "error", message: "Master sheet not found! Please create 'Master-Attendance-Log' sheet." });
    }
  }

  // Get specific role sheet if it exists
  const roleSheetName = ROLE_SHEET_MAP[data.role];
  let roleSheet = null;
  if (roleSheetName) {
    roleSheet = ss.getSheetByName(roleSheetName);
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const masterRow = [
    timestamp,
    getRoleLabel(data.role),
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

  let roleRow = [];
  if (data.role === "ieee_student") {
    roleRow = [timestamp, getRoleLabel(data.role), data.name || "", data.membershipId || ""];
  } else if (data.role === "non_ieee_student") {
    roleRow = [timestamp, getRoleLabel(data.role), data.name || "", data.enrollmentNo || "", data.email || "", data.contactNo || "", data.college || "", data.branch || "", data.semester || "", data.division || ""];
  } else if (data.role === "ieee_faculty") {
    roleRow = [timestamp, getRoleLabel(data.role), data.name || "", data.contactNo || ""];
  } else if (data.role === "sou_professor") {
    roleRow = [timestamp, getRoleLabel(data.role), data.name || "", data.email || "", data.contactNo || "", data.branch || ""];
  } else if (data.role === "visitor") {
    roleRow = [timestamp, getRoleLabel(data.role), data.name || "", data.email || "", data.contactNo || "", data.designation || ""];
  }

  // Append to master sheet
  masterSheet.appendRow(masterRow);
  
  // Append to role specific sheet
  if (roleSheet && roleRow.length > 0) {
    roleSheet.appendRow(roleRow);
  }

  return response({ status: "success", message: "Data saved in Master and Role sheets" });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return processRequest(data);
  } catch (err) {
    return response({ status: "error", message: err.toString() });
  }
}

function doGet(e) {
  try {
    if (e.parameter.payload) {
      const data = JSON.parse(e.parameter.payload);
      return processRequest(data);
    }
    return response({ status: "ok" });
  } catch (err) {
    return response({ status: "error", message: err.toString() });
  }
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

// === RUN THIS FUNCTION ONCE TO SETUP SHEETS & HEADERS ===
function setupSheets() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  const masterHeaders = [
    "Timestamp", "Role", "Name", "Membership ID", "Enrollment No", 
    "Email", "Contact No", "College", "Branch", "Semester", 
    "Division", "Designation"
  ];
  
  // Set up master sheet
  let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!masterSheet) {
    masterSheet = ss.insertSheet(MASTER_SHEET_NAME);
  }
  masterSheet.getRange(1, 1, 1, masterHeaders.length).setValues([masterHeaders]);
  masterSheet.getRange(1, 1, 1, masterHeaders.length).setFontWeight("bold").setBackground("#f3f4f6");
  masterSheet.setFrozenRows(1);
  
  const ROLE_HEADERS_MAP = {
    "IEEE-Student-Log": ["Timestamp", "Role", "Name", "Membership ID"],
    "Non-IEEE-Student-Log": ["Timestamp", "Role", "Name", "Enrollment No", "Email", "Contact No", "College", "Branch", "Semester", "Division"],
    "IEEE-Faculty-Log": ["Timestamp", "Role", "Name", "Contact No"],
    "Sou-Professor-Log": ["Timestamp", "Role", "Name", "Email", "Contact No", "Branch"],
    "Visitor-Log": ["Timestamp", "Role", "Name", "Email", "Contact No", "Designation"]
  };
  
  for (const [sheetName, headers] of Object.entries(ROLE_HEADERS_MAP)) {
    let sheet = ss.getSheetByName(sheetName);
    // If the sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Clear the first row completely to remove any old long headers
    sheet.getRange("1:1").clearContent();
    
    // Set headers in the first row and make them bold
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f4f6");
    
    // Optionally freeze the top row
    sheet.setFrozenRows(1);
  }
}


# Attendance Log Portal

A modern, responsive web application for managing attendance records with integration to Google Sheets. Built for IEEE SOU Student Branch to streamline event attendance tracking.

**Live Demo:** [https://attendance-log-six.vercel.app](https://attendance-log-six.vercel.app)

---

## Overview

The Attendance Log Portal is a full-stack solution that enables seamless attendance management across multiple user roles. It provides a intuitive interface for capturing attendee information and automatically logs entries to Google Sheets in real-time.

### Key Features

- 🎯 **Role-Based Forms** - Dedicated form layouts for 5 different user roles
- 📊 **Google Sheets Integration** - Automatic data sync to Google Sheets
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast & Reliable** - Built with React and Vite for optimal performance
- 🔒 **Secure** - Uses serverless Google Apps Script backend
- ✅ **Real-Time Feedback** - Instant success/error messages

### Supported Roles

- IEEE Students
- Non-IEEE Students
- IEEE Faculty Advisors
- SOU Professors
- Visitors

---

## Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite 8.0** - Build tool & dev server
- **CSS3** - Modern styling
- **Lucide React** - Icon library

### Backend
- **Google Apps Script** - Serverless backend
- **Google Sheets API** - Data storage

### Deployment
- **Vercel** - Frontend hosting with automatic deployments

---

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- GitHub account (for deployment)
- Google Sheets with Apps Script enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gaurav-dev-24/attendance-log.git
   cd attendance-log
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Apps Script**
   - Open your Google Sheet
   - Go to **Extensions** → **Apps Script**
   - Replace the code with the content from `script-fixed.gs`
   - Deploy as Web App:
     - **Execute as:** Your account
     - **Who has access:** Anyone
   - Copy the deployment URL to `src/config.js`

4. **Update configuration**
   ```javascript
   // src/config.js
   export const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL";
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
attendance-log/
├── src/
│   ├── components/
│   │   ├── RoleSelection.jsx      # Role selection screen
│   │   ├── FormScreen.jsx         # Attendance form
│   │   └── SuccessScreen.jsx      # Success confirmation
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles
│   ├── config.js                  # Configuration
│   └── assets/                    # Images and icons
├── public/                        # Static files
├── script-fixed.gs                # Google Apps Script
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies
└── README.md
```

---

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## Configuration

### Google Sheets Setup

1. **Create a sheet named "Attendance_Log"** with these columns:
   - A: Timestamp
   - B: Role
   - C: Name
   - D: Membership ID
   - E: Enrollment No
   - F: Email
   - G: Contact No
   - H: College
   - I: Branch
   - J: Semester
   - K: Division
   - L: Designation

2. **Update SHEET_ID** in `script-fixed.gs`:
   ```javascript
   const SHEET_ID = "YOUR_SHEET_ID";
   ```

3. **Deploy the Apps Script** (see Quick Start section)

---

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel deployment with automatic deployments from the main branch.

1. **First-time deployment:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Automatic deployments:**
   - Push to `main` branch
   - Vercel automatically rebuilds and deploys

3. **View deployment:**
   ```bash
   vercel inspect
   ```

---

## API Integration

### Google Apps Script Endpoint

**Method:** POST  
**Response:** JSON

#### Request Body
```json
{
  "role": "ieee_student",
  "name": "John Doe",
  "membershipId": "123456",
  "enrollmentNo": "ABC123",
  "email": "john@example.com",
  "contactNo": "9876543210",
  "college": "XYZ College",
  "branch": "CSE",
  "semester": "6",
  "division": "A",
  "designation": "Member"
}
```

#### Success Response (200)
```json
{
  "status": "success"
}
```

#### Error Response (400)
```json
{
  "status": "error",
  "message": "Error details"
}
```

---

## Troubleshooting

### Data not appearing in Google Sheets
- ✅ Verify Google Apps Script deployment URL is correct
- ✅ Check that "Anyone" has access to the web app
- ✅ Ensure the sheet "Attendance_Log" exists with correct columns
- ✅ Check browser console for CORS errors

### CORS Errors
- Ensure `doOptions()` function is included in Apps Script
- Verify deployment is set to "Anyone" access
- Clear browser cache and try again

### Form not submitting
- Check browser console for JavaScript errors
- Verify the deployment URL in `src/config.js`
- Ensure all required fields are filled

---

## Performance

- **Build size:** ~65KB gzipped (JS) + 3.2KB gzipped (CSS)
- **Lighthouse Scores:** 95+ Performance, 100 Accessibility
- **First Contentful Paint:** <1 second
- **Time to Interactive:** <2 seconds

---

## Security

- Frontend deployed on Vercel's secure CDN
- Backend uses Google's serverless infrastructure
- No sensitive data stored locally
- Uses standard HTTPS/TLS encryption
- Google Apps Script runs with user's permissions

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:
- 📧 Email: adityaksoni234@gmail.com
- 🐙 GitHub Issues: [Create an issue](https://github.com/Gaurav-dev-24/attendance-log/issues)
- 📱 Contact: IEEE SOU Student Branch

---

## Acknowledgments

- Built with [React](https://react.dev) + [Vite](https://vitejs.dev)
- Deployed on [Vercel](https://vercel.com)
- Icons from [Lucide React](https://lucide.dev)
- Spreadsheet integration via [Google Apps Script](https://script.google.com)

---

**Made with ❤️ by IEEE SOU Student Branch**

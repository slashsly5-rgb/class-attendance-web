# Class Attendance: Lecturer Guide

Welcome to the Class Attendance Lecturer portal! This guide will walk you through creating classes, inviting students, running physical attendance sessions, and exporting analytics.

## 1. Accessing the Dashboard
- Navigate your browser to: `https://your-domain.com/lecturer`.
- This is your unified hub. Here, you will see high-level metrics for all active classes, including how many students are at-risk of failing due to absences.

## 2. Creating a New Class
1. On the main Dashboard, click **Create Class**.
2. Enter the **Class Title** (e.g., *Introduction to Computer Science*).
3. Create a unique, memorable **Class Code** (e.g., *CS101*). 
   - **Crucial Note**: The `Class Code` is the ONLY thing your students need to find and enroll in your course. It must be unique across the universe of classes.
4. Set the **Location Origin**.
   - Your browser will ask for your GPS location. Ensure you are physically standing in the center of the lecture hall when you click "Get Exact Location". This coordinates pair becomes the immutable center-point that all students will be measured against.

## 3. Managing a Class & Students
Click on any class card to enter its Detail View. 

- **Student List**: See everyone currently enrolled. If a student enrolled by mistake, you can remove them here.
- **Copy Code**: Need to share the code on the projector? Click the small copy icon next to the Class Title to instantly copy it to your clipboard.

## 4. Running an Attendance Session
When the lecture begins, you want to open check-ins.

1. Navigate to your Class Detail view.
2. Under "Session Management", click **Create Location-Based Session**.
3. A large random **6-Digit Passcode** will appear. Put this on the projector screen.
4. **Is Accepting Attendance**: By default, the session is *OFF*. Students cannot check in, even if they guess the passcode.
5. When ready, toggle **Accepting Attendance** to `ON`. 
   - *Pro Tip*: Leave it ON for the first 15 minutes of class, then toggle it OFF to prevent late students walking in specifically to tap their phones.
6. **Watch Real-Time Check-ins**: As students check-in, they will populate in the "Recent Check-ins" table below the toggle.

## 5. Retroactive Approvals (The Excused Absence)
Sometimes a student forgets their phone, has a dead battery, or brings in a valid medical certificate.

1. Find the student in the "Enrolled Students" tab who was marked Absent.
2. Click their 🛑 icon.
3. The system will prompt you: "Mark student as verified present manually?".
4. Click **Yes**. Their record is instantly updated to ✅ and their attendance percentage will recalculate. 

## 6. View & Export Analytics
1. From the Class Detail page, click the **View Analytics** button at the top right.
2. Here, you'll see a comprehensive scatter of every student's history.
3. You can sort by **At Risk Only** to find students who need intervention.
4. **Export CSV**: Click the prominent **Download CSV Report** button to instantly generate a `.csv` matrix containing all students, vertically sorted by session date, with absolute precision on their attendance state. You can upload this directly into excel or the University portal.

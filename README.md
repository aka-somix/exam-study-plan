# Exam #12345: "Exam Title"
## Student: s298877 CIRONE SALVATORE

## React Client Application Routes

- Route `/`: Home Page with all the courses and the study plan
- Route `/login/`: Login page with its form

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `user` - contains: username, password, salt, name, studentType
- Table `courses` - contains: code, name, credits, students, maxStudents, preparatoryCourseCode
- Table `incompatible` - contains: courseCode, courseCodeWith
- Table `studyPlan` - contains: courseCode, username

## Main React Components

- `Header`: The header of the whole app with the Login/Logout button
- `CourseEntry`: Represents a single entry inside the courses list
- `CourseEntryDescription`: Description panel paired with a CourseEntry
- `LoginForm`: Contains the form for logging in a registered user
- `ErrorBanner`: Manages errors that needs to be displayed to the user


(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- testuser, password, NULL (no study plan) 
- scirone , password, part-time
- mrossi, test, full-time
- jdoe, test, part-time
- abianchi, test, part-time 

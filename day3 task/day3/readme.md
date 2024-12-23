
**Go Green App Documentation**
**1. Introduction**
  1.1. Overview
    Go Green is a mobile app designed to promote eco-friendly practices, allowing users to access various features like the feed, messaging, and their profile.
     The app has a secure authentication process, including email and password validation before users can access the main content.
  1.2. Purpose
  The purpose of the app is to encourage users to join an eco-friendly movement by providing a platform to share messages, engage in conversations, and manage their profiles.

**2. Features**
  2.1. Authentication
    Email-based Login: Users enter their email to authenticate and access the password screen.
    Password Validation: Users must enter a valid password to access the app. The app includes password strength checks.
    Forgot Password: Users can reset their password by receiving a reset link via email.
  2.2. Dashboard
    Once authenticated, the user can access the dashboard, which includes the following sections:
    1.Feed: Displays eco-friendly messages that encourage positive action.
    2.Messaging: Allows users to start conversations related to eco-friendly topics.
    3.Profile: Displays the user’s profile details, including their name, email, and a motto.

  2.3. Tab Navigation
    Users can switch between Feed, Messaging, and Profile tabs to navigate different app sections.

**3. Technology Stack**
  3.1. Frontend
    React Native: A framework for building the app interface for both Android and iOS.
    Axios: For making HTTP requests to the backend for user authentication and data fetching.
    React Navigation: To handle navigation between different views/screens.
  3.2. Backend
    Node.js and Express: To set up a simple server for authentication and database interaction.
    MongoDB: To store user data, including email, password, and profile information.
  3.3. Authentication Flow
    Step 1: User enters their email.
    Step 2: The email is validated with a backend API.
    Step 3: If email is valid, user enters password. Password strength is checked.
    Step 4: Password is validated by the backend for authentication.
    Step 5: On successful login, the user is directed to the dashboard with the Feed, Messaging, and Profile tabs.
   
**4. App Workflow**
Login Screen:
User enters a username and email.
Email validation is performed.
If the email is valid, the user is directed to the password screen.

Password Screen:
User enters their password.
Password strength is evaluated and displayed.
On valid password entry, the user is authenticated and directed to the Dashboard.

Dashboard:
Contains three sections: Feed, Messaging, and Profile.
The user can toggle between these sections using a bottom tab navigation bar.

**5. App Structure**
  5.1. App Components
    App.js: Main component containing the app's structure and navigation.
    Login: Handles the user login process, including email and password input fields.
    Dashboard: Contains the Feed, Messaging, and Profile components.
    Feed: Displays eco-friendly messages for the user to read.
    Messaging: Placeholder for user-to-user messaging functionality.
    Profile: Displays user profile details, including a profile picture, username, and email.
    
**6. Testing**
  6.1. Unit Testing
    Test individual functions like email validation, password strength checks, and API requests using Jest and React Native Testing Library.
  6.2. Integration Testing
    Ensure the login process works from start to finish, from entering email and password to accessing the dashboard.
    
**7. Future Enhancements**
  Messaging Feature: Implement real-time messaging using WebSockets or Firebase.
  Profile Customization: Allow users to upload profile pictures.
  User Analytics: Track user activity for personalized experiences.




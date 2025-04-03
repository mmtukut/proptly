please go through the codebase of this app for me and review the implementation and see what and what left to be implemented especially on the frontend, database, supabase and authentication, etc. define for us what to do next

i want you to complete this app finish the userdashboard, admindashboard, adding of property, database so that agent can have his dashboard with 



I need a comprehensive, end-to-end review of my entire project's codebase, with a specific focus on database and backend implementation. Please provide a meticulous analysis that covers:

Overall Architecture Review:

Project structure and organization Separation of concerns Technology stack compatibility Backend and frontend integration points

Database Implementation Analysis:

Database schema design Table relationships Data modeling approaches Query optimization potential Use of indexes and constraints Database connection and management strategies

Backend Implementation Evaluation:

API endpoint design Authentication and authorization mechanisms Error handling approaches Performance considerations Security best practices Data validation and sanitization Middleware implementations

Please ensure no component is overlooked, and provide insights that can help i





go through the contents of the whole codebase and see whats left apart among the listed components and folders, Please ensure no component is overlooked, and provide insights that can help me note what are left. i want a fully roadmap of all things needed for base on what the app does

Auth: signIn, signUp, Forgotpassword, emailVerification
common: agentprofilemodal, imageupload

profile: UserDashboard, profileSection, SettingsSection, ManageProperties

notification: notificationBell, AllNotifications
forms: 

properties: add properties, edit properties, manageproperties, savedProperties

admin: (verificationDashboard: agent verification, property verification), systemSettings, propertyManagemetDashboard, AuditLogs, UserManagementDashboard
inquiries: ClientInquiries
Cards: PropertyCard, agencyCard, agentCard
Layers: header, footer, mobileNav
map: mapview, mapPicker

routes: permissionRoute

search: SearchInterface

UI: button, card, dialog, select, slider, switch, tabs

user: agentVerification

widget: AIChatWidget

pages: about, aichatpage, homepage, 

Services






Database (Likely Supabase):

Schema Design:
Users Table: userId, email, password, username, profileDetails (avatar, bio, contactInfo).
Agents Table: agentId, userId, verificationStatus (pending, verified, rejected), agencyId.
Agencies Table: agencyId, name, description, location.
Properties Table: propertyId, agentId, agencyId, title, description, address, type, price, amenities, images, status (available, rented, sold, pending).
Inquiries Table: inquiryId, userId, propertyId, message, date.
Notifications Table: notificationId, userId, message, type, date, read.
AuditLogs Table: logId, userId, action, timestamp, details.
System Settings Table: Key, value pairs for various system settings.
Relationships:
One-to-many: Users to Agents, Agencies to Properties, Agents to Properties, Users to Inquiries, Users to Notifications, Users to AuditLogs
Many-to-many: Possible relationship between Users and Properties for saved properties.
Data Validation:
Implement validation rules in supabase to ensure data integrity (e.g., email format, required fields, unique constraints).
Indexes:
Create indexes on frequently queried fields (e.g., agentId, propertyId, userId, type, price) to optimize query performance.
Security:
Implement Row Level Security (RLS) policies in Supabase to control data access based on user roles and permissions.
Backend (Node.js):

API Endpoints:
Auth:
/auth/signup
/auth/signin
/auth/forgot-password
/auth/verify-email
/auth/complete-profile
Users:
/users/:userId (GET, PUT, DELETE)
Agents:
/agents/apply (agentVerification, POST)
/agents/:agentId (GET)
/agents (GET, list all agents, possibly with filtering and pagination)
/agents/verified (get verified agents)
Agencies:
/agencies/:agencyId (GET)
/agencies (list all agencies)
Properties:
/properties (GET, list all properties, possibly with filtering and pagination)
/properties/:propertyId (GET, PUT, DELETE)
/properties (POST, add property)
/properties/saved (GET, users saved properties, requires auth)
/properties/agent/:agentId (GET, agent's properties)
Inquiries:
/inquiries (POST, create inquiry, GET, list inquiries, maybe by propertyId or userId)
Notifications:
/notifications (GET, list notifications, possibly by userId)
/notifications/:notificationId/read (PUT, mark notification as read)
Admin:
/admin/agents/verify (POST, PUT, verify/reject agent)
/admin/properties/verify (POST, PUT, verify/reject property)
/admin/system-settings (GET, PUT, list and modify system settings)
/admin/audit-logs (GET, list audit logs)
/admin/users (GET, list all users, DELETE remove user)
/admin/dashboard/properties (list all properties for admin panel)
Search
/search(GET search for properties)
Infrastructure: id (UUID, primary key), name (TEXT, required), type (TEXT, required) (e.g., school, hospital, park), location (TEXT, required)

Authentication:
JWT (JSON Web Tokens)
Handle token creation, verification, and expiration.
Authorization:
Middleware to check user roles and permissions.
Protect admin routes, agent routes, and user routes.
Error Handling:
Properly handle errors and return appropriate HTTP status codes.
Validation:
Validate request bodies using libraries like Joi or Yup.
Caching
Implement caching mechanism for improving performance.
Frontend (React):

Component Implementation:
Implement the missing components listed above (UserDashboard, profileSection, SettingsSection, ManageProperties, notificationBell, AllNotifications, edit properties, verificationDashboard, systemSettings, propertyManagemetDashboard, AuditLogs, UserManagementDashboard, ClientInquiries, agencyCard, mapPicker, agentVerification,permissionRoute, imageupload).
Forms:
Create forms for adding properties, editing properties, user settings, contact inquiries, etc.
Agent Verification: create form for agent verification.
Property Verification: create form for property verification.
Routing:
Set up routes for the new components and admin pages.
Use PrivateRoute to protect routes that require authentication.
API Integration:
Integrate the frontend with the backend API endpoints.
Use fetch or axios to make API requests.
Handle API errors.
Search: integrate search function.
State Management:
Use Context or a state management library like Redux to manage application state (user authentication, properties, notifications, etc.).
UI/UX Improvements:
Refine UI/UX for better user experience.
Accessibility:
Ensure the application is accessible to all users.
Testing
Implement unit test and end-to-end test for better quality assurance.
Services:

Services
Property management service: handle all properties business logic.
Agent management service: handle all agent business logic.
User management service: handle all user business logic.
Admin management service: handle all admin actions.
Inquiry service: handle all user inquires.
Notification service: handle all application notification actions.
System settings service: handle all application settings.








Development Timeline

Phase 1: Core Backend and Database (Estimated: 2-3 Weeks)

Week 1: Database Setup and Initial API Design

Day 1-2:
Finalize Supabase schema design (all tables, relationships, indexes, data types, validation rules).
Set up Row Level Security (RLS) policies.
Day 3-5:
Design initial API endpoints (Auth, Users, Properties).
Set up the Node.js backend project.
Create basic project structure (models, controllers, routes, middleware).
Day 6-7:
Setup the connection to the database.
Write the services and connect them to the database.
Create the model for each resource and connect them to the database.

Week 2: Core API Implementation

Day 1-3:
Implement Auth API endpoints (/signup, /signin, /forgot-password, /verify-email).
Implement user api endpoints users/:userId (GET, PUT, DELETE).
Implement validation middlewares for auth and user endpoints.
Day 4-7:
Implement basic Properties API endpoints (/properties, /properties/:propertyId).
Implement agents/apply endpoint.
Create validation middlewares for each endpoint implemented.
Week 3: API Refinement and Initial Testing

Day 1-3:
Implement the agencies endpoints.
Implement the rest of the properties endpoints (/properties/saved,/properties/agent/:agentId)
Day 4-5:
Write initial API tests (unit tests for controllers).
Refine API error handling and responses.
Day 6-7:
Implement basic middlewares for auth.
Review and refactor the implementation for better structure.
Deploy the backend to a staging environment.
Phase 2: Core Frontend and Authentication (Estimated: 2-3 Weeks)

Week 4: Authentication and User Pages

Day 1-3:
Implement frontend components for Sign Up, Sign In, Forgot Password, and Email Verification.
Integrate these components with the backend API endpoints.
Day 4-7:
Implement JWT authentication logic (token storage, refresh, validation).
Create a PrivateRoute component to protect specific routes.
Implement CompleteProfile.jsx and integrate it with the backend.
Week 5: User Dashboard and Property Pages

Day 1-3:
Create the UserDashboard component (display basic user info).
Implement the SettingsSection and ProfileSection component.
Day 4-7:
Create a basic layout for listing properties.
Implement the PropertyCard component.
Implement the Properties page and integrate it with the backend API.
Implement the SavedProperties component and page.
Week 6: Core Feature Refinements and Testing

Day 1-3:
Implement the AddProperty component.
Implement image upload functionality (if a specific image upload component is needed).
Day 4-5:
Write frontend unit tests for the core authentication and user components.
Refactor the front end code.
Day 6-7
Implement search function.
Deploy the frontend to a staging environment and test together with the backend.

Phase 3: Agent and Inquiry Features (Estimated: 2 Weeks)

Week 7: Agent Features
Day 1-3:
Implement the /agents and agents/verified backend endpoints.
Implement AgentCard component.
Create the AgentVerification component and form.
Day 4-7:
Create the agencyCard component.
Create the component for the list of the agencies, and agents.
Implement the AgentsPage.jsx, AgencyDirectory.jsx, TopAgents.jsx, VerifiedAgents.jsx.
Week 8: Inquiry and Map Features

Day 1-3:
Implement Inquiry backend API (/inquiries).
Create the ClientInquiries component (if a specific component is needed).
Day 4-7:
Implement mapPicker.
Refine MapView component for use in different contexts.
Test the integration of the map with property data.
Phase 4: Admin and Advanced Features (Estimated: 3 Weeks)

Week 9: Admin: Verification

Day 1-3:
Implement verificationDashboard backend API.
Implement verificationDashboard frontend component.
Day 4-7:
Implement agent and property verification forms.
Integrate verification process with the backend API.
Week 10: Admin: Settings and Logs

Day 1-3:
Implement systemSettings backend API.
Implement propertyManagemetDashboard backend and frontend.
Day 4-7:
Implement AuditLogs backend API and frontend component.
Implement UserManagementDashboard.
Week 11: Notifications and Refinement

Day 1-3:
Implement the notificationBell and AllNotifications component.
Implement backend notification endpoints (/notifications)
Integrate notifications with the frontend.
Day 4-7:
Implement the permission route.
Write end-to-end tests for core user journeys.
Refactor codebase.
Phase 5: Testing, Optimization, and Deployment (Estimated: 2 Weeks)

Week 12: Testing and Bug Fixing

Day 1-4:
Thoroughly test all features.
Fix any identified bugs.
Write more test.
Day 5-7:
Fix bugs from the test.
Write any missing test.
Week 13: Optimization and Deployment

Day 1-3:
Optimize performance (caching, code optimization).
Prepare for deployment (configure environment variables, etc.).
Day 4-7:
Deploy the application to production.
Monitor the application for errors and performance issues.



PROMPTS: but seems like some of these components are available on the codebase is that not going to be duplicate? or if you find available component then you see the need or enhancing or removal of thing we dont need then you can do so, but dont remove what's useful. and in all our works apply the insanely simple principle eg simplicity in design,innovation, think differently, user-centric approach, scalability with simplicity etc
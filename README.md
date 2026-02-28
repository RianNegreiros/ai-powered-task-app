# Smart Task Management with AI Insights

## Vision
A task management app that not only helps users organize tasks but provides 
weekly AI-powered insights to improve productivity patterns.

## Target Users
- Professionals managing work/personal tasks
- Students tracking assignments
- Anyone wanting to improve productivity

## Frontend:
  - Framework: React with Vite
  - UI Library: Tailwind CSS

## Backend:
  - Framework: Spring Boot 3.x
  - Java Version: 21 LTS
  - Build Tool: Maven
  - Security: Spring Security + JWT
  - Database: PostgreSQL
  - API: RESTful
  - AI Integration: Google AI / Open Router

Infrastructure:
  - Container: Docker
  - Orchestration: Docker Compose (dev)

## User Stories

- As a user, I want to create an account so my tasks are private
- As a user, I want to create, edit, and delete tasks
- As a user, I want to mark tasks as complete
- As a user, I want to set due dates and priorities
- As a user, I want to organize tasks with tags/categories

### AI Features
- As a user, I want weekly reports showing my productivity patterns
- As a user, I want AI suggestions on how to improve task completion
- As a user, I want to know which tasks I typically procrastinate on

## REST Endpoints

### Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token

### tasks
GET    /api/tasks/me              # List with pagination & filters
GET    /api/tasks/me/:id          # Get single todo
POST   /api/tasks                 # Create todo
PUT    /api/tasks/me/:id          # Update todo
DELETE /api/tasks/me/:id          # Delete todo
PATCH  /api/tasks/me/:id          # Toggle completion

### Tags
GET    /api/tags/me     # Get all tags created by user
POST   /api/tags        # Create a tag for the user to use on tasks
DELETE /api/tags/me/:id # Delete tag

### AI Reports
GET    /api/reports/weekly     # Get latest weekly report
POST   /api/reports/generate    # Trigger report generation (admin)
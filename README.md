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

- As a user, I want to create an account so my todos are private
- As a user, I want to create, edit, and delete todos
- As a user, I want to mark todos as complete
- As a user, I want to set due dates and priorities
- As a user, I want to organize todos with tags/categories

### AI Features
- As a user, I want weekly reports showing my productivity patterns
- As a user, I want AI suggestions on how to improve task completion
- As a user, I want to know which tasks I typically procrastinate on

## REST Endpoints

### Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token

### Todos
GET    /api/todos              # List with pagination & filters
GET    /api/todos/:id          # Get single todo
POST   /api/todos              # Create todo
PUT    /api/todos/:id          # Update todo
DELETE /api/todos/:id          # Delete todo
PATCH  /api/todos/:id/complete # Toggle completion

### Tags
GET    /api/tags
POST   /api/tags
DELETE /api/tags/:id

### AI Reports
GET    /api/reports/weekly     # Get latest weekly report
POST   /api/reports/generate    # Trigger report generation (admin)
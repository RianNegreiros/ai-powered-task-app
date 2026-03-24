# Smart Task Management with AI Insights

![Tasks screen preview](./_docs/tasks.png)
![AI reports screen preview](./_docs/ai-reports.png)

## Vision
A task management app that not only helps users organize tasks but provides 
weekly AI-powered insights to improve productivity patterns.

## Target Users
- Professionals managing work/personal tasks
- Students tracking assignments
- Anyone wanting to improve productivity

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

## Tech Stack

### Frontend
  - Framework: React with Vite
  - UI Library: Tailwind CSS

### Backend
  - Framework: Spring Boot 3.x
  - Java Version: 21 LTS
  - Build Tool: Maven
  - Security: Spring Security + JWT
  - Database: PostgreSQL
  - API: RESTful
  - AI Integration: Spring AI (`spring-ai-starter-model-openai`) with OpenRouter (OpenAI-compatible API)

### Infrastructure
  - Container: Docker
  - Orchestration: Docker Compose (dev)

## REST Endpoints

Base path:

```
/api
```

### Authentication

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh-token
```

### Tasks

```
GET    /tasks/me
GET    /tasks/me/{id}
POST   /tasks
PUT    /tasks/me/{id}
PATCH  /tasks/me/{id}
DELETE /tasks/me/{id}
```

### Tags

```
GET    /tags/me
POST   /tags
DELETE /tags/me/{id}
```

### AI Reports

```
GET    /reports/me
GET    /reports/me/latest
```

All endpoints (except `/auth/**`) require a valid JWT:

```
Authorization: Bearer <token>
```

## Quick Start

1. Clone this repository.

2. Install Docker

3. Create a `.env` file in the project root with your AI provider API key:

```bash
OPENROUTER_API_KEY=your_key_here
```

> The app uses `spring-ai-starter-model-openai` which works with any OpenAI-compatible API.
> By default it's configured to use [OpenRouter](https://openrouter.ai) (free models available), but you can switch to the OpenAI API directly by updating `application.yaml`:
>
> ```yaml
> spring:
>   ai:
>     openai:
>       api-key: ${OPENAI_API_KEY}
>       # remove base-url — Spring AI defaults to https://api.openai.com
>       chat:
>         options:
>           model: gpt-4o-mini # change to desired OpenAI model
> ```

4. Run the containers with Docker Compose:

```bash
docker compose up
```

5. Import the API collection and environment into Postman to test the endpoints:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/15917186-28e16ac4-6325-4025-a7b4-52822e7659a6?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D15917186-28e16ac4-6325-4025-a7b4-52822e7659a6%26entityType%3Dcollection%26workspaceId%3D76ff1811-a0af-4935-a423-2e5bb926aa1d#?env%5BAI%20Powered%20Task%20App%5D=W3sia2V5IjoiYXV0aF90b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQifSx7ImtleSI6ImJhc2VfdXJsIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCJ9LHsia2V5IjoiYXV0aF9yZWZyZXNoX3Rva2VuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCJ9XQ==)

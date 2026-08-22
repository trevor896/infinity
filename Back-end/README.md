# Portfolio Backend

This backend is a lightweight Node.js + Express API that supports a portfolio website.
It is designed to be easy to test locally and simple to extend with database, email, or CMS integrations.

## Architecture Overview

- `server.js`
  - Creates the Express app.
  - Applies CORS and JSON body parsing.
  - Mounts route modules under `/api`.
  - Provides a health route at `/api/status`.
  - Includes fallback 404 and error-handling middleware.

- `routes/`
  - `projects.js`
    - `GET /api/projects` returns all portfolio projects.
    - `GET /api/projects/:id` returns one project by id.
  - `skills.js`
    - `GET /api/skills` returns skills grouped by category.
  - `contact.js`
    - `POST /api/contact` accepts form submissions.

- `controllers/`
  - Encapsulate the request handling logic for each route.
  - Keep routing and business logic separate.

- `data/`
  - `projects.json` contains sample project records.
  - `skills.json` contains skill groups.
  - This is a file-based data source for prototyping.

## How Requests Flow

1. A browser or client calls an API path.
2. Express routes delegate to the matching route module.
3. Each route calls its controller.
4. Controllers read sample data or validate input.
5. The controller sends JSON back to the client.

Example flow for `GET /api/projects`:
- Request hits `routes/projects.js`.
- Route calls `projectsController.getProjects()`.
- Controller reads `data/projects.json` and returns it.

Example flow for `POST /api/contact`:
- Request hits `routes/contact.js`.
- Route calls `contactController.submitContact()`.
- Controller validates `name`, `email`, and `message`.
- Logs the submission and returns a success JSON response.

## Setup and Run

1. Open a terminal in `Back-end/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the PostgreSQL database and run the migrations:
   ```bash
   createdb portfolio
   psql -d portfolio -f migrations/init.sql
   ```
4. Set the database connection string if needed:
   - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio`

5. Configure SMTP email delivery before starting the server. For an Outlook/Microsoft account, set these environment variables in the terminal used to run the backend:
  - `SMTP_HOST=smtp-mail.outlook.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your-outlook-address`
  - `SMTP_PASS=your-app-password-or-smtp-password`
  - `SMTP_SECURE=false`
  - `CONTACT_RECEIVER_EMAIL=Kutsvaraclever@outlook.com`

  Never commit the SMTP password to the repository. If the account uses two-factor authentication, use an app password where supported.

6. Run the server locally:
   ```bash
   npm run dev
   ```
7. Open the API in the browser or Postman:
   - `http://localhost:5000/api/status`
   - `http://localhost:5000/api/projects`
   - `http://localhost:5000/api/skills`

## API Endpoints

- `GET /api/status`
  - Returns: `{ status: 'ok', message: 'Portfolio backend is running' }`

- `GET /api/projects`
  - Returns all project objects from `data/projects.json`.
  - Each project has fields like `id`, `title`, `description`, `tags`, `liveUrl`, and `repoUrl`.

- `GET /api/projects/:id`
  - Returns one project by its `id`.
  - Responds with `404` if not found.

- `GET /api/skills`
  - Returns skill groups from `data/skills.json`.

- `POST /api/contact`
  - Accepts JSON payload:
    ```json
    {
      "name": "Your name",
      "email": "you@example.com",
      "message": "Hello!"
    }
    ```
  - Validates required fields and returns a success message.

## Front-end Integration

The current portfolio front-end can call these endpoints directly:
- `GET /api/projects`
- `POST /api/contact`

If the front-end is hosted separately, update the API base URL accordingly.

## Testing the Backend

### Manual testing
- Visit `http://localhost:5000/api/projects` in the browser.
- Use Postman or curl to POST to `/api/contact`.

Example curl request:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Trevor","email":"trevor@example.com","message":"Hello from my portfolio!"}'
```

### Recommended future tests
- Add unit tests for controller validation.
- Add route tests for 404 and invalid payloads.
- Use Jest or Mocha with supertest.

## Future Enhancements

Suggested improvements:
- Replace file-based data with a real database (MongoDB, PostgreSQL, SQLite).
- Email delivery for contact submissions is configured through Nodemailer and SMTP environment variables.
- Add authentication for an admin dashboard.
- Add `DELETE`, `PATCH`, and `POST` endpoints for managing projects and skills.
- Add request validation with `express-validator` or `Joi`.
- Add logging and structured error handling.

## Notes

- The current backend is intentionally simple for prototyping and learning.
- Data is loaded from JSON files so you can see the model structure clearly.
- Use `npm audit` and `npm update` to keep dependencies secure.

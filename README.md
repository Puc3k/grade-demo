
# Full Stack Project - Symfony & Angular

## Project Structure

- `backend/` - Symfony application (API)
- `front-end/` - Angular application (UI)

---


### API Endpoints

The API is available at `http://localhost:8000/api`.

#### User Credentials for Testing

- **Admin**
    - Email: `admin@example.com`
    - Password: `admin`

- **Teacher**
    - Email: `teacher@example.com`
    - Password: `teacher`

- **Student**
    - Email: `student@example.com`
    - Password: `student`

---

## Combined Development Workflow

1. Run the Symfony backend:
   ```bash
   cd backend
   symfony server:start
   ```

2. In a separate terminal window, run the Angular frontend:
   ```bash
   cd front-end
   ng serve
   ```

Access the frontend at `http://localhost:4200` and ensure that it communicates with the Symfony backend running at `http://localhost:8000/api`.

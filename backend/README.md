
# Symfony Application - Setup Guide

This is a Symfony application that includes a basic grading system. Below are the steps to set up and run the application, including running data fixtures and logging in with predefined users.

## Prerequisites

Make sure you have the following installed:
- PHP 8.1 or higher
- Composer
- Symfony CLI (optional but recommended)
- SQLite (or your preferred database)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies:**
   Run the following command to install all required dependencies using Composer:
   ```bash
   composer install
   ```

3. **Set up environment variables:**
   Copy the `.env` file to `.env.local` and configure the database connection. Example:
   ```
   DATABASE_URL="sqlite://username:password@127.0.0.1:3306/your_database_name"
   ```

4. **Create the database:**
   Run the following commands to create the database and its schema:
   ```bash
   php bin/console doctrine:database:create
   php bin/console doctrine:migrations:migrate
   ```

5. **Load data fixtures:**
   Run the following command to load sample data, including users and grades:
   ```bash
   php bin/console doctrine:fixtures:load
   ```

   This will populate the database with demo users and grades.

6. **Run the development server:**
   You can start the Symfony server with:
   ```bash
   symfony serve
   ```
   Or alternatively:
   ```bash
   php -S localhost:8000 -t public
   ```

## Predefined Users

After loading the data fixtures, you can log in with the following users:

- **Admin:**
    - Email: `admin@example.com`
    - Password: `admin`
    - Roles: `ROLE_ADMIN`

- **Teacher:**
    - Email: `teacher@example.com`
    - Password: `teacher`
    - Roles: `ROLE_TEACHER`, `ROLE_STUDENT`

- **Student:**
    - Email: `student@example.com`
    - Password: `student`
    - Roles: `ROLE_STUDENT`

## Notes

- The app includes random grades for both the teacher and student accounts, linked to subjects such as Math, Physics, Chemistry, and more.
- Feel free to extend the functionality or modify the fixtures as needed.

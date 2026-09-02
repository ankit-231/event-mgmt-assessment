# Event Management Assessment for Nepa Works

## Folder Structure

- backend/
- frontend

## Stack Used

- Django for API
- NextJS for Frontend

## Setup

### Frontend

- edit `.env` file
- `pnpm install`
- `pnpm run dev`

### Backend

- Install python poetry.
- set `export DJANGO_PRODUCTION=False` to use `.env` file
- edit the `.env` file.
- run the migrations using `poetry run python manage.py migrate`
- Seed event data using `poetry run python manage.py seed_events`
- run the server using `poetry run python manage.py runserver`

# Event Management Assessment for Nepa Works

## Folder Structure

- backend/
- frontend

## Stack Used

- Django for API
- NextJS for Frontend

## Live Demo

- https://event-mgmt-assessment-fe.onrender.com/

## Setup

### Frontend

- `cd frontend/`
- `cp .env.example .env`
- edit `.env` file
- `pnpm install`
- `pnpm run dev`

### Backend

- `cd backend/`
- Install python poetry. `pip install poetry==2.3.1`
- `cp .env.example .env`
- (deprecated, see 7411411) set `export DJANGO_PRODUCTION=False` to use `.env` file
- edit the `.env` file.
- run the migrations using `poetry run python manage.py migrate`
- Seed event data using `poetry run python manage.py seed_events` (optional, you can seed via Frontend UI, see f1a1f74)
- run the server using `poetry run python manage.py runserver`

Alternatively, in Backend, you can simply do:

```sh
cd backend/
./build.sh
```

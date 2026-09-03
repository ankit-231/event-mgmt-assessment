#!/bin/bash

set -o errexit

pip install poetry==2.3.1

poetry install --no-interaction --no-root

poetry run python manage.py collectstatic --noinput

poetry run python manage.py migrate


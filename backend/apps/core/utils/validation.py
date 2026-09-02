import re
from typing import Tuple
from rest_framework import serializers
from django.core.validators import RegexValidator
from django.core.validators import validate_email
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError


class ValidationErrorCollector:
    """
    Helper class to collect validation errors and raise them in one go.
    """

    def __init__(self):
        self.errors = {}

    def add_error(self, field: str, message: str):
        """
        Adds an error message for a specific field.
        """
        if field not in self.errors:
            self.errors[field] = []
        self.errors[field].append(message)

    def add_non_field_error(self, message: str):
        """
        Adds a general error not tied to a specific field.
        """
        self.add_error("non_field_errors", message)

    def raise_error(self):
        """
        Raises serializers.ValidationError if any errors have been added.
        """
        if self.errors:
            raise serializers.ValidationError(self.errors)

    def reset_errors(self):
        """
        Resets the collected errors.
        """
        self.errors = {}

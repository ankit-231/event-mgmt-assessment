from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    pass


class Configuration(models.Model):
    events_seeded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Configuration"
        verbose_name_plural = "Configurations"
        db_table = "configuration"

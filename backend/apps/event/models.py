from django.db import models
from apps.core.utils.base_models import BaseModel
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()


class Event(BaseModel):
    class EventType(models.TextChoices):
        CONFERENCE = "Conference", "Conference"
        MEETUP = "Meetup", "Meetup"
        WORKSHOP = "Workshop", "Workshop"
        WEBINAR = "Webinar", "Webinar"
        OTHER = "Other", "Other"

    event_type = models.CharField(
        max_length=255, choices=EventType.choices, default=EventType.OTHER
    )
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    payload = models.JSONField()

    class Meta:
        db_table = "event"
        verbose_name = "Event"
        verbose_name_plural = "Events"

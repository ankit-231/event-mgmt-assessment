import random

from django.db.models import Count
from django.utils import timezone

from apps.core.utils.common import update_model_instance
from apps.event.factories import EventFactory, UserFactory
from apps.event.serializers import CreateEventSerializer, UpdateEventSerializer

from .models import Event

EVENT_TYPES = [choice[0] for choice in Event.EventType.choices]


class EventService:

    def create(self, data: dict) -> Event:
        validated_data = self._validate_create_data(data)

        event = Event(**validated_data)
        event.save()

        return event

    def _validate_create_data(self, data: dict) -> dict:
        serializer = CreateEventSerializer(data=data)
        # handled by exception handler
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        return validated_data

    def update(self, event: Event, data: dict) -> Event:
        validated_data = self._validate_update_data(event, data)
        # set validate_fields_exist because we rely on ModelSerializer to validate fields
        update_model_instance(
            instance=event, validate_fields_exist=False, **validated_data
        )
        return event

    def _validate_update_data(self, event: Event, data: dict) -> dict:
        serializer = UpdateEventSerializer(instance=event, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        return validated_data


class EventAnalyticService:

    def get_last_24_hours_metrics(self) -> dict:
        since = timezone.now() - timezone.timedelta(hours=24)

        events = Event.objects.filter(start_time__gte=since)

        counts_by_type = {
            row["event_type"]: row["count"]
            for row in events.values("event_type").annotate(count=Count("id"))
        }

        return {
            "total": events.count(),
            "counts_by_type": counts_by_type,
        }


class EventSeedService:

    def seed(self, count: int = 20) -> list[Event]:
        users = UserFactory.create_batch(min(count, 5))

        created = []
        for _ in range(count):
            now = timezone.now()
            # spread start_time across the last 48 hours so some events
            # land inside the /analytics/ last-24-hours window and some don't
            start_time = now - timezone.timedelta(hours=random.uniform(0, 48))
            end_time = start_time + timezone.timedelta(hours=random.uniform(1, 4))

            event = EventFactory(
                user=random.choice(users),
                event_type=random.choice(EVENT_TYPES),
                start_time=start_time,
                end_time=end_time,
            )
            created.append(event)

        return created

from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.event.factories import EventFactory, UserFactory
from apps.event.models import Event
from apps.event.utils import EventAnalyticService, EventService


class EventServiceCreateTests(TestCase):
    def setUp(self):
        self.service = EventService()
        self.user = UserFactory()

    def _base_data(self, **overrides):
        now = timezone.now()
        data = {
            "name": "Django Meetup",
            "user": self.user.id,
            "event_type": Event.EventType.MEETUP,
            "description": "A meetup about Django.",
            "start_time": now,
            "end_time": now + timezone.timedelta(hours=1),
            "payload": {},
        }
        data.update(overrides)
        return data

    def test_create_saves_event_with_valid_data(self):
        data = self._base_data()

        event = self.service.create(data=data)

        self.assertIsNotNone(event.id)
        self.assertEqual(event.name, "Django Meetup")
        self.assertEqual(event.user_id, self.user.id)
        self.assertEqual(Event.objects.count(), 1)

    def test_create_raises_when_start_time_after_end_time(self):
        now = timezone.now()
        data = self._base_data(start_time=now, end_time=now - timezone.timedelta(hours=1))

        with self.assertRaises(ValidationError):
            self.service.create(data=data)

        self.assertEqual(Event.objects.count(), 0)

    def test_create_raises_when_required_field_missing(self):
        data = self._base_data()
        del data["name"]

        with self.assertRaises(ValidationError):
            self.service.create(data=data)


class EventServiceUpdateTests(TestCase):
    def setUp(self):
        self.service = EventService()
        now = timezone.now()
        self.event = EventFactory(
            start_time=now, end_time=now + timezone.timedelta(hours=1)
        )

    def test_update_changes_only_provided_fields(self):
        updated_event = self.service.update(
            event=self.event, data={"name": "Updated Name"}
        )

        updated_event.refresh_from_db()
        self.assertEqual(updated_event.name, "Updated Name")
        self.assertEqual(updated_event.event_type, self.event.event_type)

    def test_update_raises_when_new_end_time_before_existing_start_time(self):
        bad_end_time = self.event.start_time - timezone.timedelta(hours=1)

        with self.assertRaises(ValidationError):
            self.service.update(event=self.event, data={"end_time": bad_end_time})

    def test_update_raises_when_new_start_time_after_existing_end_time(self):
        bad_start_time = self.event.end_time + timezone.timedelta(hours=1)

        with self.assertRaises(ValidationError):
            self.service.update(event=self.event, data={"start_time": bad_start_time})


class EventAnalyticServiceTests(TestCase):
    def setUp(self):
        self.service = EventAnalyticService()

    def test_get_last_24_hours_metrics_counts_recent_events_by_type(self):
        now = timezone.now()

        EventFactory(event_type=Event.EventType.CONFERENCE, start_time=now)
        EventFactory(event_type=Event.EventType.CONFERENCE, start_time=now)
        EventFactory(event_type=Event.EventType.MEETUP, start_time=now)
        # outside the 24 hour window, should be excluded
        EventFactory(
            event_type=Event.EventType.WEBINAR,
            start_time=now - timezone.timedelta(hours=25),
        )

        metrics = self.service.get_last_24_hours_metrics()

        self.assertEqual(metrics["total"], 3)
        self.assertEqual(
            metrics["counts_by_type"],
            {
                Event.EventType.CONFERENCE: 2,
                Event.EventType.MEETUP: 1,
            },
        )

    def test_get_last_24_hours_metrics_returns_zero_total_when_no_events(self):
        metrics = self.service.get_last_24_hours_metrics()

        self.assertEqual(metrics["total"], 0)
        self.assertEqual(metrics["counts_by_type"], {})

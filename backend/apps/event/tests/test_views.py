from django.conf import settings
from django.test import override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.event.factories import EventFactory, UserFactory
from apps.event.models import Event

# Throttling is disabled for these sanity checks so repeated test requests
# from the test client don't get rate-limited.
_REST_FRAMEWORK_NO_THROTTLE = {
    **settings.REST_FRAMEWORK,
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {},
}


@override_settings(REST_FRAMEWORK=_REST_FRAMEWORK_NO_THROTTLE)
class EventEndpointsSanityTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        now = timezone.now()
        self.event = EventFactory(
            user=self.user, start_time=now, end_time=now + timezone.timedelta(hours=1)
        )

    def test_list_events(self):
        url = reverse("events:list_create_event")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data["data"])

    def test_create_event(self):
        url = reverse("events:list_create_event")
        now = timezone.now()
        payload = {
            "name": "New Event",
            "user": self.user.id,
            "event_type": Event.EventType.WORKSHOP,
            "description": "A workshop.",
            "start_time": now.isoformat(),
            "end_time": (now + timezone.timedelta(hours=2)).isoformat(),
            "payload": {},
        }

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["name"], "New Event")
        self.assertEqual(Event.objects.count(), 2)

    def test_create_event_with_invalid_data_returns_400(self):
        url = reverse("events:list_create_event")

        response = self.client.post(url, data={}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_event(self):
        url = reverse(
            "events:retrieve_update_delete_event", kwargs={"event_id": self.event.id}
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["id"], self.event.id)

    def test_retrieve_event_not_found(self):
        url = reverse(
            "events:retrieve_update_delete_event", kwargs={"event_id": 999999}
        )

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_event(self):
        url = reverse(
            "events:retrieve_update_delete_event", kwargs={"event_id": self.event.id}
        )

        response = self.client.patch(url, data={"name": "Renamed"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["name"], "Renamed")

    def test_delete_event(self):
        url = reverse(
            "events:retrieve_update_delete_event", kwargs={"event_id": self.event.id}
        )

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=self.event.id).exists())

    def test_list_events_filtered_by_date_range(self):
        url = reverse("events:list_create_event")
        now = timezone.now()

        # self.event starts at `now`; add one that falls outside the range
        old_event = EventFactory(
            user=self.user,
            start_time=now - timezone.timedelta(days=10),
            end_time=now - timezone.timedelta(days=10) + timezone.timedelta(hours=1),
        )

        response = self.client.get(
            url,
            data={
                "start_date": (now - timezone.timedelta(days=1)).isoformat(),
                "end_date": (now + timezone.timedelta(days=1)).isoformat(),
            },
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        returned_ids = {event["id"] for event in response.data["data"]["results"]}
        self.assertIn(self.event.id, returned_ids)
        self.assertNotIn(old_event.id, returned_ids)

    def test_list_events_with_start_date_after_end_date_returns_400(self):
        url = reverse("events:list_create_event")
        now = timezone.now()

        response = self.client.get(
            url,
            data={
                "start_date": now.isoformat(),
                "end_date": (now - timezone.timedelta(days=1)).isoformat(),
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_analytics(self):
        url = reverse("events:event_analytics")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total", response.data["data"])
        self.assertIn("counts_by_type", response.data["data"])

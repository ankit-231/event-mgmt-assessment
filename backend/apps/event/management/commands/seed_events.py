import random

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.event.factories import EventFactory, UserFactory
from apps.event.models import Event

EVENT_TYPES = [choice[0] for choice in Event.EventType.choices]


class Command(BaseCommand):
    help = "Seeds the database with random Event data for local testing/analytics."

    def add_arguments(self, parser):
        parser.add_argument(
            "count",
            nargs="?",
            type=int,
            default=20,
            help="Number of events to create (default: 20).",
        )

    def handle(self, *args, **options):
        count = options["count"]

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

        self.stdout.write(
            self.style.SUCCESS(f"Created {len(created)} events across {len(users)} users.")
        )

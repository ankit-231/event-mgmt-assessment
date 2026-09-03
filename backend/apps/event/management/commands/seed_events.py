from django.core.management.base import BaseCommand

from apps.event.utils import EventSeedService


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

        created = EventSeedService().seed(count=count)

        self.stdout.write(
            self.style.SUCCESS(f"Created {len(created)} events.")
        )

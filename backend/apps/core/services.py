from django.utils import timezone

from apps.core.models import Configuration


class ConfigurationService:

    def get_configuration(self) -> Configuration:
        configuration, _ = Configuration.objects.get_or_create(id=1)
        return configuration

    def mark_events_seeded(self) -> Configuration:
        configuration = self.get_configuration()
        configuration.events_seeded_at = timezone.now()
        configuration.save(update_fields=["events_seeded_at"])
        return configuration

from rest_framework import serializers

from apps.core.models import Configuration


class ConfigurationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = [
            "id",
            "events_seeded_at",
        ]

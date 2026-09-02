from rest_framework import serializers
from apps.event.models import Event


class BaseFilterSerializer(serializers.Serializer):
    """Base filter serializer with common filtering fields"""

    page = serializers.IntegerField(required=False, min_value=1)
    page_size = serializers.IntegerField(required=False, min_value=1, max_value=100)
    ordering = serializers.CharField(required=False)
    q = serializers.CharField(required=False)  # search query


class EventFilterSerializer(BaseFilterSerializer):
    """Event-specific filters"""

    event_type = serializers.ChoiceField(
        choices=Event.EventType.choices, required=False
    )

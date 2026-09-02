from rest_framework import serializers
from apps.core.utils.validation import ValidationErrorCollector
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
    # filters on Event.start_time
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)

    def validate(self, attrs):
        error_collector = ValidationErrorCollector()
        start_date = attrs.get("start_date")
        end_date = attrs.get("end_date")

        if start_date and end_date and start_date >= end_date:
            error_collector.add_error(
                "start_date", "start_date must be before end_date."
            )

        error_collector.raise_error()

        return attrs

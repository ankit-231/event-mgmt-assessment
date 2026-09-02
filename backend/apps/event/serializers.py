from rest_framework import serializers
from apps.core.utils.validation import ValidationErrorCollector
from apps.event.models import Event


class GetEventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "user_id",
            "event_type",
            "description",
            "start_time",
            "end_time",
            "payload",
        ]


class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "name",
            "user",
            "event_type",
            "description",
            "start_time",
            "end_time",
            "payload",
        ]

        extra_kwargs = {
            "name": {"required": True},
            "user": {
                "required": True,
                "error_messages": {"does_not_exist": "User does not exist."},
            },
            "event_type": {"required": True},
            "description": {"required": True},
            "start_time": {"required": True},
            "end_time": {"required": True},
            "payload": {"required": True},
        }

    def validate(self, attrs):
        error_collector = ValidationErrorCollector()
        start_time = attrs.get("start_time")
        end_time = attrs.get("end_time")

        if start_time and end_time and start_time >= end_time:
            error_collector.add_error(
                "start_time", "Start time must be before end time."
            )

        error_collector.raise_error()

        return attrs


class UpdateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "name",
            "event_type",
            "description",
            "start_time",
            "end_time",
            "payload",
        ]

    def validate(self, attrs):
        event = self.instance
        error_collector = ValidationErrorCollector()

        og_start_time = event.start_time
        og_end_time = event.end_time

        start_time = attrs.get("start_time") or og_start_time
        end_time = attrs.get("end_time") or og_end_time

        if start_time and end_time and start_time >= end_time:
            error_collector.add_error(
                "start_time", "Start time must be before end time."
            )

        error_collector.raise_error()

        return attrs


class EventAnalyticSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    counts_by_type = serializers.DictField(child=serializers.IntegerField())

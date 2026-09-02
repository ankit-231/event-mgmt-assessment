from rest_framework import serializers
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
            "user_id",
            "event_type",
            "description",
            "start_time",
            "end_time",
            "payload",
        ]


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

from apps.event.serializers import CreateEventSerializer

from .models import Event


class EventService:

    def create(self, data: dict) -> Event:
        validated_data = self._validate_create_data(data)

        event = Event(**validated_data)
        event.save()

        return event

    def _validate_create_data(self, data: dict) -> dict:
        serializer = CreateEventSerializer(data=data)
        # handled by exception handler
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        return validated_data

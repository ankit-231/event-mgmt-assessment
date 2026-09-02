from django.shortcuts import render

from apps.core.utils.base_views import BaseAPIView
from apps.core.utils.response_wrappers import NoContentResponse, OKResponse
from apps.event.models import Event
from apps.event.serializers import (
    CreateEventSerializer,
    GetEventDetailSerializer,
    UpdateEventSerializer,
)
from apps.event.utils import EventService
from django.shortcuts import get_object_or_404

# Create your views here.


class ListCreateEventView(BaseAPIView):
    output_serializer = GetEventDetailSerializer

    input_serializer = CreateEventSerializer

    def get(self, request):
        events = Event.objects.all()

        data = self.output_serializer(events, many=True).data
        return OKResponse(data=data)

    def post(self, request):
        data = request.data
        event = EventService().create(data=data)

        output_data = self.output_serializer(event).data

        return OKResponse(data=output_data)


class RetrieveUpdateDeleteEventView(BaseAPIView):
    output_serializer = GetEventDetailSerializer

    input_serializer = UpdateEventSerializer

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        data = self.output_serializer(event).data
        return OKResponse(data=data)

    def patch(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)

        data = request.data
        event = EventService().update(event=event, data=data)

        output_data = self.output_serializer(event).data

        return OKResponse(data=output_data)

    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        event.delete()
        return NoContentResponse()

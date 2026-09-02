from django.shortcuts import render

from apps.core.utils.base_views import BaseAPIView
from apps.core.utils.response_wrappers import OKResponse
from apps.event.models import Event
from apps.event.serializers import CreateEventSerializer, GetEventDetailSerializer
from apps.event.utils import EventService

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

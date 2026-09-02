from django.shortcuts import render

from apps.core.utils.base_views import BaseAPIView
from apps.core.utils.response_wrappers import OKResponse
from apps.event.models import Event
from apps.event.serializers import CreateEventSerializer, GetEventDetailSerializer

# Create your views here.


class ListCreateEventView(BaseAPIView):
    output_serializer = GetEventDetailSerializer

    input_serializer = CreateEventSerializer

    def get(self, request):
        events = Event.objects.all()

        data = self.output_serializer(events, many=True).data
        return OKResponse(data=data)

    def post(self, request):
        serializer = self.output_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        return OKResponse(data=self.output_serializer(event).data)

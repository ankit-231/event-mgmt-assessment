from django.shortcuts import render

from apps.core.utils.base_views import BaseAPIView
from apps.core.utils.filters import EventFilterSerializer
from apps.core.utils.mixins import FilteredAPIMixin, PaginatedAPIMixin
from apps.core.utils.response_wrappers import NoContentResponse, OKResponse
from apps.event.models import Event
from apps.event.serializers import (
    CreateEventSerializer,
    EventAnalyticSerializer,
    GetEventDetailSerializer,
    UpdateEventSerializer,
)
from apps.event.utils import EventAnalyticService, EventService
from django.shortcuts import get_object_or_404

# Create your views here.


class ListCreateEventView(BaseAPIView, FilteredAPIMixin, PaginatedAPIMixin):
    output_serializer = GetEventDetailSerializer

    input_serializer = CreateEventSerializer

    filter_serializer_class = EventFilterSerializer

    def get(self, request):

        # Get validated filter params
        filters = self.get_filter_params()

        q = {}

        event_type = filters.get("event_type")
        if event_type:
            q["event_type"] = event_type

        search = filters.get("q")
        if search:
            q["name__icontains"] = search

        events = Event.objects.filter(**q)

        # ordering
        ordering = filters.get("ordering", "-created_at")
        events = self.apply_ordering(events, ordering)

        paginated_events, paginator = self.paginate_queryset(events)

        data = self.output_serializer(paginated_events, many=True).data

        return self.get_paginated_response(serializer_data=data, paginator=paginator)

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


class EventAnalyticAPI(BaseAPIView):
    output_serializer = EventAnalyticSerializer

    def get(self, request):
        metrics = EventAnalyticService().get_last_24_hours_metrics()

        data = self.output_serializer(metrics).data

        return OKResponse(data=data)

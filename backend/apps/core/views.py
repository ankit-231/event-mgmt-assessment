from apps.core.serializers import ConfigurationDetailSerializer
from apps.core.services import ConfigurationService
from apps.core.utils.base_views import BaseAPIView
from apps.core.utils.response_wrappers import OKResponse
from apps.event.utils import EventSeedService

# Create your views here.


class SeedEventsAPI(BaseAPIView):
    def post(self, request):
        EventSeedService().seed()
        configuration = ConfigurationService().mark_events_seeded()

        data = ConfigurationDetailSerializer(configuration).data

        return OKResponse(data=data, message="Events seeded")


class ConfigurationDetailAPI(BaseAPIView):
    output_serializer = ConfigurationDetailSerializer

    def get(self, request):
        configuration = ConfigurationService().get_configuration()

        data = self.output_serializer(configuration).data

        return OKResponse(data=data)

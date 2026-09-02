from rest_framework.views import APIView


class BaseAPIView(APIView):
    extra_permissions = []

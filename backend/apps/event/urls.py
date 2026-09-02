from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.ListCreateEventView.as_view(), name="list_create_event"),
    # path("<int:event_id>/", views.ListCreateEventView.as_view(), name="list_create_event"),
]

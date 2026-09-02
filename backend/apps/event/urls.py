from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.ListCreateEventView.as_view(), name="list_create_event"),
    path(
        "<int:event_id>/",
        views.RetrieveUpdateDeleteEventView.as_view(),
        name="retrieve_update_delete_event",
    ),
]

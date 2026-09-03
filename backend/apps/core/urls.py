from django.urls import path

from . import views

urlpatterns = [
    path("seed-events/", views.SeedEventsAPI.as_view(), name="seed_events"),
    path(
        "configuration/",
        views.ConfigurationDetailAPI.as_view(),
        name="configuration_detail",
    ),
]

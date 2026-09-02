import factory
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import Event

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("username",)

    username = factory.Sequence(lambda n: "user_%d" % n)
    email = factory.LazyAttribute(lambda obj: "%s@example.com" % obj.username)


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    name = factory.Sequence(lambda n: "Event %d" % n)
    user = factory.SubFactory(UserFactory)
    event_type = Event.EventType.CONFERENCE
    description = factory.Faker("paragraph")
    start_time = factory.LazyFunction(timezone.now)
    end_time = factory.LazyAttribute(
        lambda obj: obj.start_time + timezone.timedelta(hours=1)
    )
    payload = factory.LazyFunction(dict)

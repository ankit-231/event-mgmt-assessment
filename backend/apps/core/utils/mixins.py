from .pagination import StandardResultsSetPagination
from rest_framework.pagination import PageNumberPagination


class PaginatedAPIMixin:
    """
    Mixin to add pagination support to API views.
    Usage: Include this mixin in your view and call paginate_queryset()
    """

    pagination_class = StandardResultsSetPagination

    def paginate_queryset(self, queryset):
        """
        Paginate a queryset and return paginated data
        """
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, self.request)
        return paginated_queryset, paginator

    def get_paginated_response(self, serializer_data, paginator: PageNumberPagination):
        """
        Return paginated response
        """
        return paginator.get_paginated_response(serializer_data)


class FilteredAPIMixin:
    """
    Mixin to add filtering support to API views.
    Define filter_serializer_class in your view

    Note: orders by id by default if no ordering is provided.
    """

    filter_serializer_class = None

    def get_filter_params(self):
        """
        Validate and return filter parameters
        """
        if not self.filter_serializer_class:
            return {}

        serializer = self.filter_serializer_class(data=self.request.query_params)
        serializer.is_valid(raise_exception=True)

        # Store validated filters in request for global access
        self.request.validated_filters = serializer.validated_data

        return serializer.validated_data

    def apply_ordering(self, queryset, ordering):
        if ordering:
            order_fields = [f.strip() for f in ordering.split(",")]
            queryset = queryset.order_by(*order_fields, "id")
        else:
            queryset = queryset.order_by("id")

        return queryset

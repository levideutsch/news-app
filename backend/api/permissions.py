from rest_framework.permissions import BasePermission

class IsWriter(BasePermission):
    def has_permission(self, request, view):
        
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user.profile, 'is_writer', False)
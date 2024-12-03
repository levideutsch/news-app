from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import WriterRequest, Tag
from .serializers import WriterRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import pdb

# Allows users to view their request statys
# class WriterRequestListView(generics.ListAPIView):
#     queryset = WriterRequest.objects.all()
#     serializer_class = WriterRequestSerializer
#     permission_classes = [AllowAny]
    
# View for admin dashboard    
class AdminDashData(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        writer_requests = WriterRequest.objects.all()
        writer_requests_list = [
            {
                "id": writer_request.id,  
                "user": writer_request.user.id,
                "request_date": writer_request.request_date,
                "approved": writer_request.approved,
                "rejected": writer_request.rejected,
                "username": writer_request.user.username,
                "profile_photo": request.build_absolute_uri(writer_request.user.profile.profile_photo.url) if writer_request.user.profile.profile_photo else None,    
             } 
            for writer_request in writer_requests]
        
        
        tags = Tag.objects.all()
        
        # tags_list = [{"id": tag.id, "name": tag.name} for tag in tags]
        count_list = len(tags)
        
        admin_data = {"writer_requests_list": writer_requests_list, "number_of_tags": count_list}
        return JsonResponse(admin_data, safe=False)
    


        
    
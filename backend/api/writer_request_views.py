# writer_request_views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import serializers
from .models import WriterRequest, Profile
from .serializers import WriterRequestSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
import pdb


# Alllows users to request to become a writer
class WriterRequestCreateView(generics.CreateAPIView):
    queryset = WriterRequest.objects.all()
    serializer_class = WriterRequestSerializer
    permission_classes = [IsAuthenticated]
    # pdb.set_trace()
    def perform_create(self, serializer):
        
        user = self.request.user
        if WriterRequest.objects.filter(user=user).exists():
            raise serializers.ValidationError('Request already exists')
        serializer.save(user=user)
        

# Allows users to view their request statys
class WriterRequestListView(generics.ListAPIView):
    queryset = WriterRequest.objects.all()
    serializer_class = WriterRequestSerializer
    permission_classes = [IsAuthenticated]
    
    


# Allows admins to accept or reject users reuest to become a writer
class AdminWriterRequestUpdateView(generics.UpdateAPIView):
    queryset = WriterRequest.objects.all()
    serializer_class = WriterRequestSerializer
    permission_classes = [IsAdminUser]
    # permission_classes = [IsAuthenticated]

    

    def perform_update(self, serializer):
        request_data = self.request.data
        instance = self.get_object()
        # pdb.set_trace()
        
        
        if request_data.get('approved'):
            instance.approved = True
            instance.rejected = False  # Automatically set rejected to False
            # pdb.set_trace()
            instance.save()
            
            # Also update Profile to set is_writer = True
            Profile.objects.filter(user=instance.user).update(is_writer=True)
            return
        elif request_data.get('rejected'):
            instance.rejected = True
            instance.approved = False  # Automatically set approved to False
            instance.save()
            
            Profile.objects.filter(user=instance.user).update(is_writer=False)
            return
        serializer.save()
    
    
        # class ActiveWriterListView(APIView):
        #     permission_classes = [AllowAny] 
            
        #     def get(self, request, *args, **kwargs):
        #          writers = Profile.objects.filter(is_writer=True)
        #                 # Create a custom list of dictionaries to return as JSON
        #          writer_list = [
        #             {
        #                 "id": writer.id,
        #                 "username": writer.user.username,
        #                 "email": writer.user.email,  # example fields
        #                 "profile_photo": request.build_absolute_uri(writer.profile_photo.url) if writer.profile_photo else None,
        #                 # add other fields as needed
        #             }
        #             for writer in writers
        #         ]
        #          return JsonResponse(writer_list, safe=False)
from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Profile
from rest_framework import generics, status
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from rest_framework.views import APIView

import pdb
# Create your views here.

# Register new user
class CreateUserView(generics.CreateAPIView): # Handles creation of new objects
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Allow any because we need to allow anyone to register
    

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
    
 # View for specific user   
class UserDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User does not exist")

        user_data = {
            "id": user.id,
            "username": user.username,
            "location":(
                user.profile.location if hasattr(user, "profile") and user.profile and hasattr(user.profile, "location") else None
                ) ,
            "profile_photo": (
                request.build_absolute_uri(user.profile.profile_photo.url) 
                if hasattr(user, 'profile') and user.profile and hasattr(user.profile, 'profile_photo') else None
            ),
            "is_writer": (
                user.profile.is_writer 
                if hasattr(user, 'profile') and user.profile else None
            ),
            'x_link': (
                user.profile.x_link if hasattr(user, "profile") and user.profile and hasattr(user.profile, "x_link") else None
            ),
            'facebook_link': (
                user.profile.facebook_link if hasattr(user, "profile") and user.profile and hasattr(user.profile, "facebook_link") else None
            ),
             'instagram_link': (
                user.profile.instagram_link if hasattr(user, "profile") and user.profile and hasattr(user.profile, "instagram_link") else None
            ),
            'linkedin_link': (
                user.profile.linkedin_link if hasattr(user, "profile") and user.profile and hasattr(user.profile, "linkedin_link") else None
            ),
            "articles": [article for article in user.articles.all()] 
        }
        
        return JsonResponse(user_data)
    
    
    
# View for all users     
class AllUsersView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        
        users_data = []
        for user in users:
            user_data = {
                "id": user.id,
                "username": user.username,
                "profile_photo": (
                    request.build_absolute_uri(user.profile.profile_photo.url) 
                    if hasattr(user, 'profile') and user.profile and hasattr(user.profile, 'profile_photo') else None
                ),
                "is_writer": (
                    user.profile.is_writer 
                    if hasattr(user, 'profile') and user.profile else None
                ),
                "articles": [article for article in user.articles.all()]
            }
            users_data.append(user_data)
        
        return JsonResponse(users_data, safe=False)   
    
    
    
    
# Profile CRUD    
# class ProfileDetail(generics.RetrieveDestroyAPIView):
#     serializer_class = ProfileSerializer
#     permission_classes = [IsAuthenticated]
    
#     def put(self, request,  *args, **kwargs):
#         # pdb.set_trace()
#         # Find user 
#         user = self.request.user 
        
#         # Check if user is authenticated
#         if not user.is_authenticated: 
#             return JsonResponse({"error": "User is not authenticated"}, status=401)
        
        
#         # Try to get the profile, or create it if it doesn't exist
#         profile, created = Profile.objects.get_or_create(user=user)
        
#         # Update the profile with the provided data
#         serializer = self.get_serializer(profile, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        
        
        

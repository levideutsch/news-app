from django.contrib.auth.models import User
from .models import Profile
from rest_framework import generics, status
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

import pdb

class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def put(self, request, *args, **kwargs):
        user = self.request.user
        
        if not user.is_authenticated:
            return JsonResponse({"error": "User is not authenticated"}, status=401)
        
        # Update user data
        user_data = request.data
        if 'email' in user_data:
            user.email = user_data['email']
        if 'username' in user_data:
            user.username = user_data['username']
        user.save()
        
        # pdb.set_trace()
        
        # Update profile data
        profile, created = Profile.objects.get_or_create(user=user)

        profile_data = {}
        if 'profile_photo' in request.FILES:
            profile_data['profile_photo'] = request.FILES['profile_photo']
        if 'age' in user_data:
            profile_data['age'] = user_data['age']
        if 'sex' in user_data:
            profile_data['sex'] = user_data['sex']
        if 'location' in user_data:
            profile_data['location'] = user_data['location']
        if 'x_link' in user_data:
            profile_data['x_link'] = user_data['x_link']  
        if 'facebook_link' in user_data:
            profile_data['facebook_link'] = user_data['facebook_link']
        if 'instagram_link' in user_data:
            profile_data['instagram_link'] = user_data['instagram_link']    
        if 'linkedin_link' in user_data:
            profile_data['linkedin_link'] = user_data['linkedin_link']         
        
        serializer = self.get_serializer(profile, data=profile_data, partial=True)
        # pdb.set_trace()
        if serializer.is_valid():
            serializer.save()
            
            # Combine user and profile data
            user_serializer = UserSerializer(user)
            user_serializer_data = user_serializer.data
            
            if profile.profile_photo:
                profile_photo_url = request.build_absolute_uri(profile.profile_photo.url)
                user_serializer_data['profile']['profile_photo'] = profile_photo_url
                
            return Response(user_serializer_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

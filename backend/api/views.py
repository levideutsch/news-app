from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Profile, Article
from rest_framework import generics, status, serializers
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse, Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import email_verification_token
from django.utils.encoding import force_str
from rest_framework_simplejwt.views import TokenObtainPairView
from decouple import config  # Import the config function to access .env variables
import pdb
from backend.settings import EMAIL_HOST_USER, FRONTEND_URL

# Pagination imports 
from rest_framework.pagination import PageNumberPagination
# pdb.set_trace()




# Create your views here.
class CustomObtainPairView(TokenObtainPairView):
    
    def post(self, request, *args, **kwargs):
        # pdb.set_trace()
        email = request.data.get("email").lower() if "email" in request.data else None
        password = request.data.get("password") 
        
        if not email or not password:
            raise ValidationError({"error": "Email and password are required."})
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise ValidationError({"error": "No account found with this email."})
        if not user.is_active:
            raise ValidationError({"error": "Please confirm your email before logging in."})
        if not user.check_password(password):
            raise ValidationError({"error": "Invalid password."})
        
        refresh = RefreshToken.for_user(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response(data, status=status.HTTP_200_OK)
    
# Register new user
class CreateUserView(generics.CreateAPIView): # Handles creation of new objects
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Allow any because we need to allow anyone to register
    

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
class CustomPagination(PageNumberPagination):
    page_size = 3    
    page_size_query_param = 'page_size'
    max_page_size = 10
    
# View for specific user   
class UserDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User does not exist")
        
        paginator = CustomPagination()
        articles = user.articles.filter(is_a_draft =False).order_by("-published_date")
        paginated_articles = paginator.paginate_queryset(articles, request)
        
        # Manually serialize each article to a dictionary
        articles_data = [
            {
                "id": article.id,
                "title": article.title,
                "created_at": article.created_at,
                "updated_at": article.updated_at,
                "photo_header": request.build_absolute_uri(article.photo_header.url) if article.photo_header else None,
            }
            # for article in user.articles.all() if article.is_a_draft == False
            # for article in user.articles.filter(is_a_draft=False).order_by("-published_date")
            for article in paginated_articles
        ]


        user_data = {
            "id": user.id,
            "username": user.username,
            "location":(
                user.profile.location if hasattr(user, "profile") and user.profile and hasattr(user.profile, "location") else None
                ) ,
            "profile_photo": (
                request.build_absolute_uri(user.profile.profile_photo.url) 
                if hasattr(user, "profile") and user.profile and user.profile.profile_photo and user.profile.profile_photo.name else None
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
            "articles": None #articles_data
        }
        
        return JsonResponse(user_data)
        # return paginator.get_paginated_response(user_data)
    
class SingleUsersArticles(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username, *args, **kwargs):
        try: 
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User does not exist")
        # pdb.set_trace()
        
        paginator = CustomPagination()
        articles = user.articles.filter(is_a_draft =False).order_by("-published_date")
        paginated_articles = paginator.paginate_queryset(articles, request)
        
        # Manually serialize each article to a dictionary
        articles_data = [
            {
                "id": article.id,
                "title": article.title,
                "created_at": article.created_at,
                "updated_at": article.updated_at,
                "photo_header": request.build_absolute_uri(article.photo_header.url) if article.photo_header else None,
            }
            # for article in user.articles.all() if article.is_a_draft == False
            # for article in user.articles.filter(is_a_draft=False).order_by("-published_date")
            for article in paginated_articles
        ]
        return paginator.get_paginated_response(articles_data)
        
    
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
                    if hasattr(user, 'profile') and user.profile and user.profile.profile_photo and user.profile.profile_photo.name else None                    
                ),
                "is_writer": (
                    user.profile.is_writer 
                    if hasattr(user, 'profile') and user.profile else None
                ),
                # "articles": [
                #     {
                #         "id": article.id,
                #         "title": article.title,
                #         "photo_header": (
                #             request.build_absolute_uri(article.photo_header.url)
                #             if article.photo_header else None
                #         ) 
                #     } 
                #     for article in user.articles.all()
                # ]
            }
            users_data.append(user_data)
            # pdb.set_trace()
        return JsonResponse(users_data, safe=False)   

    
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        password_confirmation = request.data.get("password_confirmation")
        
        if not username or not email or not password or not password_confirmation:
            return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != password_confirmation:
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
    
        user = User(
            username=username,
            email=email,
            is_active=False
        )
        user.set_password(password)
        # pdb.set_trace()
        try:
            user.save()
            
            token = email_verification_token.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url=FRONTEND_URL
            confirmation_link = f"/confirm-email/{uid}/{token}"
            
            html_message = f""""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome to The Offendinator</title>
            </head>
            <body style="background-color:#394853; color:#333; font-family:Arial, sans-serif; padding:20px;">
                <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:20px; border-radius:8px; box-shadow:0px 4px 8px rgba(0, 0, 0, 0.1);">
                    <p>Thank you for signing up to the Offendinator. Click on  <a href="{frontend_url+confirmation_link}" style="display:inline-block; text-decoration:none; background-color:#007BFF; color:white; padding:10px 20px; border-radius:5px; font-size:16px;">
                        this
                    </a> link to active your account</p>
                    <p style="color:#666; font-size:14px;">Best regards,<br>Your Django App</p>
                </div>
            </body>
            </html>
            """
            
            send_mail(
                subject="Confirm Email",
                message="Thank you for signing up for the Offendinator. Please confirm your email.",  # Plain text message
                from_email=EMAIL_HOST_USER,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,  # Optional: Change to True to suppress errors
            )
            
            
            Profile.objects.create(user=user)
            return Response({"detail": "User registered successfully. Please check your email to confirm."}, status=status.HTTP_201_CREATED)

        except Exception as e:
                # If email fails, rollback user creation
            return Response({"detail": f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.exceptions import ValidationError

class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            # Decode the base64 encoded user ID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)  # Retrieve the user by ID
            
        except (TypeError, ValueError, OverflowError) as e:
            # Handle errors during decoding
            return Response({"error": "Invalid UID format. Please check your link."}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            # Handle case where user does not exist
            return Response({"error": "User not found. Please ensure your link is correct."}, status=status.HTTP_404_NOT_FOUND)

        # Check if user exists and if the token is valid
        if user is not None:
            if email_verification_token.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({"message": "Email confirmed successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid token or token has expired."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User not found. Please ensure your link is correct."}, status=status.HTTP_404_NOT_FOUND)
        

class CheckingEnvStuff(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        
        data = {"1": EMAIL_HOST_USER, "2": FRONTEND_URL}
        return Response(data)
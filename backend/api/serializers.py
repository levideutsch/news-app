from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, WriterRequest, Article, ArticleParagraph, Tag, Comment
from .tokens import email_verification_token
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


# custom
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'age', 'sex', 'location', "is_writer",
            "age", "profile_photo", 'x_link', "instagram_link",
            "facebook_link", "linkedin_link"
            ]  
        
        
class WriterRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    username = serializers.SerializerMethodField()
    profile_photo = serializers.SerializerMethodField()
    class Meta:
        model = WriterRequest
        fields = ['id', 'user', 'request_date', 'approved', 'rejected', 'username', "profile_photo"]        
       
    def get_username(self, obj):
        return obj.user.username if obj.user else None  
    
    
    def get_profile_photo(self, obj):
        request = self.context.get('request')
        try:
            # Check if the user has a profile and profile photo
            if request and obj.user.profile.profile_photo:
                return request.build_absolute_uri(obj.user.profile.profile_photo.url)
        except User.profile.RelatedObjectDoesNotExist:
            # If the user has no profile, return None
            return None
        return None



class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'article', 'text', 'created_at', 'updated_at']

class ArticleParagraphSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField(allow_null=True)
    class Meta:
        model = ArticleParagraph
        fields = [ "id", "body", "photo", "article" ]
        
    def get_photo(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
            return request.build_absolute_uri(obj.photo.url)
        return None
    
    
    
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    writer_request = WriterRequestSerializer(source='writerrequest_set', many=True, read_only=True)
    # password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta: 
        model = User
        fields = [
            "id", "username", "password", "email",
            "is_superuser", "profile", "writer_request"
        ]
        extra_kwargs = {
            # "password": {"write_only": True, "required": True},
            # "email": {"required": True},
            # "username": {"required": True},
            "is_superuser": {"read_only": True},
            "profile": {"required": False}
        }

    # def validate(self, data):
    #     if data["password"] != data["password_confirmation"]:
    #         raise serializers.ValidationError("Passwords do not match.")
    #     return data

    # def create(self, validated_data):
    #     validated_data.pop('password_confirmation')

    #     user = User(
    #         username=validated_data["username"],
    #         email=validated_data["email"],
    #         is_active=False  # Inactive until email confirmation
    #     )
    #     user.set_password(validated_data["password"])
    #     user.save()

    #     # Create a profile for the new user
    #     Profile.objects.create(user=user)

        # Send confirmation email
        # self.send_confirmation_email(user)

        # return user

 
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ArticleSerializer(serializers.ModelSerializer):
    paragraphs = ArticleParagraphSerializer(many=True)
    photo_header = serializers.SerializerMethodField()  # Add this line for the photo_header URL
    user = UserSerializer()  # This will nest the full user object with profile info
    tags = TagSerializer(many=True)
    

    class Meta:
        model = Article
        fields = [
            'id', 'user', 'title', 'photo_header',
            'is_a_draft', 'created_at',
            'updated_at', 'paragraphs', "tags"
        ]
    
    def get_photo_header(self, obj):
        request = self.context.get('request')
        if obj.photo_header and hasattr(obj.photo_header, 'url'):
            return request.build_absolute_uri(obj.photo_header.url)
        return None    
        
    # def create(self, validated_data):
    #     paragraphs_data = validated_data.pop('paragraphs')
    #     article = Article.objects.create(**validated_data)
        
    #     # Create paragraphs linked to the article
    #     for paragraph_data in paragraphs_data:
    #         ArticleParagraph.objects.create(article=article, **paragraph_data)
        
    #     return article
    
    



    
    
    
    



from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, WriterRequest, Article, ArticleParagraph




    
    
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
    


class ArticleSerializer(serializers.ModelSerializer):
    paragraphs = ArticleParagraphSerializer(many=True)
    photo_header = serializers.SerializerMethodField()  # Add this line for the photo_header URL


    class Meta:
        model = Article
        fields = [
            'id', 'user', 'title', 'photo_header',
            'is_a_draft', 'created_at',
            'updated_at', 'paragraphs'
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


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    writer_request = WriterRequestSerializer(source='writerrequest_set', many=True, read_only=True)
    
    class Meta: 
        model = User
        fields = ["id", "username", "password", "email", "is_superuser", "profile", "writer_request"]
        extra_kwargs = {
            "password": {"write_only": True, "required": True}, # Make password required
            "email": {"required": True},  # This line makes the email field required
            "username": {"required": True},  # Make username required
            "is_superuser": {"read_only": True},  # is_superuser is managed by admin
            }
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create a profile for the new user
        Profile.objects.create(user=user)
        return user
    
    
    
    



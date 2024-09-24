from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    sex = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    is_writer = models.BooleanField(default=False)  
    
    x_link = models.CharField(max_length=255, blank=True, null=True)
    instagram_link = models.CharField(max_length=255, blank=True, null=True)
    facebook_link = models.CharField(max_length=255, blank=True, null=True)
    linkedin_link = models.CharField(max_length=255, blank=True, null=True)


    
    
    

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    
class WriterRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    request_date = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)  
    
    def __str__(self):
        return f"Request from {self.user.username} on {self.request_date}"
    




class Article(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles')
    title = models.CharField(max_length=200)
    photo_header = models.ImageField(upload_to='article_photos/', blank=True, null=True)
    text_links = models.CharField(max_length=500, blank=True, null=True)
    is_a_draft = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.user.username}"
    
    
class ArticleParagraph(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='paragraphs')
    body = models.TextField()
    photo = models.ImageField(upload_to='article_photos/', null=True, blank=True)
  
    
    class Meta:
        # Remove the ordering line
        pass

    def __str__(self):
        return f"Paragraph for {self.article.title}" 
    
    
    


from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import serializers
from .models import Article, ArticleParagraph
from .serializers import ArticleSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from .permissions import IsWriter
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse, Http404

import pdb


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    



    
      
class ArticleCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsWriter]

    def post(self, request, *args, **kwargs):
        # Extract article data
        article_data = {
            "user": request.user.id,
            'title': request.data.get('title'),
            'photo_header': request.data.get('photo_header'),
            'is_a_draft': request.data.get('is_a_draft'),
            'paragraphs': []  # Prepare for paragraphs
        }

        # Extract paragraphs data and append it to article_data['paragraphs']
        i = 0
        while f'paragraphs[{i}].body' in request.data:
            paragraph_data = {
                'body': request.data.get(f'paragraphs[{i}].body'),
                'order': request.data.get(f'paragraphs[{i}].order'),
            }

            # Only add the photo if it's provided and valid
            photo = request.data.get(f'paragraphs[{i}].photo')
            if photo and hasattr(photo, 'read'):  # Check if it's a file-like object
                paragraph_data['photo'] = photo

            article_data['paragraphs'].append(paragraph_data)
            i += 1

        # Create the article instance with nested paragraphs
        article_serializer = ArticleSerializer(data=article_data)
        if article_serializer.is_valid():
            article_serializer.save()
            return Response(article_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(article_serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

class WritersArticles(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404("User does not exist")
        
        # Get the type parameter from the query string
        article_type = request.query_params.get("type", "all")
        
        # Filter articles based on the type parameter
        if article_type == "published":
            articles = user.articles.filter(is_a_draft=False).order_by('-created_at')
        elif article_type == "draft":
            articles = user.articles.filter(is_a_draft=True).order_by('-created_at')
        elif article_type == "all":
            articles = user.articles.all()
        else:
            articles = []
        
        # Serialize articles with paragraphs
        article_serializer = ArticleSerializer(articles, many=True)
        articles_data = article_serializer.data
        
        # Update image URLs to be absolute
        for article in articles_data:
            if 'photo_header' in article and article['photo_header']:
                article['photo_header'] = request.build_absolute_uri(article['photo_header'])
            
            if 'paragraphs' in article:
                for paragraph in article['paragraphs']:
                    if 'photo' in paragraph and paragraph['photo']:
                        paragraph['photo'] = request.build_absolute_uri(paragraph['photo'])
        
        return JsonResponse(articles_data, safe=False)
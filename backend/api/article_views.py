from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import serializers
from .models import Article, ArticleParagraph, Tag
from .serializers import ArticleSerializer, ArticleParagraphSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from .permissions import IsWriter
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse, Http404
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.timezone import now, timedelta
from .services.article_service import ArticleService
# pdb.set_trace()
from django.db.models import Count
import json


import pdb


class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    
# POST new article with paragraphs   
class ArticleCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsWriter]

    def post(self, request, *args, **kwargs):
        # pdb.set_trace()
        # Convert is_a_draft from string to boolean
        is_a_draft = request.data.get('is_a_draft', 'false').lower() == 'true'
        
        # Extract and handle the photo_header file
        photo_header = request.FILES.get('photo_header')
        title = request.data.get('title', '')
        user = request.user

        article_data = {
            "user": user,
            'title': title,
            'photo_header': photo_header,
            'is_a_draft': is_a_draft,
            'paragraphs': []  # Prepare for paragraphs
        }

        # Extract paragraphs data and append it to article_data['paragraphs']
        i = 0
        while f'paragraphs[{i}].body' in request.data:
            paragraph_data = {
                'body': request.data.get(f'paragraphs[{i}].body', ''),
            }

            # Handle the photo if it's provided and valid
            photo = request.FILES.get(f'paragraphs[{i}].photo')
            if photo:
                paragraph_data['photo'] = photo

            article_data['paragraphs'].append(paragraph_data)
            i += 1

        # Create the article instance
        try:
            article = Article.objects.create(
                user=article_data['user'],
                title=article_data['title'],
                photo_header=article_data['photo_header'],
                is_a_draft=article_data['is_a_draft']
            )
            
         # Add tags to article 
            tags_str = request.data.get("tags", "")
            tags = [int(tag) for tag in tags_str.split(",") if tag.isdigit()]  
             
            tag_objects = Tag.objects.filter(id__in=tags)
            article.tags.add(*tag_objects)
            article.save()
            # pdb.set_trace()

            # Create paragraphs linked to the article
            for paragraph_data in article_data['paragraphs']:
                photo = paragraph_data.get('photo')
                if photo:
                    # Process the file if needed
                    pass

                ArticleParagraph.objects.create(
                    article=article,
                    body=paragraph_data['body'],
                    photo=photo
                )

            return Response({
                "id": article.id,
                "title": article.title,
                "photo_header": article.photo_header.url if article.photo_header else None,
                "is_a_draft": article.is_a_draft
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ArticleAndParagraphsUpdateView(APIView):

    def put(self, request, article_id):
        try:
            article = Article.objects.get(pk=article_id)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title')
        is_a_draft = request.data.get('is_a_draft', 'false').lower() == 'true'
        article.title = title
        article.is_a_draft = is_a_draft

        # Check if photo_header is a file, otherwise keep the original photo
        new_photo_header = request.data.get('photo_header')
        if isinstance(new_photo_header, InMemoryUploadedFile):
            article.photo_header = new_photo_header
        elif new_photo_header and not new_photo_header.startswith('http'):
            return Response({'error': 'Invalid photo_header format.'}, status=status.HTTP_400_BAD_REQUEST)

        article.save()
        
        updated_paragraphs = []

        # Process existing paragraphs
        for key, value in request.data.items():
            if key.startswith('paragraphs['):
                paragraph_id = key.split('[')[1].split(']')[0]

                if paragraph_id.isdigit():
                    try:
                        paragraph = ArticleParagraph.objects.get(pk=paragraph_id)
                        paragraph.body = request.data.get(f'paragraphs[{paragraph_id}][body]')
                        
                        # Update the photo if necessary
                        new_photo = request.data.get(f'paragraphs[{paragraph_id}][photo]')
                        if isinstance(new_photo, InMemoryUploadedFile):
                            paragraph.photo = new_photo
                        elif new_photo and not new_photo.startswith('http'):
                            return Response({'error': f'Invalid photo format for paragraph {paragraph_id}.'}, status=status.HTTP_400_BAD_REQUEST)

                        paragraph.save()
                        updated_paragraphs.append(paragraph)

                    except ArticleParagraph.DoesNotExist:
                        return Response({'error': f'Paragraph with id {paragraph_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

                # Process new paragraphs only once
        if 'new_paragraphs[0][body]' in request.data:
            processed_new_paragraphs = set()  # Keep track of processed paragraphs
            for key, value in request.data.items():
                if key.startswith('new_paragraphs['):
                    index = key.split('[')[1].split(']')[0]
                    
                    # Skip if this paragraph has already been processed
                    if index in processed_new_paragraphs:
                        continue

                    body = request.data.get(f'new_paragraphs[{index}][body]')
                    new_photo = request.data.get(f'new_paragraphs[{index}][photo]')

                    # Ensure that you only create the paragraph once
                    if body:
                        if new_photo and not isinstance(new_photo, InMemoryUploadedFile):
                            return Response({'error': 'Invalid new paragraph photo format.'}, status=status.HTTP_400_BAD_REQUEST)

                        new_paragraph = ArticleParagraph.objects.create(
                            article=article,
                            body=body,
                            photo=new_photo if isinstance(new_photo, InMemoryUploadedFile) else None
                        )
                        
                        updated_paragraphs.append(new_paragraph)
                        processed_new_paragraphs.add(index)  # Mark paragraph as processed

        updated_article_data = {
            'id': article.id,
            'title': article.title,
            'photo_header': article.photo_header.url if article.photo_header else None,
            'is_a_draft': article.is_a_draft,
        }

        paragraphs_data = [{
            'id': p.id,
            'body': p.body,
            'photo': p.photo.url if p.photo else None,
        } for p in updated_paragraphs]

        return Response({'article': updated_article_data, 'paragraphs': paragraphs_data}, status=status.HTTP_200_OK)
           
# GET Single writers articles
class WritersArticles(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, username, *args, **kwargs):
        # pdb.set_trace()
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
        article_serializer = ArticleSerializer(articles, many=True, context={'request': request})

        return Response(article_serializer.data)
    
# GET/:ID Single writers single article    
class WritersSingleArticle(APIView):
    permission_classes = [AllowAny]
    def get(self, request, article_id, *args, **kwargs):
        # pdb.set_trace()
        try:
            # Retrieve the article by ID
            article = Article.objects.get(id=article_id)
            
            # Serialize the article data
            serializer = ArticleSerializer(article, context={'request': request})
            
            # Return the serialized data in the response
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)
        
# DELETE delete single paragraph       
class ParagraphDeleteView(APIView):
    def delete(self, request, article_id, paragraph_id):
        # pdb.set_trace()
        try:
            paragraph = ArticleParagraph.objects.get(id=paragraph_id, article__id=article_id)
            paragraph.delete()
            return Response({'message': 'Paragraph deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except ArticleParagraph.DoesNotExist:
            return Response({'error': 'Paragraph not found'}, status=status.HTTP_404_NOT_FOUND)   
       
# DELETE delete entire article along with its paragraphs   
class ArticleDeleteView(APIView):
    def delete(self, request, article_id):
        # pdb.set_trace()
        try:
            article = Article.objects.get(id=article_id)
            article.delete()
            return Response({"message": 'Article and associated paragraphs deleted successfully'})             
        except Article.DoesNotExist:
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)

class HomePageArticles(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        try:
            # Get all articles excluding drafts, ordered by created_at date
            last_ten_articles = Article.objects.filter(
                is_a_draft=False,
            ).order_by("-published_date")

            # Get the latest article
            latest_article = last_ten_articles.first()

            # Exclude the latest article from the rest of the response
            articles_response = last_ten_articles.exclude(id=latest_article.id)[:10] if latest_article else last_ten_articles[:10]

            # Serialize the articles
            serializer = ArticleSerializer(articles_response, context={'request': request}, many=True)
            
            filtered_tags = Tag.objects.annotate(article_count=Count("articles")).filter(article_count__gt=0)
            popular_tags = [{"id": tag.id, "name": tag.name} for tag in filtered_tags]

            # Return the serialized articles along with the latest article and article count
            return Response({
                "past_day": serializer.data,  # Serialized data for past day articles
                "latest": ArticleSerializer(latest_article, context={'request': request}).data if latest_article else None,  # Serialize the latest article if it exists
                "number": articles_response.count(),  # Total number of articles excluding the latest
                "popular_tags": popular_tags
            }, status=status.HTTP_200_OK)

        except Article.DoesNotExist:
            return Response({
                "detail": "No articles found."
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Catch any unexpected errors and return a generic error message
            return Response({
                "detail": f"An error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # def get(self, request, *args, **kwargs):
    #     try:
    #         articles = ArticleService.get_articles(request)
    #         response_data = ArticleService.get_response_data(articles, request)
            
    #         return Response(response_data, status=200)
    #     except Article.DoesNotExist:
    #         return Response({"error": "No articles found"}, status=404)
        
        
class UserSingleArticleView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, article_id, *args, **kwargs):
        # pdb.set_trace()
        try:
            # Retrieve the article by ID
            article = Article.objects.get(id=article_id)
            
            # Serialize the article data
            serializer = ArticleSerializer(article, context={'request': request})
            
            # Return the serialized data in the response
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)      
        
        
# Articles for Home page
# class HomePageArticles(APIView):
#     permission_classes = [AllowAny]
    
#     def get(self, request, *args, **kwargs):
#         try:
#             time_threshold = now() - timedelta(hours=200)
#             # Find published articles created in the last 48 hours
#             articles_from_past_day = Article.objects.filter(
#                 is_a_draft=False,
#                 created_at__gte=time_threshold
#             ).order_by("-created_at")
            
            
            
#             latest_article = articles_from_past_day.first()
#             # Check if latest_article exists before serialization
#             if latest_article:
#                 latest_serializer = ArticleSerializer(latest_article, context={'request': request})
#             else:
#                 latest_serializer = None  # or handle the case when no articles exist
                
#             articles_from_past_day_response = articles_from_past_day.exclude(id=latest_article.id)    
#             serializer = ArticleSerializer(articles_from_past_day_response, context={'request': request},  many=True)
            
#             return Response({"past_day": serializer.data, "latest": latest_serializer.data, "number": articles_from_past_day_response.count() }, status=200)
#         except Article.DoesNotExist:
#             return Response({"error": "No articles found"}, status=404)
            
            # maximum amount of articles in array should be 20
            # if the amount is not 20, it should go to over a day ago and fill the array up to 20
            # go as many days as possible until 20 is filled
            # if there are not 20 altogether, then just send as many as there are
            # newest article of the 10 should be seperated and sent as "newest"

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Article, Tag
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TagSerializer
from django.http import JsonResponse, Http404
import string
import random
import pdb
from django.db.models import Count
# pdb.set_trace()


# Create new tag (admin)
class TagCRUDView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
        
    
    def post(self, request, *args, **kwargs):
        serializer = TagSerializer(data=request.data)
        # pdb.set_trace()
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk, *args, **kwargs):
        # pdb.set_trace()
        try:
            tag = Tag.objects.get(pk=pk)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TagSerializer(tag, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, pk, *args, **kwargs):
        try:
            tag = Tag.objects.get(pk=pk)
            # pdb.set_trace()
            tag.delete()
            return Response({"message": "Tag deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)
        

class DisplayPopularTags(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        # Filter tags with at least one related article
        tags_with_articles = Tag.objects.annotate(article_count=Count('articles')).filter(article_count__gt=0)

        # Extract tag names
        data = [tag.name for tag in tags_with_articles]

        return JsonResponse(data, safe=False)


class RelatedArticles(APIView):
     permission_classes = [AllowAny]
     def get(self, request, tag_id, *args, **kwargs):
         # find tag
        try:
            requested_tag = Tag.objects.get(id=tag_id)
        except Tag.DoesNotExist:
            raise Http404("Tag does not exist")
        
        tags_related_articles = Article.objects.filter(tags=requested_tag)
        article_array = [{"id": article.id, "title": article.title, "photo_header": request.build_absolute_uri(article.photo_header.url)} for article in tags_related_articles]
         
         # display related articles
        data = {
            "id": requested_tag.id,
            "name": requested_tag.name,
            "articles": article_array
        }
        return JsonResponse(data, safe=False)
         
         # return object of tag along with an array of related articles 
         
    




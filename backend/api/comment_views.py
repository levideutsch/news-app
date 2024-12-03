from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Comment, Article
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from .serializers import CommentSerializer
import pdb
# pdb.set_trace()

# Create comment
class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, article_id, *args, **kwargs):
        # pdb.set_trace()
        related_user = self.request.user
        related_article = get_object_or_404(Article, id=article_id)
        
        # Validate incoming data
        incoming_text = request.data.get('text')  # Assuming 'content' is the field name
        if not incoming_text or len(incoming_text) > 300:
            return Response(
                {"error": "Text is required and must not exceed 300 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        comment = Comment.objects.create(
            user=related_user,
            article=related_article,
            text=incoming_text,
        )
        
        serializer = CommentSerializer(comment)
        
                # Return success response
        return Response(
            {"message": "Comment created successfully!", "comment": serializer.data},
            status=status.HTTP_201_CREATED,
        )
        
        
# View all comments related to one post
class SingleArticlesComments(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, article_id, *args, **kwargs):
        related_article = get_object_or_404(Article, id=article_id)  
        
        comments = related_article.comments.order_by("-created_at")  # Use `.all()` to fetch the related objects

        if not comments.exists():  # Check if there are any comments
            return JsonResponse({"error": "No Content"}, status=404)
        
        data = [{"id": comment.id, "text": comment.text, "created_at": comment.created_at, "user": comment.user.username} for comment in comments]  # Use `content` instead of `text`

        return JsonResponse(data, safe=False, status=200)     

        
        

# Edit single comment
class CommentEditView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, comment_id, *args, **kwargs):
        comment = get_object_or_404(Comment, id=comment_id)
        updated_text = request.data.get("text")
        # pdb.set_trace()
        
        if not updated_text:
            return JsonResponse({"error": "Text field is required"}, status=400)
        
        # Manual validation for max_length
        if len(updated_text) > 300:
            return JsonResponse({"error": "Text cannot exceed 300 characters"}, status=400)
        
        
        comment.text = updated_text
        comment.save()
         
        data = {"id": comment.id, "text": comment.text, "created_at": comment.created_at, "user": comment.user.username}    
        return JsonResponse(data, status=200)
        

# Delete comment
class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, comment_id, *args, **kwargs):
        comment = get_object_or_404(Comment, id=comment_id)
        comment.delete()
        return Response({"message": "Comment successfully deleted"})
        
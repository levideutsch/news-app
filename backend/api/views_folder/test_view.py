from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
# from .models.models import Comment, Article
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
# from .serializers import CommentSerializer
import pdb

class TestView(APIView):
    permission_classes = [AllowAny]
    def get(request, self):
        return Response({"hello": "hey levi"})
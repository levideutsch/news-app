from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserProfileView, UserDetailView, AllUsersView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.profile_views import ProfileDetail
from api.writer_request_views import WriterRequestCreateView, WriterRequestListView, AdminWriterRequestUpdateView
from api.article_views import ArticleListView, ArticleCreateView, WritersArticles, ArticleAndParagraphsUpdateView, ParagraphDeleteView, ArticleDeleteView, WritersSingleArticle

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # Get token/ Login
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # Refresh token/ Stay logged in
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path("api/users/<str:username>/", UserDetailView.as_view(), name="single-user"),
    path("api/all-users/", AllUsersView.as_view(), name="all-users"),
    
    # Custom URL patterns for WriterRequest
    path("api/writer-requests/", WriterRequestCreateView.as_view(), name="create-writer-request"),
    path("api/writer-requests/list/", WriterRequestListView.as_view(), name="list-writer-requests"),
    path("api/admin/writer-requests/<int:pk>/", AdminWriterRequestUpdateView.as_view(), name="admin-update-writer-request"),
    
    # Article and paragraph routes
    path("api/articles/list/", ArticleListView.as_view(), name="article-list-view"),
    path('api/create-article/', ArticleCreateView.as_view(), name='article-create'), 
    path("api/my-articles/<str:username>/",WritersArticles.as_view(), name="writers-articles" ),
    
    path("api/article-and-paragraphs-update/<int:article_id>/", ArticleAndParagraphsUpdateView.as_view(), name="paragraph-create" ),


    path("api/articles/<int:article_id>/paragraphs/<int:paragraph_id>/delete/", ParagraphDeleteView.as_view(), name="paragraph-delete"),
    path("api/articles/<int:article_id>/delete/", ArticleDeleteView.as_view(), name="article-delete"),
    path("api/articles/<int:article_id>/", WritersSingleArticle.as_view(), name="article-detail"),
    
    # path("api/active-writer-list/", ActiveWriterListView.as_view(), name="active-writer-list"),
    
    path("api/handle-profile/", ProfileDetail.as_view(), name="handle-profile" ),
    path("api-auth/", include("rest_framework.urls")), 
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, UserProfileView, UserDetailView, AllUsersView, CustomObtainPairView, ConfirmEmailView, RegisterUserView, SingleUsersArticles, CheckingEnvStuff
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.profile_views import ProfileDetail
from api.writer_request_views import WriterRequestCreateView, AdminWriterRequestUpdateView
from api.article_views import ArticleListView, ArticleCreateView, WritersArticles, ArticleAndParagraphsUpdateView, ParagraphDeleteView, ArticleDeleteView, WritersSingleArticle, HomePageArticles, UserSingleArticleView
from api.email_views import SendEmailView, EmailPreviewView
from api.article_tag_views import TagCRUDView, DisplayPopularTags, RelatedArticles
from api.comment_views import SingleArticlesComments, CommentCreateView, CommentDeleteView, CommentEditView
from api.admin_views import AdminDashData


from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    path("api/checking-env/", CheckingEnvStuff.as_view(), name="checking-env"),
    
     path('api/send-email/', SendEmailView.as_view(), name='send_email'),
     path("api/confirm-email/<uidb64>/<token>/", ConfirmEmailView.as_view(), name="confirm-email"),
     path('api/email-preview/', EmailPreviewView.as_view(), name='email-preview'),
     
    # Admin routes
    path('admin/', admin.site.urls),
    path("api/writer-requests/", WriterRequestCreateView.as_view(), name="create-writer-request"),
    
    path("api/admin-dash-data/", AdminDashData.as_view(), name="list-writer-requests"),
    # path("api/tags/list/", TagsListView.as_view(), name="tags-list-view"),
    path("api/admin/writer-requests/<int:pk>/", AdminWriterRequestUpdateView.as_view(), name="admin-update-writer-request"),
    
    # User routes
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path("api/users/<str:username>/", UserDetailView.as_view(), name="single-user"),
    path("api/single-user-articles/<str:username>/", SingleUsersArticles.as_view(), name="single-user-articles"),
    path("api/all-users/", AllUsersView.as_view(), name="all-users"),
    
    # Auth routes
    # path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/register/", RegisterUserView.as_view(), name="register"),
    # path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # Get token/ Login
    path("api/token/", CustomObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # Refresh token/ Stay logged in
    
    
    # Writer/ article routes
    path("api/articles/list/", ArticleListView.as_view(), name="article-list-view"),
    path('api/create-article/', ArticleCreateView.as_view(), name='article-create'), 
    path("api/my-articles/<str:username>/",WritersArticles.as_view(), name="writers-articles" ),
    path("api/article-and-paragraphs-update/<int:article_id>/", ArticleAndParagraphsUpdateView.as_view(), name="paragraph-create" ),
    path("api/articles/<int:article_id>/paragraphs/<int:paragraph_id>/delete/", ParagraphDeleteView.as_view(), name="paragraph-delete"),
    path("api/articles/<int:article_id>/delete/", ArticleDeleteView.as_view(), name="article-delete"),
    path("api/articles/<int:article_id>/", WritersSingleArticle.as_view(), name="article-detail"),
    
    # Articles for home page
    path("api/todays-articles", HomePageArticles.as_view(), name="todays-articles"),
    path("api/user-single-article-view/<int:article_id>/", UserSingleArticleView.as_view(), name="user-single-article-view"),
    # path("api/active-writer-list/", ActiveWriterListView.as_view(), name="active-writer-list"),
    
    # Tags for admin
    path("api/tags/", TagCRUDView.as_view(), name='tag-list-create'), # For GET (list) and POST (create)
    path("api/tags/<int:pk>/", TagCRUDView.as_view(),  name='tag-detail'), # For PUT (update) and DELETE (delete)
    path("api/popular-tags/", DisplayPopularTags.as_view(), name="popular-tags"),
    path("api/tags/related-articles/<int:tag_id>/", RelatedArticles.as_view(), name="tags-related_articles"),
    
    # Comment views
    path("api/create-comment/<int:article_id>/", CommentCreateView.as_view(), name="create-comment"),
    path("api/comments/<int:article_id>/", SingleArticlesComments.as_view(), name="single-article-comments"),
    path("api/delete-comment/<int:comment_id>/", CommentDeleteView.as_view(), name="delete-comment"),
    path("api/edit-comment/<int:comment_id>/", CommentEditView.as_view(), name="edit-comment"),
    
    
    path("api/handle-profile/", ProfileDetail.as_view(), name="handle-profile" ),
    path("api-auth/", include("rest_framework.urls")), 
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

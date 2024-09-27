from datetime import timedelta
from django.utils.timezone import now
from ..models import Article
from ..serializers import ArticleSerializer

class ArticleService:
    # Static method to retrieve articles based on specific criteria
    @staticmethod
    def get_articles(request):
        # Calculate the time threshold for filtering articles created in the last 200 hours
        time_threshold = now() - timedelta(hours=200)
        
        # Query the Article model to find published articles created after the time threshold
        articles = Article.objects.filter(
            is_a_draft=False,  # Only include published articles
            created_at__gte=time_threshold  # Filter articles created after the threshold
        ).order_by("-created_at")  # Order articles by creation date in descending order
        
        return articles  # Return the queryset of articles

    # Static method to get the latest article from the provided queryset
    @staticmethod
    def get_latest_article(articles):
        # Retrieve the first article from the queryset, which is the latest due to ordering
        latest_article = articles.first()
        return latest_article  # Return the latest article

    # Static method to construct the response data for the API
    @staticmethod
    def get_response_data(articles, request):
        # Get the latest article from the queryset
        latest_article = articles.first()
        
        # Exclude the latest article from the articles response if it exists
        articles_response = articles.exclude(id=latest_article.id) if latest_article else articles
        
        # Serialize the articles excluding the latest one
        serializer = ArticleSerializer(articles_response, context={'request': request}, many=True)
        
        # Construct the response data dictionary
        return {
            "past_day": serializer.data,  # Serialized data for past day articles
            "latest": ArticleSerializer(latest_article, context={'request': request}).data if latest_article else None,  # Serialize the latest article if it exists
            "number": articles_response.count()  # Count of articles in the response
        }
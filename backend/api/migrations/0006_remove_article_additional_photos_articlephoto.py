# Generated by Django 4.2.15 on 2024-09-09 17:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_profile_facebook_link_profile_instagram_link_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='additional_photos',
        ),
        migrations.CreateModel(
            name='ArticlePhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to='article_photos/')),
                ('marker', models.CharField(help_text='Marker to identify where the photo is placed in the article (e.g., {{image1}}).', max_length=20)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='additional_photos', to='api.article')),
            ],
        ),
    ]

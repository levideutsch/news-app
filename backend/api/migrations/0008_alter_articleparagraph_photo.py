# Generated by Django 4.2.15 on 2024-09-11 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_articleparagraph_remove_article_body_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='articleparagraph',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='article_photos/'),
        ),
    ]

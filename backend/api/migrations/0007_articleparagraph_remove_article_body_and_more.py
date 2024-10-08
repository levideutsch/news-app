# Generated by Django 4.2.15 on 2024-09-09 19:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_article_additional_photos_articlephoto'),
    ]

    operations = [
        migrations.CreateModel(
            name='ArticleParagraph',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('photo', models.ImageField(upload_to='article_photos/')),
                ('order', models.PositiveIntegerField()),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.RemoveField(
            model_name='article',
            name='body',
        ),
        migrations.DeleteModel(
            name='ArticlePhoto',
        ),
        migrations.AddField(
            model_name='articleparagraph',
            name='article',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='paragraphs', to='api.article'),
        ),
    ]

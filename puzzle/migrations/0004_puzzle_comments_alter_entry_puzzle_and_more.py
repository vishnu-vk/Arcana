# Generated by Django 4.1.7 on 2023-03-18 04:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('puzzle', '0003_alter_entry_puzzle'),
    ]

    operations = [
        migrations.AddField(
            model_name='puzzle',
            name='comments',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='entry',
            name='puzzle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='puzzle.puzzle'),
        ),
        migrations.AlterField(
            model_name='puzzle',
            name='number',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='userProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point', models.IntegerField(default=0)),
                ('enterd_ans', models.TextField(default='')),
                ('enterd_cor', models.TextField(default='')),
                ('curr_puzzle', models.IntegerField(default=0)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('puzz_started', models.DateTimeField(default=django.utils.timezone.now)),
                ('phaseone_end', models.DateTimeField(default=django.utils.timezone.now)),
                ('phasetwo_end', models.DateTimeField(default=django.utils.timezone.now)),
                ('current_phase', models.IntegerField(default=1)),
                ('multx', models.FloatField(default=2.0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]

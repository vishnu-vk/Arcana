
from __future__ import unicode_literals
from datetime import datetime
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.models import User
import datetime
from django.utils import timezone
BOOL_DOWN = ((True, 'Down'), (False, 'Across'))
PUZZLE_TYPES = ((0, 'Blocked'), (1, 'Barred'))


from django.db.models.signals import *


class userProfile(models.Model):

    user = models.OneToOneField(User, related_name='profile',on_delete=models.CASCADE)
    point = models.IntegerField(default=0)
    enterd_ans=models.TextField(default='')
    enterd_cor=models.TextField(default='')
    curr_puzzle=models.IntegerField(default=0)
    time = models.DateTimeField(default=timezone.now)
    puzz_started=models.DateTimeField(default=timezone.now)
    phaseone_end=models.DateTimeField(default=timezone.now)
    phasetwo_end=models.DateTimeField(default=timezone.now)
    current_phase=models.IntegerField(default=1)
    multx=models.FloatField(default=2.0)
    def __self__(self):  
        return self.user.email

def create_user_profile(sender, instance, created, **kwargs):
    if created:
     userProfile.objects.create(user=instance)
post_save.connect(create_user_profile, sender=User)

def default_user():
    """Default user for new puzzles."""
    user = User.objects.filter(is_staff=True).order_by('date_joined').first()
    return user.id if user else None

def default_number():
    """Default puzzle number is one greater than the last used."""
    if Puzzle.objects.count():
        return Puzzle.objects.latest('number').number + 1
    return 0

def default_pub_date():
    """Default publish date is way off in the future."""
    return 


class Puzzle(models.Model):
    """Puzzles to solve. Non-editable fields are unused."""
    user = models.ForeignKey(User, models.CASCADE, default=default_user)
    number = models.IntegerField(default=0)
    title = models.CharField('Title', max_length=200)
    pub_date = models.DateTimeField('publication date', default=default_pub_date)
    size = models.IntegerField(default=15, editable=False)
    type = models.IntegerField(default=0, choices=PUZZLE_TYPES, editable=False)
    comments = models.TextField(blank=True,default='')

    class Meta:
        unique_together = (('user', 'number'),)

    def __str__(self):
        return str(self.user.username + ' #' + str(self.number))

    def get_absolute_url(self):
        """Link to go from the puzzle's admin page to the puzzle itself."""
        return reverse('puzzle')

class Entry(models.Model):
    """Individual clue/answer entries within a puzzle."""
    puzzle = models.ForeignKey(Puzzle, models.CASCADE)
    clue = models.CharField(max_length=200)
    answer = models.CharField(max_length=30)
    x = models.IntegerField()
    y = models.IntegerField()
    weight=models.IntegerField(default=5)
    down = models.BooleanField('direction', choices=BOOL_DOWN, default=False)

    class Meta:
        verbose_name_plural = 'entries'

    def __str__(self):
        return self.answer



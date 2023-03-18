from django.urls import include, path, re_path

from . import views




# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('rules/', views.rules, name='rules'),
    path('about/', views.about, name='about'),
    path('scoreboard/', views.scoreboard, name='scoreboard'),
    path('puzzle/', views.puzzle, name='puzzle'),
    re_path(r'^ajax/validate_answer/$', views.validate_answer, name='validate_answer'),
    re_path(r'^ajax/next_puzzle/$', views.next_puzzle, name='next_puzzle'),
    re_path(r'^ajax/phase_change/$', views.phase_change, name='phase_change'),
    path('', views.home, name='home'),
]
from django.shortcuts import render, redirect
from django.dispatch import receiver, Signal
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.decorators import login_required
from django.views.decorators.gzip import gzip_page
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
# from django.core.urlresolvers import reverse
from django.http import JsonResponse
from puzzle.construction import display_puzzle
from puzzle.models import Puzzle,Entry,userProfile
from .models import Puzzle


# Create your views here.

def home(request):
    if(request.user.is_authenticated):
        return redirect('puzzle')
    return render(request,'puzzle/home.html', {})

def about(request):
    return render(request,'puzzle/about.html', {})

def rules(request):
    return render(request,'puzzle/rules.html', {})

def scoreboard(request):
    obj=userProfile.objects.filter(user__is_staff=False).order_by('time')#[:30]
    dic={'ob':obj}
    return render(request, 'puzzle/scoreboard.html', dic)

@login_required
@gzip_page
def puzzle(request):
    """Show a puzzle by puzzle number."""
    usrpro=userProfile.objects.get(user__id=request.session['activeemail'])
    puzz_no=usrpro.curr_puzzle
    total=Puzzle.objects.count()
    if(puzz_no==0):
        puzz_no=1
        visiblestart(puzz_no,usrpro)
        usrpro.curr_puzzle=puzz_no
        usrpro.save()
    if needphase_change(usrpro):
        change_phase(usrpro)
    obj = get_object_or_404(Puzzle,  number=puzz_no)
    title = obj.title
    return display_puzzle(request, obj, title,usrpro,'puzzle/puzzle.html',total)

def visiblestart(puzz_no,up):
    pz=Puzzle.objects.get(number=puzz_no)
    up.enterd_ans=''
    up.enterd_cor=''
    up.puzz_started=timezone.now()
    up.phaseone_end=timezone.now()+timezone.timedelta(days=0,hours=6,minutes=0)
    up.phasetwo_end=timezone.now()+timezone.timedelta(days=0,hours=12,minutes=0)
    up.multx=3
    up.current_phase=1
    up.save()
    return

def next_puzzle(request):

    usrpro=userProfile.objects.get(user__id=request.session['activeemail'])
    usrpro.curr_puzzle +=1
    usrpro.save()
    visiblestart(usrpro.curr_puzzle,usrpro)
    status={'now':"True"}
    return JsonResponse(status)

def phase_change(request):
    usrpro=userProfile.objects.get(user__id=request.session['activeemail'])
    change_phase(usrpro)
    status={'now':"True"}
    return JsonResponse(status)

def needphase_change(usrobj):
    if(usrobj.current_phase == 1):
        present=timezone.now()
        phaseTime=usrobj.phaseone_end
        if(present> phaseTime):
            return True
    elif(usrobj.current_phase == 2):
        present=timezone.now()
        phaseTime=usrobj.phasetwo_end
        if(present> phaseTime):
            return True
    return False
def change_phase(usrobj):
    if(usrobj.current_phase == 1):
        usrobj.current_phase = 2
        usrobj.multx = 2.0
    elif(usrobj.current_phase == 2):
        usrobj.current_phase = 3
        usrobj.multx = 1
    usrobj.save()
    return

def validate_answer(request):
    ans=request.GET.get('ansdata')
    puz_no=int(request.GET.get('puzno'))
    dir=request.GET.get('dir')
    X=request.GET.get('x-index')
    Y=request.GET.get('y-index')
    if(ans and puz_no and dir and X and Y):
        if(dir=="Down"):
            dir_a=True
        else:
            dir_a=False
        print("s2")
        obj = get_object_or_404(Puzzle,  number=puz_no)
        av=Entry.objects.get(puzzle=obj, down=dir_a,x=int(X),y=int(Y)).answer.upper()
        if av:
            weigh=(Entry.objects.get(puzzle=obj, down=dir_a,x=int(X),y=int(Y)).weight)
            print("s4")
            print(av)
            if(av==ans):
                a=userProfile.objects.get(user__id=request.session['activeemail'])
                status={'match':av}
                if(ans not in a.enterd_ans):
                    a.point=(weigh*a.multx)+a.point
                    a.time=timezone.now()
                    a.enterd_ans=a.enterd_ans+","+ans
                    if(dir_a):
                        length=len(av)
                        tmpx=X.zfill(2)
                        for i in range(0,length):
                            t=int(Y)+i
                            tmpy=str(t).zfill(2)
                            a.enterd_cor=a.enterd_cor+"*"+tmpx+'-'+tmpy
                    else:
                        length=len(av)
                        tmpy=Y.zfill(2)
                        for i in range(0,length):
                            t=int(X)+i
                            tmpx=str(t).zfill(2)
                            a.enterd_cor=a.enterd_cor+"*"+tmpx+'-'+tmpy
                    a.save()
                    
            else:
                status={'match':""}
            
            return JsonResponse(status)
    return JsonResponse({'match':""})

@receiver(user_logged_in)
def handle_user_login(sender, user, request, **kwargs):
    print("dd = ", user.id)
    request.session['activeemail'] = user.id

def error_404_view(request, exception):
    return render(request, 'puzzle/404.html')

def error_500_view(request):
    return render(request, 'puzzle/500.html')
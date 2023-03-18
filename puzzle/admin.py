from django.contrib import admin
from xml.etree import ElementTree
from django.contrib import admin
from django.db.models import CharField
from django.forms import TextInput, FileField, ModelForm
from .models import Puzzle, Entry, userProfile
# Register your models here.

XMLNS = '{http://crossword.info/xml/rectangular-puzzle}'

def import_from_xml(xml, puzzle):

    crossword = ElementTree.parse(xml).find('*/%scrossword' % XMLNS)

    for word in crossword.iter('%sword' % XMLNS):
        xraw = word.attrib['x'].split('-')
        yraw = word.attrib['y'].split('-')
        xstart = int(xraw[0])
        ystart = int(yraw[0])
        down = len(yraw) > 1
        clue = crossword.find('*/%sclue[@word="%s"]' % (XMLNS, word.attrib['id'])).text
        if 'solution' in word.attrib:
            answer = word.attrib['solution']
        else:
            answer = ''
            if down:
                for y in range(ystart, int(yraw[1]) + 1):
                    answer += crossword.find('*/%scell[@x="%d"][@y="%d"]' %
                                             (XMLNS, xstart, y)).attrib['solution'].lower()
            else:
                for x in range(xstart, int(xraw[1]) + 1):
                    answer += crossword.find('*/%scell[@x="%d"][@y="%d"]' %
                                             (XMLNS, x, ystart)).attrib['solution'].lower()

        # XML is 1-based, model is 0-based
        xstart -= 1
        ystart -= 1
        entry = Entry(puzzle=puzzle, clue=clue, answer=answer, x=xstart, y=ystart, down=down)
        entry.save()



class PuzzleImportForm(ModelForm):
  
    file_import = FileField(label='Import from XML', required=False)
    class Meta:
        model = Puzzle
        fields = ['number', 'user', 'pub_date','title']

class EntryInline(admin.StackedInline):

    model = Entry
    formfield_overrides = {CharField: {'widget': TextInput(attrs={'size':'100'})}}

class PuzzleAdmin(admin.ModelAdmin):
    
    form = PuzzleImportForm
    inlines = [EntryInline]

    def save_model(self, request, obj, form, change):
        super(PuzzleAdmin, self).save_model(request, obj, form, change)
        xml_file = form.cleaned_data.get('file_import', None)
        if xml_file:
            import_from_xml(xml_file, obj)





admin.site.site_header = "Arcana"
admin.site.site_title = "Arcana"
admin.site.register(Puzzle,PuzzleAdmin)
admin.site.register(userProfile)
"""
Helper functions for constructing views.

Includes conversions between the database format, expanded grid info for rendering,
SVG thumbnails, and ipuz format for saving.
"""

import json,random
from re import sub, split
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied
from django.shortcuts import render
from django.utils import timezone
from django.utils.html import escape
from puzzle.models import Puzzle, Entry, default_pub_date


def create_grid(obj, size):
    """Create a 2D array describing each square of the puzzle.

    Each square gets a row, column, and type attribute.
    Numbered squares get a number, and light squares get a letter for the solution.
    The topmost row and leftmost column get extra markup to help render borders around the grid.
    """
    entries = Entry.objects.filter(puzzle=obj).order_by('y', 'x')
    grid = []
    number = 1

    # Initialise to a blank grid
    for row in range(size):
        grid.append([])
        for col in range(size):
            grid[row].append({'row': row, 'col': col, 'type': 'block',
                              'number': None, 'letter': None})

    # Populate with entries
    for entry in entries:
        row, col = entry.y, entry.x
        answer = sub("[' -]", '', entry.answer)
        if not grid[row][col]['number']:
            grid[row][col]['number'] = number
            number += 1
        for letter in answer:
            grid[row][col]['type'] = 'light'
            if letter != '.':
                grid[row][col]['letter'] = letter.upper()
            if entry.down:
                row += 1
            else:
                col += 1

    # Add some edges
    for i in range(size):
        grid[0][i]['type'] += ' topmost'
        grid[i][0]['type'] += ' leftmost'

    # All done!
    return grid


def get_clues(obj, grid, down):
    """Get an array of across or down clues. Numeration is generated from the answer text."""
    entries = Entry.objects.filter(puzzle=obj, down=down).order_by('y', 'x')
    clues = []
    for entry in entries:
        clues.append({'number': grid[entry.y][entry.x]['number'], 'clue': entry.clue, 'x': entry.x, 'y': entry.y})
    return clues


def display_puzzle(request, obj, title, anscor ,template,total):
    """Main helper to render a puzzle which has been pulled out of the database."""
    now = timezone.now()
    grid = create_grid(obj, 15,)
    across_clues = get_clues(obj, grid, False)
    down_clues = get_clues(obj, grid, True)
    starttime=anscor.puzz_started
    c_phase=anscor.current_phase
    if(c_phase==1):
        countertime=  anscor.phaseone_end 
        print(countertime)
        clue_list=across_clues+down_clues
        random.shuffle(clue_list)
        random.shuffle(clue_list)
        context = {'title': title, 'description': "PHASE-1 POINT X 3", 'number': obj.number,
               'author': obj.user.username, 'grid': grid,
               "clues_list":clue_list,
               'anscor':anscor.enterd_cor,
               'total':total,
               'starttime':starttime,
               'countertime':countertime,
               "c_phase":c_phase,
               }
    elif(c_phase==2):
        countertime=anscor.phasetwo_end
        random.shuffle(across_clues)
        random.shuffle(down_clues)
        random.shuffle(across_clues)
        random.shuffle(down_clues)
        context = {'title': title, 'description': "PHASE-2 POINT X 2",'number': obj.number,
               'author': obj.user.username, 'grid': grid,
               'across_clues': across_clues, 'down_clues': down_clues,
               'anscor':anscor.enterd_cor,
               'total':total,
               'starttime':starttime,
               'countertime':countertime,
               "c_phase":c_phase,
               }
    else:
        context = {'title': title, 'description': "PHASE-3 POINT X 1", 'number': obj.number,
               'author': obj.user.username, 'grid': grid,
               'across_clues': across_clues, 'down_clues': down_clues,
               'anscor':anscor.enterd_cor,
               'total':total,
               'starttime':starttime,
               'countertime':timezone.now(),
               "c_phase":c_phase,
               }

    return render(request, template, context)


var ClassShim = (function() {
	return {
		addClass: function(el, className) {
			if (el.classList)
				el.classList.add(className);
			else
				el.className += ' ' + className;
		},

		removeClass: function(el, className) {
			if (el.classList)
				el.classList.remove(className);
			else {
				el.className = el.className.replace(
					new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		},

		hasClass: function(el, className) {
			if (el.classList)
				return el.classList.contains(className);
			else
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	};
})();

var tmp='';
var xindex;
var yindex;
var le;
var dir;
/* exported GridModule */
var GridModule = (function() {
	function Entry(x, y, down, length, target) {
		this.set = function(x, y, down, length, target) {
	
			this.x = x;
			this.y = y;
			this.down = down;
			this.length = length;
			this.target = target;
		};

		this.clear = function() {
			
			this.x = null;
			this.y = null;
			this.down = false;
			this.length = 0;
			this.target = 0;
		};

		this.iterate = function(f) {
			var x = this.x;
			var y = this.y;
			for (var i = 0; i < this.length; i++) {
				f(x, y);
				if (this.down)
					y++;
				else
					x++;
			}
		};

		this.set(x, y, down, length, target);
	}

	function Square() {
		this.head = false;
		this.light = false;
		this.div = null;
	}

	
	function Grid(size, changeListener) {
		var grid = [];
		var storageName;
		var active = new Entry();
		active.clear();

		/* --- Iterators --- */

		var iterateLights = function(f) {
			for (var y = 0; y < size; y++) {
				for (var x = 0; x < size; x++) {
					if (grid[x][y].light) {
						f(x, y);
					}
				}
			}
		};

		/* --- Property tests --- */

		var headAcross = function(x, y) {
			return grid[x][y].head && x < (size - 1) && grid[x + 1][y].light && (x === 0 || !grid[x - 1][y].light);
		};

		var headDown = function(x, y) {
			return grid[x][y].head && y < (size - 1) && grid[x][y + 1].light && (y === 0 || !grid[x][y - 1].light);
		};

		var hasDirection = function(x, y, down) {
			if (down) {
				return grid[x][y].light &&
					((y > 0 && grid[x][y - 1].light) ||
					 (y < (size - 1) && grid[x][y + 1].light));
			} else {
				return grid[x][y].light &&
					((x > 0 && grid[x - 1][y].light) ||
					 (x < (size - 1) && grid[x + 1][y].light));
			}
		};

		/* --- Target control --- */

		var getTarget = function() {
			var x = active.x;
			var y = active.y;
			if (active.down)
				y += active.target;
			else
				x += active.target;

			return {x: x, y: y};
		};

		var isTarget = function(x, y) {
			var target = getTarget();
			return (x == target.x && y == target.y);
		};

		this.targetPosition = function() {
			var target = getTarget();
			return grid[target.x][target.y].div.offsetTop;
		};

		var clearHighlights = function() {
			active.iterate(function(x, y) {
				ClassShim.removeClass(grid[x][y].div, 'target');
				ClassShim.removeClass(grid[x][y].div, 'highlight');
			});
		};

		var setActive = function(x, y, down) {
			var old = {x: active.x, y: active.y, down: active.down};
			clearHighlights();
		
			// validate(active.x,active.y,active.length,active.dir);
			active.set(x, y, down, 1, 0);
			ClassShim.addClass(grid[x][y].div, 'target');

			if (down) {
				while (active.y > 0 && grid[x][active.y - 1].light) {
					active.y--;
					active.length++;
					active.target++;
					ClassShim.addClass(grid[x][active.y].div, 'highlight');
				}

				while (y < (size - 1) && grid[x][y + 1].light) {
					y++;
					active.length++;
					ClassShim.addClass(grid[x][y].div, 'highlight');
				}
			} else {
				while (active.x > 0 && grid[active.x - 1][y].light) {
					active.x--;
					active.length++;
					active.target++;
					ClassShim.addClass(grid[active.x][y].div, 'highlight');
				}

				while (x < (size - 1) && grid[x + 1][y].light) {
					x++;
					active.length++;
					ClassShim.addClass(grid[x][y].div, 'highlight');
				}
			}

			if (changeListener && (active.x != old.x || active.y != old.y || active.down != old.down))
				changeListener('move');
		};

		var doClearActive = function() {
			
			//$('#CheckAnswerBtt').click();

			clearHighlights();
			
			active.clear();
			if (changeListener)
				changeListener('move');
		};

		var validate=function(xindex,yindex,le,dir,tempval)
			{
				var di;
				if(dir){
					di="Down";
				}
				else{
					di="Across";
				}
				$.ajax({
					url: '/ajax/validate_answer/',
					data: {
					'puzno':puzzle_number,
					'dir':di,
					'x-index':xindex,
					'y-index':yindex,
					'ansdata':String(tempval),
					},
					dataType: 'json',
					success:function(status) 
					{
					a=String(status.match);
					b=String(tempval);
					if(a==b) 
					{
						
						saveLetters();


						if(di=="Down")
							{
							for(var i=0;i<le;i++)
							{
								
								grid[xindex][yindex].div.setAttribute("data-a",tempval[i]);
							
								
								// grid[xindex][yindex].div.removeChild(atem[0]);
								
								 yindex++;
								
								
							}
							}
						else{
							for(var i=0;i<le;i++)
							{
								
								grid[xindex][yindex].div.setAttribute("data-a",tempval[i]);
								
								// grid[xindex][yindex].div.removeChild(atem[0]);
								
								 xindex++;
								
							}
							
						}


					}
					else
					{
						if(di=="Down")
							{
							for(var i=0;i<le;i++)
							{
								try{
								var atem = grid[xindex][yindex].div.getElementsByClassName('letter');
								if(atem[0]!=undefined  )
								{
									if(grid[xindex][yindex].div.getAttribute("data-a")!=undefined)
									{
										if((grid[xindex][yindex].div.getAttribute("data-a"))!=(grid[xindex][yindex].div.getElementsByClassName("letter")[0].innerHTML))
										{
											grid[xindex][yindex].div.getElementsByClassName("letter")[0].innerHTML=grid[xindex][yindex].div.getAttribute("data-a")
										}
									}
									else{
										grid[xindex][yindex].div.removeChild(atem[0]);
									}
									// alert(grid[xindex][yindex].div.getAttribute("data-a"));	
								// grid[xindex][yindex].div.removeChild(atem[0]);
								}
								 yindex++;
								}
								catch{
									console.log("empty");
									return
								}
							}
							}
						else{
							for(var i=0;i<le;i++)
							{
								try{
								var atem = grid[xindex][yindex].div.getElementsByClassName('letter');
								if(atem[0]!=undefined )
								{
									if(grid[xindex][yindex].div.getAttribute("data-a")!=undefined)
									{
										if((grid[xindex][yindex].div.getAttribute("data-a"))!=(grid[xindex][yindex].div.getElementsByClassName("letter")[0].innerHTML))
										{
											grid[xindex][yindex].div.getElementsByClassName("letter")[0].innerHTML=grid[xindex][yindex].div.getAttribute("data-a")
										}
									}
									else{
										grid[xindex][yindex].div.removeChild(atem[0]);
									}
								}
								 xindex++;
								}
								catch{
									return
								}
							}
						}
						saveLetters();
					}
					
					}
				});
				
			};


		this.clearActive = function() {
			doClearActive();
		};

		this.activateClicked = function(div) {
			//alert("ok");
			//$('#CheckAnswerBtt').click();
			// if(active.letter!='')
			// {
			// 	alert("pk");
			// 	alert(active.letter);
			// }
			if(active.x!=null)
			{

				try{
				if(active.down)
				{
					var le=active.y+active.length;
					for(var i=active.y;i<le;i++)
					{
						var t=grid[active.x][i].div.getElementsByClassName('letter')[0].innerHTML;
						tmp=tmp+t;
					}
				}
				else{
					// alert(active.x);
					// alert(active.y);
					var le=active.x+active.length;
					 for(var i=active.x;i<le;i++)
					 {
						
						var t=grid[i][active.y].div.getElementsByClassName('letter')[0].innerHTML;
						tmp=tmp+t;
					 }
				}}
				catch{
					tmp=" ";
				}
				validate(active.x,active.y,active.length,active.down,tmp);
			}
			tmp='';
			var xindex=null;
			var yindex=null;
			var le=null;
			var dir=null;
			var x = parseInt(div.getAttribute('data-x'));
			var y = parseInt(div.getAttribute('data-y'));
			var direction;

			if (!grid[x][y].light) {
				doClearActive();
				return false;
			} else if (isTarget(x, y)) {
				direction = hasDirection(x, y, !active.down) ? !active.down : active.down;
			} else if (headAcross(x, y) && !headDown(x, y)) {
				direction = false;
			} else if (headDown(x, y) && !headAcross(x, y)) {
				direction = true;
			} else {
				direction = hasDirection(x, y, active.down) ? active.down : !active.down;
			}

			setActive(x, y, direction);
			return true;
		};

		this.activateNext = function() {
			var x = active.x;
			var y = active.y;
			var down = active.down;

			for (;;) {
				x++;

				if (x >= size) {
					x = 0;
					y++;
				}

				if (y >= size) {
					x = 0;
					y = 0;
					down = !down;
				}

				if ((!down && headAcross(x, y)) || (down && headDown(x, y))) {
					setActive(x, y, down);
					break;
				}
			}
		};

		this.activatePrevious = function() {
			var x = active.x;
			var y = active.y;
			var down = active.down;

			for (;;) {
				x--;

				if (x < 0) {
					x = size - 1;
					y--;
				}

				if (y < 0) {
					x = size - 1;
					y = size - 1;
					down = !down;
				}

				if ((!down && headAcross(x, y)) || (down && headDown(x, y))) {
					setActive(x, y, down);
					break;
				}
			}
		};

		this.isActive = function() {
			return active.length > 0;
		};

		this.moveTarget = function(dx, dy) {
			var target = getTarget();
			target.x += dx;
			target.y += dy;
			if (target.x >= 0 && target.x < size &&
				target.y >= 0 && target.y < size &&
				grid[target.x][target.y].light) {
				setActive(target.x, target.y, hasDirection(target.x, target.y, active.down) ? active.down : !active.down);
			}
		};

		/* --- Letter control --- */

		var getLetter = function(x, y) {
			var elList = grid[x][y].div.getElementsByClassName('letter');
			if (elList.length)
				return elList[0].innerHTML;
			else
				return '';
		};

		var clearLetter = function(x, y) {
			var elList = grid[x][y].div.getElementsByClassName('letter');
			if (elList.length) {
				grid[x][y].div.removeChild(elList[0]);
				return true;
			} else
				return false;
		};

		var setLetter = function(x, y, letter) {
			clearLetter(x, y);

			if (letter) {
				var el = document.createElement('span');
				ClassShim.addClass(el, 'letter');
				el.innerHTML = letter.toUpperCase();
				grid[x][y].div.appendChild(el);
			}
		};

		var revealLetter = function(x, y) {
			setLetter(x, y, grid[x][y].div.getAttribute('data-a'));
		};

		var checkLetter = function(x, y) {
			var enteredLetter = getLetter(x, y);
		
			tmp=tmp+enteredLetter;
			// var correctLetter = grid[x][y].div.getAttribute('data-a');
			// if (enteredLetter != correctLetter)
			// 	clearLetter(x, y);
		};

		var setTargetLetter = function(letter) {
			var target = getTarget();
			setLetter(target.x, target.y, letter);

			if (active.target < (active.length - 1)) {
				if (active.down)
					target.y++;
				else
					target.x++;

				setActive(target.x, target.y, active.down);
			}

			if (changeListener)
				changeListener('text');
		};

		var clearTargetLetter = function(backpedal) {
			var target = getTarget();
			var deletion = clearLetter(target.x, target.y);

			if (backpedal && active.target > 0) {
				if (active.down)
					target.y--;
				else
					target.x--;

				setActive(target.x, target.y, active.down);
			}

			if (changeListener && deletion)
				changeListener('text');
		};

		var saveLetters = function() {
			if (window.localStorage && storageName) {
				var letters = '';
				var nonEmpty = false;

				iterateLights(function(x, y) {
					var text = getLetter(x, y);
					if (text.length) {
						letters += text;
						nonEmpty = true;
					} else {
						letters += '.';
					}
				});

				if (nonEmpty)
					localStorage.setItem(storageName, letters);
				else
					localStorage.removeItem(storageName);
			}
		};

		this.loadLetters = function() {
			
			for(var i=0;i<15;i++)
			{
				for(var j=0;j<15;j++)
				{
					if(grid[i][j].div.getAttribute("data-a")!=undefined && (grid[i][j].div.getAttribute("data-a")!="None"))
					{
						var el = document.createElement('span');
						ClassShim.addClass(el, 'letter');
						el.innerHTML = grid[i][j].div.getAttribute("data-a");
						grid[i][j].div.appendChild(el);
					}
				}
			}
		};

		this.deleteTargetLetter = function(backpedal) {
			clearTargetLetter(backpedal);
			saveLetters();
		};

		this.updateLetters = function(prevInput, newInput) {
			var i;
			if (newInput.length > prevInput.length) {
				for (i = prevInput.length; i < newInput.length; i++)
					setTargetLetter(newInput[i]);
			} else if (prevInput.length > newInput.length) {
				for (i = newInput.length; i < prevInput.length; i++)
					clearTargetLetter(true);
			} else {
				var change;
				for (change = 0; change < newInput.length; change++) {
					if (newInput[change] !== prevInput[change])
						break;
				}

				for (i = change; i < newInput.length; i++)
					clearTargetLetter(true);

				for (i = change; i < newInput.length; i++)
					setTargetLetter(newInput[i]);
			}

			saveLetters();
		};

		/* --- Grid-fill queries --- */

		var getClueNumber = function(x, y) {
			return grid[x][y].div.getElementsByClassName('grid-number')[0].textContent;
		};

		var hasChecker = function(x, y, down) {
			return ((down && x > 0 && getLetter(x - 1, y)) ||
					(down && x < (size - 1) && getLetter(x + 1, y)) ||
					(!down && y > 0 && getLetter(x, y - 1)) ||
					(!down && y < (size - 1) && getLetter(x, y + 1)));
		};

		this.getClueData = function() {
			var clueData = {across: [], down: []};
			iterateLights(function(x, y) {
				var wordLen;

				if (headAcross(x, y)) {
					wordLen = 1;
					while ((x + wordLen < size) && grid[x + wordLen][y].light)
						wordLen++;
					clueData.across.push({x: x, y: y, clueNum: getClueNumber(x, y), wordLen: wordLen});
				}

				if (headDown(x, y)) {
					wordLen = 1;
					while ((y + wordLen < size) && grid[x][y + wordLen].light)
						wordLen++;
					clueData.down.push({x: x, y: y, clueNum: getClueNumber(x, y), wordLen: wordLen});
				}
			});

			return clueData;
		};

		this.getActiveEntry = function() {
			var entry = '';
			var letter;
			active.iterate(function(x, y) {
				letter = getLetter(x, y); 
				entry += letter ? letter : '.';
			});

			return entry;
		};

		this.getActiveCheckers = function() {
			var entry = '';
			var letter;
			active.iterate(function(x, y) {
				if (hasChecker(x, y, active.down)) {
					letter = getLetter(x, y);
					entry += letter ? letter : '.';
				} else
					entry += '.';
			});

			return entry;
		};

		this.getActiveDirection = function() {
			return active.down;
		};

		this.getActiveIndex = function() {
			var index = 0;
			var activeIndex;
			
			iterateLights(function(x, y) {
				if (x == active.x && y == active.y)
					activeIndex = index;
				if ((active.down && headDown(x, y)) || (!active.down && headAcross(x, y)))
					++index;
			});

			return activeIndex;
		};

		this.setActiveEntry = function(word) {
			var i = 0;
			active.iterate(function(x, y) {
				setLetter(x, y, word[i++]);
			});
		};

		this.resetActiveEntry = function() {
			active.iterate(function(x, y) {
				if (!hasChecker(x, y, active.down))
					clearLetter(x, y);
			});
		};

		this.getIpuzPuzzle = function() {
			var puzzle = [];
			for (var y = 0; y < size; y++) {
				puzzle.push([]);
				for (var x = 0; x < size; x++) {
					if (!grid[x][y].light)
						puzzle[y].push('#');
					else if (headAcross(x, y) || headDown(x, y))
						puzzle[y].push(+getClueNumber(x, y));
					else
						puzzle[y].push(0);
				}
			}

			return puzzle;
		};

		this.getIpuzSolution = function() {
			var solution = [];
			for (var y = 0; y < size; y++) {
				solution.push([]);
				for (var x = 0; x < size; x++) {
					if (!grid[x][y].light)
						solution[y].push('#');
					else
						solution[y].push(getLetter(x, y) || 0);
				}
			}

			return solution;
		};

		/* --- Button handlers --- */

		this.checkAnswer = function() {
			active.iterate(checkLetter);
			var activepointer=active;
			var xindex=active.x;
			var yindex=active.y;
			var le=active.length;
			var dir=active.down;
			validate(xindex,yindex,le,dir,tmp);
			doClearActive();
			
		};

		this.skipPuzzle = function()
		{
			$.confirm({
				title: 'Skip Puzzle!',
				columnClass: 'small',
				animation: 'zoom',
				theme: 'dark',
				closeAnimation: 'scale',
				content: "Once you skiped a puzzle you can't come back",
				buttons: {
					confirm: function () {
						$.ajax({
							url: '/ajax/next_puzzle/',
							data: {},
							dataType: 'json',
							success:function(status) 
							{
								if(String(status.now)=="True")
								{
									location.reload(true);
								}
							}
						});
					},
					cancel: function () {
						return
					},
				}
			});
			
		};

		

		this.clearAll = function() {
			iterateLights(clearLetter);
			doClearActive();
			saveLetters();
		};

		/* --- Initialisation --- */

		// Temporary - if there is a solution cached using an older naming scheme, update it.
		var migrateLocalStorage = function(puzzleNumber) {
			var oldStorageName = 'puzzle' + puzzleNumber;
			var storage = localStorage.getItem(oldStorageName);
			if (storage) {
				localStorage.setItem('solve-Cyborg-' + puzzleNumber, storage);
				localStorage.removeItem(oldStorageName);
			}
		};

		this.loadGrid = function(container, storage) {
			var x, y;
			for (x = 0; x < size; x++) {
				grid[x] = [];
				for (y = 0; y < size; y++) {
					grid[x][y] = new Square();
				}
			}

			var elList = container.querySelectorAll('.block, .light');
			for (y = 0; y < size; y++) {
				for (x = 0; x < size; x++) {
					var el = elList[y * size + x];
					grid[x][y].light = !ClassShim.hasClass(el, 'block');
					grid[x][y].head = el.getElementsByClassName('grid-number').length > 0;
					grid[x][y].div = el;
				}
			}

			storageName = storage;
			if (window.localStorage && storageName)
				migrateLocalStorage(container.getAttribute('data-number'));
		};
	}

	/* The Android soft keyboard is spectacularly painful to work with.
	 * - It doesn't provide keypress events.
	 * - It provides keydown events but no keycode (except for number keys, bizarrely).
	 * - In the case of backspace, there's no event at all if there's no text to delete.
	 * - There's no way to make it pop up except to focus on an HTML input field.
	 *
	 * Sadly, HTML input fields are also a pain with this soft keyboard.
	 * - Focus can only be given in response to a click, not a keypress, so we can't jump around during text entry.
	 * - The behaviour is pretty unpredictable if you update the contents programmatically while the field has focus.
	 * - The maxlength setting isn't respected in the slightest.
	 * - The blue text selector aid appears whenever and wherever it feels like, including beyond the bounds of the box.
	 * - Input events fire asynchronously with a noticeable delay, so multiple keypresses can become a single input event.
	 *
	 * All those limitations have given rise to this particularly unfortunate workaround. The page contains
	 * a single invisible input field, positioned waaay off the left of the screen so that the blue cursor
	 * doesn't show up. We fill it with some lengthy dummy text so that backspace does something discernible,
	 * and examine deltas in its contents in lieu of getting nice sensible keypresses.
	 */
	function GridInput(grid) {
		var input;
		var prevInput = '';

		var positionToTarget = function() {
			input.style.top = grid.targetPosition() + 'px';
		};

		var resetInput = function() {
			prevInput = '';
			for (var i = 0; i <= 100; i++)
				prevInput += '.';

			positionToTarget();
			input.focus();
			input.value = '';
			input.value = prevInput;
		};

		this.reset = function() {
			resetInput();
		};

		var addInputEventListener = function() {
			
			//$("#CheckAnswerBtt").click();
			input.addEventListener('input', function(e) {
				if (grid.isActive()) {
					var newInput = input.value.replace(/ /g, '');
					grid.updateLetters(prevInput, newInput);
					prevInput = newInput;
					positionToTarget();
					e.preventDefault();
					return false;
				}
			});
		};

		// var addKeydownEventListener = function(antiqueIE) {
		// 	/* If there's a real keyboard, we can handle a few extra key events */
		// 	input.addEventListener('keydown', function(e) {
		// 		if (grid.isActive()) {
		// 			switch (e.which) {
		// 			case 8: /* Backspace */
		// 				/* IE8 and 9 don't fire an input event on backspace. Catch the keypress instead. */
		// 				if (antiqueIE) {
		// 					grid.deleteTargetLetter(true);
		// 					resetInput();
		// 					e.preventDefault();
		// 					return false;
		// 				}
		// 				return true;
					
		// 			}
		// 		}
		// 	});
		// };

		this.registerControl = function(inputControl, antiqueIE) {
			
			input = inputControl;
			addInputEventListener();
			//addKeydownEventListener(antiqueIE);
		};
	}

	/* The page initially contains a link to the solution in case Javascript is disabled.
	 * Since it's enabled, we can remove the link and provide some buttons instead. */
	var makeButtonBox = function(grid, div, editUrl, editCookie) {
		div.innerHTML = '';

		var checkButton = document.createElement('button');
		checkButton.innerHTML = 'Check';
		checkButton.setAttribute("id", "CheckAnswerBtt");
		checkButton.addEventListener('click', function() {
			grid.checkAnswer();
		});
		
		var skipButton = document.createElement('button');
		if(islast)
		{
			skipButton.innerHTML = 'Coming Soon';
		skipButton.setAttribute("id", "SkipPuzzle");
		}
		else{
			skipButton.innerHTML = 'Skip';
		skipButton.setAttribute("id", "SkipPuzzle");
		skipButton.addEventListener('click', function() {
			grid.skipPuzzle();
		});
		}
		
		skipButton.style.float='right';
		// var peekButton = document.createElement('button');
		// peekButton.innerHTML = 'Peek';
		// peekButton.addEventListener('click', function() {
		// 	grid.showAnswer();
		// });

		// var printButton = document.createElement('button');
		// printButton.innerHTML = 'Print';
		// printButton.addEventListener('click', function() {
		// 	window.print();
		// });

		// var checkAllButton = document.createElement('button');
		// checkAllButton.innerHTML = 'Check All';
		// checkAllButton.setAttribute("id", "CheckAllBtt");
		// checkAllButton.addEventListener('click', function() {
		// 	grid.checkAll();
		// });

		// var solutionButton = document.createElement('button');
		// solutionButton.innerHTML = 'Solution';
		// solutionButton.addEventListener('click', function() {
		// 	grid.showSolution();
		// 	div.removeChild(solutionButton);
		// 	div.appendChild(clearButton);
		// });

		// var clearButton = document.createElement('button');
		// clearButton.innerHTML = 'Clear All';
		// clearButton.setAttribute("id", "ClearAllBtt");
		// clearButton.addEventListener('click', function() {
		// 	grid.clearAll();
		// 	//div.removeChild(clearButton);
		// 	//div.appendChild(solutionButton);
		// });

		// if (editUrl) {
		// 	var editButton = document.createElement('button');
		// 	editButton.innerHTML = 'Edit Puzzle';
		// 	editButton.addEventListener('click', function() {
		// 		if (window.localStorage)
		// 			localStorage.removeItem(editCookie);
		// 		window.location.href = editUrl;
		// 	});

		// 	div.appendChild(editButton);
		// }

		div.appendChild(checkButton);
		div.appendChild(skipButton);
		//div.appendChild(peekButton);
		//div.appendChild(printButton);
		//div.appendChild(checkAllButton);
	};

	return {
		Grid: Grid,
		GridInput: GridInput,
		makeButtonBox: makeButtonBox,
	};
})();


var NUMBERS= ['ONE', 'TWO', 'THREE'];
var COLORS = ['RED', 'PURPLE', 'GREEN'];
var SHAPES = ['SQUIGGLE', 'DIAMOND', 'ECLAIR'];
var SHADES = ['SOLID', 'STRIPED', 'EMPTY'];
var MAX_SELECTED_CARDS = 3;
var NUM_CARDS = NUMBERS.length * COLORS.length * SHAPES.length * SHADES.length;

var $ = jQuery;

var remainingCards = generateDeckOfCards();
var selectedCards = [];

function generateDeckOfCards() {
	var cards = [];
	var i;

	for (i=0; i < NUM_CARDS; i++) {
		cards.push(i);
	}

	return cards;
}

function randomCard() {
	var index, obj;

	if (remainingCards.length === 0) {
		throw "There are no cards left to draw.";
	}


	// Number = index mod 3

	// Shade
	//  0-26 -> 0 solid
	// 27-53 -> 1 striped
	// 54-80 -> 2 empty

	// Shape (of index mod 27)
	//  0- 8 -> 0
	//  9-17 -> 1
	// 18-26 -> 2

	// Color (of index mod 9)
	// 0-2 -> 0
	// 3-5 -> 1
	// 6-8 -> 2

	index = remainingCards[randomNumberInRange(remainingCards.length)];
	obj = {
		shade: Math.floor(index / 27),
		shape:  Math.floor( (index%27) / 9),
		color:  Math.floor( (index%9)  / 3),
		number:  index % 3, 
		img: 'images/'+(index+1)+'.gif'
	};

	// Keep track of the cards that have been drawn
	// in the used cards stash.
	removeFromArray(remainingCards, index);

	return obj;
}

function makeRandomCard($td) {
	var obj = randomCard();

	var str = NUMBERS[obj.number] + " " + SHADES[obj.shade] + " " + COLORS[obj.color] + " " + SHAPES[obj.shape];
	if (obj.number > 0)
		str += "S";

	$td.data(obj);
	//$td.text(str);
	$td.css('background-image', "url('" + obj.img + "')");
}

function prepareCard($td) {
	$td.click(function() {
		var $this = $(this);
		
		if ($this.hasClass('selected')) {
			unselectCell($this);
		} else {
			if (selectedCards.length < MAX_SELECTED_CARDS) {
				selectCell($this);

				if (selectedCards.length === 3) {
					checkForSet();
				}
			}
		}

	});
}

function selectCell($td) {
	selectedCards.push($td);
	$td.addClass('selected');
}

function unselectCell($td) {
	$td.removeClass('selected');

	// Remove the cell from selectedCards
	removeJQueryElementFromArray(selectedCards, $td);
}

function checkForSet() {
	var objs = selectedCards.map( function($td) { return $td.data(); } );
	if (isASet(objs)) {
		log('Set found!');
		$.each(selectedCards, function ($td, index) {
			makeRandomCard($td);
		});
	} else {
		log('Not a set!');
		setTimeout(removeSelections, 400);
	}
}

function removeSelections() {
	while (selectedCards.length > 0) {
		unselectCell(selectedCards[0]);
	}
}

/**
 * Takes an array of indices, returns whether the array is a Set.
 */
function isASet(array) {
	// A Set must have 3 cards.
	if (array.length !== 3) {
		return false;
	}

	var numbers = 0, colors = 0, shapes = 0, shades = 0;
	var attributes, numBits, attr;

	for (var i in array) {
		console.log(array[i]);
		numbers += array[i].number;
		colors += array[i].color;
		shapes += array[i].shape;
		shades += array[i].shade;
	}

	attributes = [numbers, colors, shapes, shades];
	console.log(attributes);

	for (var i in attributes) {
		attr = attributes[i];
		if (attr !== 0 && attr !== 3 && attr !== 6) {
			return false;
		}
	}

	return true;
}

function log(text) {
	$('#log').append(text + '\n');
}

$(function() {
	$('#game td').each(function(index, value) { 
		var $value = $(value);
		makeRandomCard ($value);
		prepareCard ($value);
	});
})

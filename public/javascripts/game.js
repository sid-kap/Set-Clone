
var NUMBERS= ['ONE', 'TWO', 'THREE'];
var COLORS = ['RED', 'GREEN', 'PURPLE'];
var SHAPES = ['DIAMOND', 'SQUIGGLE', 'ECLAIR'];
var SHADES = ['EMPTY', 'STRIPED', 'FILLED'];
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

	// Number
	//  0-26 -> 0
	// 27-53 -> 1
	// 54-80 -> 2

	// Color (of index mod 27)
	//  0- 8 -> 0
	//  9-17 -> 1
	// 18-26 -> 2

	// Shape (of index mod 9)
	// 0-2 -> 0
	// 3-5 -> 1
	// 6-8 -> 2

	// Shade = index mod 3

	index = remainingCards[randomNumberInRange(remainingCards.length)];
	obj = {
		number: Math.floor( (index/27) / 3),
		color:  Math.floor( (index%27) / 9),
		shape:  Math.floor( (index%9)  / 3),
		shade:  index % 3
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
	$td.text(str);
}

function prepareCard($td) {
	$td.click(function() {
		var $this = $(this);
		var index;
		
		if ($this.hasClass('selected')) {
			$this.removeClass('selected');

			// Remove the cell from selectedCards
			removeJQueryElementFromArray(selectedCards, $this);
		} else {
			if (selectedCards.length < MAX_SELECTED_CARDS) {
				selectedCards.push($this);
				$this.addClass('selected');
			}
		}

	})
}

/**
 *
 */
function isSet(array) {

}

$(function() {
	$('#game td').each(function(index, value) { 
		var $value = $(value);
		makeRandomCard ($value);
		prepareCard ($value);
	});
})

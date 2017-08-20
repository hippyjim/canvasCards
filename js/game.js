$(function() {

    var SUIT_HEARTS = 'Hearts';
    var SUIT_DIAMONDS = 'Diamonds';
    var SUIT_SPADES = 'Spades';
    var SUIT_CLUBS = 'Clubs';

    var CARD_ACE = 1;
    var CARD_TWO = 2;
    var CARD_THREE = 3;
    var CARD_FOUR = 4;
    var CARD_FIVE = 5;
    var CARD_SIX = 6;
    var CARD_SEVEN = 7;
    var CARD_EIGHT = 8;
    var CARD_NINE = 9;
    var CARD_TEN = 10;
    var CARD_JACK = 11;
    var CARD_QUEEN = 12;
    var CARD_KING = 13;

    // Suit is "true" if red, "false" if black
    var suits = {};
    suits[SUIT_HEARTS] = true;
    suits[SUIT_CLUBS] = false;
    suits[SUIT_DIAMONDS] = true;
    suits[SUIT_SPADES] = false;


    var numberNames = {};
    numberNames[CARD_ACE] = 'Ace';
    numberNames[CARD_TWO] = 'Two';
    numberNames[CARD_THREE] = 'Three';
    numberNames[CARD_FOUR] = 'Four';
    numberNames[CARD_FIVE] = 'Five';
    numberNames[CARD_SIX] = 'Six';
    numberNames[CARD_SEVEN] = 'Seven';
    numberNames[CARD_EIGHT] = 'Eight';
    numberNames[CARD_NINE] = 'Nine';
    numberNames[CARD_TEN] = 'Ten';
    numberNames[CARD_JACK] = 'Jack';
    numberNames[CARD_QUEEN] = 'Queen';
    numberNames[CARD_KING] = 'King';

    var deckSprites = {};

    deckSprites[SUIT_HEARTS] = {
        1:{pixelsLeft: 140, pixelsTop: 1330},
        2:{pixelsLeft: 700, pixelsTop: 380},
        3:{pixelsLeft: 280, pixelsTop: 950},
        4:{pixelsLeft: 280, pixelsTop: 760},
        5:{pixelsLeft: 280, pixelsTop: 570},
        6:{pixelsLeft: 280, pixelsTop: 380},
        7:{pixelsLeft: 280, pixelsTop: 190},
        8:{pixelsLeft: 280, pixelsTop: 0},
        9:{pixelsLeft: 140, pixelsTop: 1710},
        10:{pixelsLeft: 140, pixelsTop: 1520},
        11:{pixelsLeft: 140, pixelsTop: 1140},
        12:{pixelsLeft: 140, pixelsTop: 760},
        13:{pixelsLeft: 140, pixelsTop: 950}
    };

    deckSprites[SUIT_CLUBS] = {
        1:{pixelsLeft: 560, pixelsTop: 570},
        2:{pixelsLeft: 280, pixelsTop: 1140},
        3:{pixelsLeft: 700, pixelsTop: 190},
        4:{pixelsLeft: 700, pixelsTop: 0},
        5:{pixelsLeft: 560, pixelsTop: 1710},
        6:{pixelsLeft: 560, pixelsTop: 1520},
        7:{pixelsLeft: 560, pixelsTop: 1330},
        8:{pixelsLeft: 560, pixelsTop: 1140},
        9:{pixelsLeft: 560, pixelsTop: 950},
        10:{pixelsLeft: 560, pixelsTop: 760},
        11:{pixelsLeft: 560, pixelsTop: 380},
        12:{pixelsLeft: 560, pixelsTop: 0},
        13:{pixelsLeft: 560, pixelsTop: 190}
    };

    deckSprites[SUIT_DIAMONDS] = {
        1:{pixelsLeft: 420, pixelsTop: 0},
        2:{pixelsLeft: 420, pixelsTop: 1710},
        3:{pixelsLeft: 420, pixelsTop: 1520},
        4:{pixelsLeft: 420, pixelsTop: 1330},
        5:{pixelsLeft: 420, pixelsTop: 1140},
        6:{pixelsLeft: 420, pixelsTop: 950},
        7:{pixelsLeft: 420, pixelsTop: 760},
        8:{pixelsLeft: 420, pixelsTop: 570},
        9:{pixelsLeft: 420, pixelsTop: 380},
        10:{pixelsLeft: 420, pixelsTop: 190},
        11:{pixelsLeft: 280, pixelsTop: 1710},
        12:{pixelsLeft: 280, pixelsTop: 1330},
        13:{pixelsLeft: 280, pixelsTop: 1520}
    };

    deckSprites[SUIT_SPADES] = {
        1:{pixelsLeft: 0, pixelsTop: 570},
        2:{pixelsLeft: 140, pixelsTop: 380},
        3:{pixelsLeft: 140, pixelsTop: 190},
        4:{pixelsLeft: 140, pixelsTop: 0},
        5:{pixelsLeft: 0, pixelsTop: 1710},
        6:{pixelsLeft: 0, pixelsTop: 1520},
        7:{pixelsLeft: 0, pixelsTop: 1330},
        8:{pixelsLeft: 0, pixelsTop: 1140},
        9:{pixelsLeft: 0, pixelsTop: 950},
        10:{pixelsLeft: 0, pixelsTop: 760},
        11:{pixelsLeft: 0, pixelsTop: 380},
        12:{pixelsLeft: 0, pixelsTop: 0},
        13:{pixelsLeft: 0, pixelsTop: 190}
    };

    var loadedAssets = 0;
    var assets = {};

    assets.cardSpritesImage = new Image();
    assets.cardSpritesImage.src = '/img/playingCards.png';
    assets.cardSpritesImage.onload = function(){ loadedAssets++; };

    var spriteWidth  = 140;
    var spriteHeight = 190;
    var cardWidth   = spriteWidth*0.5;
    var cardHeight   = spriteHeight*0.5;

    function getMousePositionOnCanvas(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        var position = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        return position;
    }

    function Card(number, suit, x, y, z, faceUp) {
        this.number = number;
        this.suit = suit;
        this.x = x;
        this.y = y;
        this.visible = false;
        this.faceUp = faceUp;
        this.mousePositionX = false;
        this.mousePositionY = false;
        this.cardSprite = deckSprites[this.suit][this.number];
    }

    Card.prototype = {
        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        draw: function(){
            if (this.visible && this.x <= playingTable.width) {
                //TODO: handle the card being face down by using a different image
                context.drawImage(
                    assets.cardSpritesImage,
                    this.cardSprite.pixelsLeft,
                    this.cardSprite.pixelsTop,
                    spriteWidth,
                    spriteHeight,
                    this.x,
                    this.y,
                    cardWidth,
                    cardHeight
                );
            }
            return this;
        },
        isOnTable: function(){
            if (this.x > playingTable.width || this.x < this.cardSprite.width) {
                return false;
            }
            if (this.y > playingTable.height || this.y < this.cardSprite.height) {
                return false;
            }
            return true;
        },
        mouseIsOnMe: function(event){

            var mousePosition = getMousePositionOnCanvas(playingTable, event);
            this.mousePositionX = (mousePosition.x - this.x);
            this.mousePositionY = (mousePosition.y - this.y);
            if (this.mousePositionX >= 0 && this.mousePositionX <= cardWidth && this.mousePositionY >= 0 && this.mousePositionY <= cardHeight) {
                return true;
            }

            this.mousePositionX = false;
            this.mousePositionY = false;
            return false;
        },
        canStackOnCardInTableau: function(card) {
            if(suits[this.suit] != suits[card.suit]) {
                return (card.number == (this.number +1));
            }
            return false;
        },
        canStackOnCardInFoundation: function(card) {
            if(this.suit == card.suit) {
                return (card.number == (this.number -1));
            }
            return false;
        }
    };

    function render() {
        context.fillStyle = "#1c9930";
        context.beginPath();
        context.rect(0,0,tableWidth,tableHeight);
        context.closePath();
        context.fill();

        for(var cardIndex in cardsOnTable) {
            if (cardsOnTable[cardIndex] instanceof Card) {
                cardsOnTable[cardIndex].draw();
            }
        }
    }

    function fan(cards, startX, startY, offsetX, offsetY) {

        var currentX = startX;
        var currentY = startY;

        Object.keys(cards).forEach(function(card) {
            cards[card].setPosition(currentX, currentY);
            currentX+=offsetX;
            currentY+=offsetY;
        });
    }

    function show(cards) {
        Object.keys(cards).forEach(function(card) {
            cards[card].visible = true;
        });
    }

    function hide(cards) {
        Object.keys(cards).forEach(function(card) {
            cards[card].visible = false;
        });
    }

    function whichCardIsClicked(event) {

        var cardThatIsClicked = false;

        var cardsBackwards = cardsOnTable.slice(0).reverse();

        for(var cardIndex in cardsBackwards) {
            if (cardsBackwards[cardIndex].mouseIsOnMe(event)) {
                cardThatIsClicked = cardsBackwards[cardIndex];
                break;
            }
        }

        return cardThatIsClicked;
    }

    function numberOfVisibleCards() {
        var numberOfCards = 0;

        for(var cardIndex in cardsOnTable) {
            if (cardsOnTable[cardIndex].isOnTable()) {
                numberOfCards++;
            }
        }

        return numberOfCards;
    }

    function findCardInStack(card, stack) {
        var foundCardIndex = false;
        for (var cardIndex in stack) {
            if (card.suit == stack[cardIndex].suit && card.number == stack[cardIndex].number) {
                foundCardIndex = cardIndex;
                break;
            }
        }
        return foundCardIndex;
    }

    var deck = {};
    var cardsOnTable = [];

    for (var suit in suits) {
        deck[suit] = {};
        for (var number in numberNames) {
            //TODO: Once we can handle face down cards, they should probably be face down first

            //Let's only make cards we've defined sprite data for
            if (deckSprites[suit] != undefined && deckSprites[suit][number] != undefined) {
                deck[suit][number] = new Card(number, suit, 20, 20, true);
                cardsOnTable.push(deck[suit][number]);
            }
        }
    }


    var playingTable = document.getElementById('playingTable');
    var tableWidth = playingTable.width;
    var tableHeight = playingTable.height;
    var context = playingTable.getContext('2d');
    var animationStarted = false;
    var cardBeingDragged = false;

    function init() {
        if (Object.keys(assets).length != loadedAssets) {
            setTimeout(init, 10);
        }

        fan(deck[SUIT_HEARTS], 20, 20, 15, 0);
        fan(deck[SUIT_CLUBS], 20, cardHeight+40, 15, 0);
        fan(deck[SUIT_DIAMONDS], 20, (cardHeight*2)+60, 15, 0);
        fan(deck[SUIT_SPADES], 20, (cardHeight*3)+80, 15, 0);
        show(cardsOnTable);

        render();

        //TODO: Look at how to check if card is on top - we need a z-axis or some other way of knowing which is on top of a stack
        // We also need to look at draw order so lower cards are drawn/rendered first

        playingTable.ondblclick = function (event) {
            if (!animationStarted) {
                var cardThatIsClicked = whichCardIsClicked(event);
                if (cardThatIsClicked) {
                    animationStarted = true; //Only animate one at a time
                    var animateCardsIntervalHandle = setInterval(function () {
                        cardThatIsClicked.x += 8;
                        render();
                        if (!cardThatIsClicked.isOnTable()) {
                            animationStarted = false;
                            clearInterval(animateCardsIntervalHandle);

                            if (numberOfVisibleCards() == 0) {
                                animationStarted = true;
                                context.fillStyle = "rgb(250, 250, 250)";
                                context.font = "24px Arial";
                                context.textAlign = "center";
                                context.textBaseline = "top";
                                context.fillText("Resetting...", tableWidth / 2, (tableHeight / 2) - 12);
                                //TODO: Look at resetting
                                setTimeout(init, 3000);
                            }
                        }
                    }, 2);
                }
            }
        };

        playingTable.onmousedown = function(event) {
            if (!animationStarted) {
                cardBeingDragged = whichCardIsClicked(event);
                var cardIndex = findCardInStack(cardBeingDragged, cardsOnTable);
                cardsOnTable.move(cardIndex, cardsOnTable.length-1);
            }
        };

        playingTable.onmousemove = function(event) {
            if (!animationStarted) {
                if (cardBeingDragged) {
                    var mousePosition = getMousePositionOnCanvas(playingTable, event);
                    cardBeingDragged.setPosition(mousePosition.x-cardBeingDragged.mousePositionX, mousePosition.y-cardBeingDragged.mousePositionY);
                    render(); //This might make it jerky
                }
            }
        };

        playingTable.onmouseup = function(event) {
            cardBeingDragged = false;
        };
    }

    init();
});

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
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
    suits[SUIT_DIAMONDS] = true;
    suits[SUIT_SPADES] = false;
    suits[SUIT_CLUBS] = false;

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

    var cardSpritesLoaded = false;
    var cardSpritesImage = new Image();
    cardSpritesImage.src = '/img/playingCards.png';
    cardSpritesImage.onload = function(){ cardSpritesLoaded = true; };

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

    function Card(number, suit, x, y, faceUp) {
        this.number = number;
        this.suit = suit;
        this.x = x;
        this.y = y;
        this.faceUp = faceUp;
        this.cardSprite = deckSprites[this.suit][this.number];
    }

    Card.prototype = {
        setPosition: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        draw: function(){
            if (this.x <= playingTable.width) {
                //TODO: handle the card being face down by using a different image
                context.drawImage(
                    cardSpritesImage,
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
            if (mousePosition.x >= this.x && mousePosition.x <= (this.x+cardWidth) && mousePosition.y >= this.y && mousePosition.y <= (this.y+cardHeight)) {
                return true;
            }
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

        Object.keys(deck).forEach(function(suit) {
            Object.keys(deck[suit]).forEach(function(cardNum){
                if (deck[suit].hasOwnProperty(cardNum)){
                    deck[suit][cardNum].draw();
                }
            });
        });
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

    var deck = {};

    for (var suit in suits) {
        deck[suit] = {};
        for (var number in numberNames) {
            //TODO: Once we can handle face down cards, they should probably be face down first

            //For now, let's only make cards we've defined sprite data for
            if (deckSprites[suit] != undefined && deckSprites[suit][number] != undefined) {
                deck[suit][number] = new Card(number, suit, 20, 20, true);
            }
        }
    }


    var playingTable = document.getElementById('playingTable');
    var tableWidth = playingTable.width;
    var tableHeight = playingTable.height;
    var context = playingTable.getContext('2d');

    fan(deck[SUIT_HEARTS], 20, 20, 15, 15);
    render();
    var cardToAnimate = CARD_KING;

    var animationStarted = false;
    playingTable.onclick = function(event) {
        if (!animationStarted) {
            if (deck[SUIT_HEARTS][cardToAnimate].mouseIsOnMe(event)) {
                animationStarted = true;
                var animateCardsIntervalHandle = setInterval(function(){
                    deck[SUIT_HEARTS][cardToAnimate].x+=5;
                    render();
                    if(!deck[SUIT_HEARTS][cardToAnimate].isOnTable()) {
                        clearInterval(animateCardsIntervalHandle);
                        animationStarted = false;
                        cardToAnimate--;
                        if (cardToAnimate < 1) {
                            context.fillStyle = "rgb(250, 250, 250)";
                            context.font = "24px Arial";
                            context.textAlign = "center";
                            context.textBaseline = "top";
                            context.fillText("Done", tableWidth/2, (tableHeight/2)-12);
                        }
                    }
                }, 2);
            }
        }
    };
});
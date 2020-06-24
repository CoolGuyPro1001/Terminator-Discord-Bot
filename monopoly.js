const fileSystem = require("fs");
var monopolyInfo;

fileSystem.readFile("monopoly.json",
    function(err, data)
    {
        monopolyInfo = JSON.parse(data);
    }
);



class Monopoly
{
    host;
    players;
    auctionPlayers;
    gameStarted;
    turn;
    propertyData;
    chanceStack;
    chestStack;
    highestBid;
    highestBidder;
    dice1;
    dice2;
    currentPlayer;
    currentPlace;
    rolledDoubles;
    inAuction;
    currentBidder;
    auctionTurn;
    onProperty;

    constructor(host)
    {
        this.host = host;
        this.players = new Array(0);
        this.gameStarted = false;
        this.turn = 0;
        this.propertyData = new Array(0);
        this.chanceStack = monopolyInfo.chance;
        this.chestStack = monopolyInfo.chest;
        this.highestBid = 0;
        this.highestBidder = null;
        this.dice1 = 0;
        this.dice2 = 0;
        this.currentPlayer = null;
        this.currentPlace = null;
        this.rolledDoubles = false;
        this.inAuction = false;
        this.currentBidder = null;
        this.turnAuction = 0;
        this.auctionPlayers = null;
        this.onProperty = false;
    }

    AddPlayer(newPlayer, money)
    {

        for(var i = 0; i < this.players.length; i++)
        {
            if(this.players[i].name == newPlayer)
                return "You Are Already In The Game";
        }

        this.players.push(
        {
            name: newPlayer,
            money: money,
            position: 0,
            properties: new Array(0),
            inJail: false
        });

        return newPlayer + "Has Joined The Game";
    }

    RemovePlayer(player)
    {
        for(var i = 0; i < this.players.length; i++)
        {
            if(this.players[i].name == player)
            {
                this.players.splice(i);
                return player + " Has Left The Game";
            }
        }

        return "You Have Already Left";
    }

    Roll()
    {
        var roll = Math.floor(Math.random() * 6) + 1;
        return roll;
    }

    ChangedProperties(position)
    {
        for(var i = 0; i < this.propertyData.length; i++)
        {
            if(this.propertyData[i].position = position)
            {
                return this.propertyData[i];
            }
        }

        return null;
    }

    Shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    DoCard(deck)
    {
        let card = (deck == "chance") ? this.chanceStack[0] : this.chestStack[0];

        switch(card.type)
        {
            case "move":
                switch(card.destination)
                {
                    case "boardwalk":
                        this.currentPlayer.position = 5;
                        break;
                    case "illinois":
                        this.currentPlayer.position = 6;
                        break;
                    case "charles":
                        this.currentPlayer.position = 3;
                    case "go":
                        this.currentPlayer.position = 0;
                    case "utlity":
                        if(this.currentPlayer.position == 22)
                        {
                            this.currentPlayer.positon = 28;
                        }
                        else
                        {
                            this.currentPlayer.position = 12;
                        }
                        break;
                    case "railroad":
                        if(this.currentPlayer.position == 22)
                        {
                            this.currentPlayer.position = 25;
                        }
                        else if(this.currentPlayer.position = 36)
                        {
                            this.currentPlayer.position = 5;
                        }
                        else
                        {
                            this.currentPlayer.position = 15;
                        }
                        break;
                    case "reading":
                        this.currentPlayer.position = 5;
                        break;
                    default:
                        this.currentPlayer.position -= 3;
                        break;
                }

                this.currentPlace = monopolyInfo.places[this.currentPlayer.position];
                if(this.currentPlace.type == "property")
                {
                    this.onProperty = true;
                }

                break;
            case "reward":
                this.currentPlayer.money += card.amount;
                break;
            case "playerReward":
                this.currentPlayer.money += (this.players.length * card.amount);
                this.players.forEach(player => 
                {
                    player.money -= card.amount;
                });
                break;
            case "pay":
                this.currentPlayer.money -= card.amount;
                break;
            case "playerPay":
                this.currentPlayer.money -= (this.players.length * card.amount);
                this.players.forEach(player => 
                {
                    player.money += card.amount;
                });
                break;
            case "free":
                this.currentPlayer.getOutCards++;
                break;
            case "jail":
                this.currentPlayer.position = 10;
                this.currentPlayer.inJail = true;
                break;
            case "housePay":
                let houseCost = 0;
                let hotelCost = 0;
                this.currentPlayer.properties.forEach(property => 
                {
                    if(property.stage >= 1 <= 4)
                    {
                        this.currentPlayer.money -= card.house;
                    }
                    else if(property.stage == 5)
                    {
                        this.currentPlayer.money -= card.hotel;
                    }
                });
                break;
        }

        if(deck = "chance")
        {
            this.chanceStack.splice(0);
        }
        else
        {
            this.chestStack.splice(0);
        }

        return card.name;
    }

    NextPlayer()
    {
        this.onProperty = false;
        this.turn = (this.turn == this.players.length - 1) ? 0 : this.turn++;;
    }

    NextBidder()
    {
        this.auctionTurn = (this.auctionTurn == this.auctionPlayers.length - 1) ? 0 : this.auctionTurn++;
        return this.auctionPlayers[this.auctionTurn];
    }

    StartGame()
    {
        this.Shuffle(this.players);
        for(var i = 0; i < this.players.length; i++)
        {
            console.log(this.players[i].name);
        }
        this.Shuffle(this.chanceStack);
        this.Shuffle(this.chestStack);
    }

    GetLocation()
    {
        return "You are at position " + this.currentPlayer.position + ", which is at " + this.currentPlace.name;
    }

    Inventory()
    {
        let propertiesString = "Properties: \n";
        console.log(this.currentPlayer.properties.length);
        this.currentPlayer.properties.forEach(property => 
        {
            
            propertiesString += "\t" + property.name + ":\n";
            propertiesString += "\t\tColor: " + property.color + "\n";
            propertiesString += "\t\tRent: $" + property.rent + "\n";
            if(property.stage == 4)
            {
                propertiesString += "\t\tHouses: 0\n";
                properrtiesString += "\t\tHotels: 1\n";
            }
            else
            {
                propertiesString += "\t\tHouse: " + property.stage + "\n";
                propertiesString += "\t\tHotels: 0\n";
            }
        });

        let money = "Money: $" + this.currentPlayer.money + "\n";

        return this.currentPlayer.name + "'s Inventory:\n" + money + propertiesString;
    }

    RollDice()
    {
        //Move the player
        this.currentPlayer = this.players[this.turn];
        this.dice1 = 1//this.Roll();
        this.dice2 = 0//this.Roll();
        
        //Rolled Doubles
        if(this.dice1 == this.dice2)
        {
            this.currentPlayer.doublesCount++;
            if(this.currentPlayer.doublesCount == 3)
            {
                this.currentPlayer.position = 10;
                this.currentPlayer.inJail = true;
                this.currentPlayer.doublesCount = 0;
                return "You have rolled three doubles in a row, TO JAIL!";
            }
            else
            {
                this.rolledDoubles = true;
            }
        }

        return "First Dice: " + this.dice1 + "\nSecond Dice: " + this.dice2;
    }

    MovePlayer()
    {
        this.currentPlayer.position += (this.dice1 + this.dice2);
        var currentPosition = this.currentPlayer.position;
        this.currentPlace = monopolyInfo.places[currentPosition];
        return "Moving " + this.currentPlayer.name + " " + (this.dice1 + this.dice2) + " Spaces\n" + this.currentPlayer.name + " has landed on " + this.currentPlace.name;
    }

    OnPlayerTurn()
    {
        //Do Action Base On Place
        switch(this.currentPlace.type)
        {
            case "property":
                this.onProperty = true;
                var property = this.ChangedProperties(this.currentPosition)
                if(property == null)
                {
                    //Buy or auction property
                    return "buyProperty";
                }
                else if(!property.isMortgaged)
                {
                    let owner = this.players.indexOf(property.owner);
                    owner.money += this.currentPlace.basedRent;
                    this.currrentPlayer.money -= this.currentPlace.basedRent;
                    return "payRent";
                }
                break;
            case "chance":
                return "chance";
            case "chest":
                return "chest";
            case "tax":
                this.currentPlayer.money -= this.currentPlace.price;
                return "tax";
            case "parking":
                this.currentPlayer.money += parkingmoney;
                break;
            case "go":
                this.currentPlayer.money += 200;
                return "go";
        }      
    }

    BuyProperty()
    {
        if(this.currentPlayer.money >= this.currentPlace.price)
        {
            this.currentPlayer.money -= this.currentPlace.price;
            this.currentPlayer.properties.push(
            {
                name : this.currentPlace.name,
                rent : this.currentPlace.baseRent,
                stage : 0,
                color: this.currentPlace.color
            });
        }

        return this.currentPlayer.name + " Has Bought " + this.currentPlace.name + " For $" + this.currentPlace.price;
    }

    StartAuction()
    {
        this.inAuction = true;
        this.auctionPlayers = this.players;
        this.highestBidder = null;
        this.highestBid = 0;
        this.currentBidder = this.currentPlayer;
        this.turnAuction = this.turn;
    }

    Bid(amount)
    {
        var enoughBidMessage = "";
        if(amount > this.highestBid)
        {
            this.highestBid = amount;
            this.highestBidder = this.currentBidder;
            enoughBidMessage = this.currentBidder.name + " Has Bidded " + amount;
        }
        else
        {
            enoughBidMessage = "Sorry " + this.currentBidder.name + ", Your Offer Is Lower Than The Highest Bid";
        }

        this.currentBidder = this.NextBidder();
        return enoughBidMessage + "\nHighest Bid: " + this.highestBid + "\nHighest Bidder: " + this.highestBidder.name;
    }

    Pass()
    {
        this.auctionPlayers.splice(this.auctionTurn);

        if(this.auctionPlayers.length == 1)
        {
            this.EndAuction();
            return this.auctionPlayers[0] + " Has Won The Auction\n" + this.currentPlace.name + " Is Now Theirs";
        }

        return this.currentBidder + " Has Bailed Out";
    }

    EndAuction()
    {
        this.highestBidder.money -= this.highestBid;
        this.highsetBidder.properties += this.currentPlace;
        this.inAuction = false;
        this.currentBidder = null;
    }

    Upgrade(playerName, propertyName)
    {
        let player;
        this.players.forEach(p =>
        {
            if(p.name == playerName)
            {
                player = p;
            }
        });

        let property = player.properties.find(p => p.name == propertyName);
        let numOfColors = 0;

        
        //Count properties that have same color as requested property

        if(property == null)
        {
            return "That Property Doesn't Exist";
        }
        
        numOfColors++;

        player.properties.forEach(p =>
        {
            if(property.color == p.color && property != p)
            {
                numOfColors++;
            }
        });

        //Have enough properties of same color
        let haveEnoughColor = false;

        if(property.color == "Brown" || property.color == "Blue")
        {
            if(numOfColors == 2)
            {
                haveEnoughColor = true;
            }
        }
        else
        {
            if(numOfColors == 3)
            {
                haveEnoughColor = true;
            }
        }

        if(haveEnoughColor)
        {
            if(property.stage == 4)
            {
                return "Can't Upgrade Property Because It's Has A Hotel";
            }
            
            property.stage++;
            let propertyInfo = monopolyInfo.places.find(p => p.name == property.name);
            switch(property.stage)
            {
                case 1:
                    property.rent = propertyInfo.oneRent;
                    break;
                case 2:
                    property.rent = propertyInfo.twoRent;
                    break;
                case 3:
                    property.rent = propertyInfo.threeRent;
                    break;
                case 4:
                    property.rent = propertyInfo.hotelRent;
                    break;
            }

            return property.name + " Has Been Upgraded!";
        }

        return "You Don't Own All Properties Of The Same Color";
    }
}

module.exports = Monopoly;
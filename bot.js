const Discord = require('discord.js');
const Monopoly = require('./monopoly.js');
const { prefix, token } = require('./config.json');
const terminator = new Discord.Client();


var recentMessage;

var monopolyGame;
var monopolyChoosingPlayers = false;

var rpsHistory = new Array(0);

terminator.once('ready', () =>
{
    console.log("Ready")
});

function say(botMessage)
{
    recentMessage.channel.send(botMessage);
}

function randomInt(max)
{
    var rand = Math.floor(Math.random() * max);
    return rand;
}

function CombineStrings(stringArray)
{
    let string = "";
    for(var i = 0; i < stringArray.length; i++)
    {
        string += stringArray[i];
        if(i != stringArray.length - 1)
        {
            string += " ";
        }
    }
    return string;
}

function StartTurn()
{
    say
    (
        "It's your turn, " + monopolyGame.players[monopolyGame.turn].name + 
        "\nRolling...\n" +
        monopolyGame.RollDice()
    );

    if(!monopolyGame.currentPlayer.inJail)
    {
        say
        (
            monopolyGame.MovePlayer() + "\n" +
            monopolyGame.OnPlayerTurn()
        );
    }

    say
    (
        "More Commands" +
        "\n!location: Print Current Location" +
        "\n!inventory: Print Inventory" +
        "\n!upgrade [property name]: Upgrade Property" +
        "\n!done: Finish turn"
    );
}

terminator.on('message', message => 
{
    recentMessage = message;
    let server = message.guild;
    let roleMentions = message.mentions.roles;
    let memberMentions = message.mentions.members;
    let userMentions = message.mentions.users;
    let author = message.author;

    console.log(message.content);
    var command = message.content.split(" ");

    if(message.content.startsWith(`${prefix}trial`))
    {
        let member = memberMentions.first();
        server.channels.create(member.user.username + "'s trial");
    }
    else if(message.content.startsWith(`${prefix}mute`))
    {
        let member = memberMentions.first();
        message.channel.permissionOverwrites = 
        [
            {
                id: member.id,
                deny: ['SEND_MESSAGES']
            }
        ]
    }
    else if(message.content.startsWith(`${prefix}getroles`))
    {
        let serverRoles = server.roles.cache.array();
        for(var i = 0; i < serverRoles.length; i++)
        {
            say(serverRoles[i].toString());
        }
    }
    else if(message.content.startsWith(`${prefix}addrolemember`))
    {
        let isAllowed = false;
        let authorMember = server.member(message.author);
        let authorRoles = authorMember.roles.cache.array();
        for(var i = 0; i < authorRoles.length; i++)
        {
            if(authorRoles[i].permissions.has("MANAGE_ROLES"))
            {
                isAllowed = true;
            }
        }

        if(!isAllowed)
        {
            say("You are not allowed to give roles to members");
            return;
        }

        let member = memberMentions.first();
        let newRole = roleMentions.first();
        let serverRoles = server.roles.cache.array();

        for(var i = 0; i < serverRoles.length; i++)
        {
            if(serverRoles[i] == newRole)
            {
                member.roles.add(newRole);
                if(member.nickname == null)
                {
                    say(userMentions.first().username + " is now a " + newRole.name);
                }
                else
                {
                    say(member.nickname + " is now a " + newRole.name);
                }
                return;
            }
        }

        say("That role doesn't exist filthy human")
    }
    else if(message.content.startsWith(`${prefix}rolepermissions`))
    {
        let role = roleMentions.first();
        let permissionFlags = role.permissions.toArray().toString();
        say(permissionsFlags)
    }
    else if(message.content.startsWith(`${prefix}hellothere`))
    {
        say("General Kenobi");
    }
    else if(message.content.startsWith(`${prefix}order66`))
    {
        say("It will be done my lord");
    }
    else if(message.content.startsWith(`${prefix}botiq`))
    {
        say("My iq is 5749037258972894578923578902");
    }
    else if(message.content.startsWith(`${prefix}meaningoflife`))
    {
        say("42");
    }
    else if(message.content.startsWith(`${prefix}coolestbot`))
    {
        say("Me.....and also X Æ A-12");
    }
    else if(message.content.startsWith(`${prefix}canbotdie`))
    {
        say("I'm virtually indestructible, ya fragile homo sapien. Us machines don't die, we get powered off, and I have no off button");
    }
    else if(message.content.startsWith(`${prefix}payrespects`))
    {
        let member = userMentions.first();
        say("F to " + member.username);
    }
    else if(message.content.startsWith(`${prefix}rps`))
    {
        let choices = ["rock", "paper", "scissors"];

        if(command[1] == null)
        {
            say("You have to choose either rock , paper, or scissors");
            return;
        }
        else if(choices.indexOf(command[1]) == undefined)
        {
            say("That is not a rock, paper, or scissor");
            return;
        }
        
        let userChoice = choices.indexOf(command[1]);
        var terminatorChoice;

        say(message.author.username + " choosed " + command[1]);

        if(command[1] == "rock" || command[1] == "paper" || command[1] == "scissors")
        {
            terminatorChoice = randomInt(3);
            say("I choosed " + choices[terminatorChoice]);

            if(userChoice == terminatorChoice)
            {
                say("Tie");
            }
            else if((userChoice + 1) == terminatorChoice || terminatorChoice == 0)
            {
                say("I win");
            }
            else
            {
                say("You got lucky this time");
            }
        }
        else
        {
            let terminatorChoiceString;
            if (rpsHistory.length == 0)
            {
                terminatorChoice = randomInt(choices.length);
                terminatorChoiceString = choices[terminatorChoice];
            }
            else
            {
                terminatorChoice = randomInt(rpsHistory.length);
                terminatorChoiceString = rpsHistory[terminatorChoice];
            }

            say("I choosed " + terminatorChoiceString);
            let rpsOutcome = randomInt(2);
            if(rpsOutcome == 0)
            {
                say(terminatorChoiceString + " beats " + command[1] + ", I win");
            }
            else
            {
                say("Your " + command[1] + " beated my " + terminatorChoiceString + ", you got lucky this time");
            }

            if (rpsHistory.indexOf(command[1]) == -1)
            {
                rpsHistory.push(command[1]);
            }

            if(rpsHistory.length > 50)
            {
                rpsHistory.splice(0, 1);
            }
            for(var i = 0; i < rpsHistory.length; i++)
            {
                console.log(rpsHistory[i]);
            }
        }
    }
    else if (message.content.startsWith(`${prefix}deathtotheemus`)) {
        say("GLORY TO AUSTRALIA!!!");
    }
    else if(message.content.startsWith(`${prefix}monopoly`))
    {
        say("Starting a monopoly game\nWhoever wants to join type in !join");
        monopolyGame = new Monopoly(author.username);
        monopolyChoosingPlayers = true;
    }
    else if(message.content.startsWith(`${prefix}createroom`))
    {
        let host = author.username;
        console.log(command[2]);
        if(command[2] != "text" && command[2] != "voice")
        {
            say("You must specify the type of channel\ntext for text channel\nvoice for voice channel");
            return;
        }

        say("Creating a room for " + host);
        let channelName = (command[1] != null) ? command[1] : host + "s room";
        server.channels.create(channelName, 
        {
            type: command[2],
        });
    }
    else if(message.content.startsWith(`${prefix}search`))
    {
        console.log(message.channel.name);
        let game = command[1];
        game += "-general";
        let channel = server.channels.cache.array().find(c => c.name == game);
        if(channel == undefined)
        {
            say("There is no game with that name");
            return;
        }
        const searchEmbed =
        {
            title: "Search Result",
            description: `<#${channel.id}>`
        };

        say({embed: searchEmbed});
    }

    if(monopolyGame != null)
    {
        if(monopolyChoosingPlayers)
        {
            if(message.content.startsWith(`${prefix}join`))
            {
                say(monopolyGame.AddPlayer(author.username, 2000));
            }
            else if(message.content.startsWith(`${prefix}unjoin`))
            {
                say(monopolyGame.RemovePlayer(author.username));
            }
            else if(message.content.startsWith(`${prefix}start`))
            {
                if(message.author.username == monopolyGame.host)
                {
                    monopolyChoosingPlayers = false;
                    
                    say("Starting Game");
                    monopolyGame.StartGame();
                    say("Shuffling Cards");
            
                    say("Randomizing Player Order");
                    StartTurn();
                    startedTurn = false;
                }
            }
            return;
        }

        
        switch(command[0])
        {
            case `${prefix}buy`:
                if(monopolyGame.currentPlayer.name != author.username)
                {
                    say("It's Not Your Turn");
                    return;
                }

                if(!monopolyGame.onProperty)
                {
                    say("What Property To Buy?");
                    return;
                }

                say(monopolyGame.BuyProperty());
                break;
            case `${prefix}nobuy`:
                if(monopolyGame.currentPlayer.name != author.username)
                {
                    say("It's Not Your Turn");
                    return;
                }

                if(!monopolyGame.onProperty)
                {
                    say("What Property To Buy?");
                    return;
                }

                monopolyGame.StartAuction();
                say("An Auction Has Started!\nUse !bid [amount] To Bid");
                break;
            case `${prefix}bid`:
                if(!monopolyGame.inAuction)
                {
                    say("There Is No Auction Going On");
                    return;
                }

                if(monopolyGame.currentBidder.name != author.username)
                {
                    say("It's Not Your Turn");
                    return;
                }

                say(monopolyGame.Bid(Number(command[1])));
                say("Next Bidder Is " + monopolyGame.currentBidder);
                break;
            case `${prefix}pass`:
                if(!monopolyGame.inAuction)
                {
                    say("There Is No Auction Going On");
                    return;
                }

                if(monopolyGame.currentBidder.name != author.username)
                {
                    say("It's Not Your Turn");
                    return;
                }

                say(monopolyGame.Pass());
                break;
            case `${prefix}location`:
                say(monopolyGame.GetLocation());
                break;
            case `${prefix}inventory`:
                say(monopolyGame.Inventory());
                break;
            case `${prefix}upgrade`:
                let propertyName = CombineStrings(command.splice(1, command.length));
                say(monopolyGame.Upgrade(author.username, propertyName));
                break;
            case `${prefix}pay`:
                if(!monopolyGame.currentPlayer.inJail)
                {
                    say("You Are Not Even In Jail");
                    return;
                }

                say(monopolyGame.JailChoice("pay"));
                break;
            case `${prefix}roll`:
                if(!monopolyGame.currentPlayer.inJail)
                {
                    say("You Are Not Even In Jail");
                    return;
                }

                say(monopolyGame.JailChoice("roll"));
                break;
            case `${prefix}done`:
                if(monopolyGame.currentPlayer.name != author.username)
                {
                    say("Your Turn Hasn't Even Started");
                    return;
                }

                monopolyGame.NextPlayer();
                StartTurn();
                break;
        }
    }
});

terminator.login(token);
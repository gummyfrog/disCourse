const Discord = require('discord.js');
const fs = require('fs');
var configRaw = fs.readFileSync("./config/code.json");
const config = JSON.parse(configRaw);
var jsonfile = require('jsonfile')


const storage = require('./storage.js');
// notifier manages all of the users that need to be notified.
// userbase manager

const client = new Discord.Client();

const prefix = "f!";

client.on('ready', () => {
  console.log('READY TO FARM');
});

client.on('message', message => {
  if(message.content.substring(0, prefix.length) != prefix) {
    return;
  }

  var command = message.content.substring(prefix.length).split(' ')[0];
  var args = message.content.substring(prefix.length + command.length + 1).toLowerCase();
  var splitArgs = args.split(' ');
  var secondCommand = splitArgs[0];
  //
  // console.log(command);
  // console.log(args);
  // console.log(splitArgs);
  // console.log(secondCommand);


  if(command === 'help') {
    const embed = {
        "color": 16304040,
        "fields": [
          {
            "name": "HOW TO FARM",
            "value": "If you're new, make a farm with f!farm.\nYou start with $300. Have fun.\n? = OPTIONAL\nf!farm // use this to start the game\nf!inventory [page?] \nf!consolidate [position] [position] // only if both positions are bags of the same item\n\nf!balance\nf!gift @user [position] [amount?]\nf!shop list [page?]\nf!shop sell [position] [amount?]\nf!shop sell all\nf!shop buy [position] [amount?]\nf!crops [page?]\nf!plant [position] [amount?]\nf!harvest [position] [amount?] \nf!experiment [item name], // as many as you want, separated by a ,  // [single digit number]\nf!finalize [position] // harvests an experiment\nf!recipes [page?]\nf!cook [position] [amount]\n\nf!toss [position] [amount?] // removes inventory items\nf!forget [position] [amount?] // removes recipes\nf!dump [position] [amount?] // removes experiments\nf!uproot [position] [amount?] // removes crops"
          }
       ]
    };
    message.author.send({ embed });
  };

  if(command === 'farm') {
    if(!storage.userExists(message.author.id)) {
      message.channel.send("Please name your farm to get started:");

      var data = {userID:message.author.id, name:'', exp: 0, level: 0, balance: 300, inventory:[], farm:{name:'',crops:[]}, restaurant:{name:'', experiments:[], recipes:[]}};

      var tree = 0;
      let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 10, time: 35000 });
      collector.on('collect', message => {
        switch(tree) {
          case 0:
            data.farm.name = message.content;
            message.channel.send("Please name your restaurant, too:");
            tree++;
            break;
          case 1:
            data.restaurant.name = message.content;
            console.log(data);
            message.channel.send(`Just one more thing, please sign your name.`);
            tree++;
            break;
          case 2:
            data.name = message.content;
            message.channel.send(`You are now the legal owner of *${farm.name}.* Have fun!`)
            storage.start(data, message.channel);
            col.stop();
            break;
          default:
            break;
        }

      })

    } else {
      message.channel.send("You already have a farm, friend.")
    }
  }


  if(storage.userExists(message.author.id)) {

    if(command === 'uproot') {
      storage.toss(message, 'crops', splitArgs[0])
    }
    if(command === 'toss') {
      storage.toss(message, 'inventory', splitArgs[0])
    }
    if(command === 'forget') {
      storage.toss(message, 'recipes', splitArgs[0])
    }
    if(command === 'dump') {
      storage.toss(message, 'experiments', splitArgs[0])
    }



    if(command === 'giveMoney') {
      storage.giveMoney(message, args)
    }

    if(command === 'inventory') {
      storage.inventoryList(message, splitArgs[0]);
    }

    if(command === 'balance') {
      storage.balance(message);
    }

    if(command === 'consolidate') {
      storage.consolidate(message, splitArgs)
    }

    if(command === 'gift') {
      storage.gift(message, splitArgs[0], splitArgs[1], splitArgs[2]);
    }

    if(command == 'sell') {
      if(secondCommand == 'all') {
        storage.shopSellAll(message);
      } else {
        storage.shopSell(message, splitArgs[0], splitArgs[1]);
      }
    }

    if(command == 'buy') {
      storage.shopBuy(message, splitArgs[0], splitArgs[1]);
    }

    if(command === 'shop') {
      if(secondCommand == 'sell') {
        if(splitArgs[1] == 'all') {
          storage.shopSellAll(message);
        } else {
          storage.shopSell(message, splitArgs[1], splitArgs[2]);
        }
      } else if(secondCommand == 'buy') {
        storage.shopBuy(message, splitArgs[1], splitArgs[2]);
      } else if(secondCommand == 'list') {
        storage.shopList(message, splitArgs[1]);
      } else {
        message.channel.send('What?')
      }
    }

    if(command === 'plant') {
      storage.plant(message, splitArgs[0], splitArgs[1]);
    }

    if(command === 'harvest') {
      if(secondCommand == 'all') {
        storage.harvestAll()
      } else {
        storage.harvest(message, splitArgs[0], splitArgs[1]);
      }
    }

    if(command === 'crops') {
      storage.cropList(message, splitArgs[0]);
    }

    if(command === 'experiment') {
      var split = args.split(', ');
      var time = args.split(' ')[args.split(' ').length-1];
      split[split.length-1] = split[split.length-1].substring(split[split.length-1].length-2, split[split.length-1]);
      
      storage.experiment(message, split, time)
    }


    if(command === 'experiments') {
      storage.experimentList(message, splitArgs[0]);
    }

    if(command === 'finalize') {
      storage.finalize(message, splitArgs[0]);
    }

    if(command === 'recipes') {
      storage.recipesList(message, splitArgs[0]);
    }


    if(command === 'cook') {
      storage.cook(message, splitArgs[0], splitArgs[1]);
    }

  }

  //   if(userManager.alreadyNotifyingChannel(args, message.channel.id) ) {
  //
  //     // user is being notified already
  //     if (args == 'all') {
  //       // stop notify user about all alerts
  //       message.channel.send("I'll stop notifying this channel about every alert.");
  //     } else {
  //       // notify user about specific alertsDelegate
  //       message.channel.send("I'll stop notifying this channel about alerts for <" + args.toUpperCase() + ">");
  //     }
  //
  //     userManager.stopNotifyingChannel(args, message.channel.id, message.guild.id);
  //
  //   } else {
  //     // user is being notified already
  //     message.channel.send("This channel isn't being notified about <" + args.toUpperCase() + ">.");
  //   }
  //
  // }
  //
  // if(command === 'active') {
  //   message.channel.send(alertsDelegate.returnActiveAlerts());
  // }
  //
  //
  // if(command === 'stats') {
  //   scrapeManager.returnScrape(properArgs, message)
  // }
  //
  //
  // if(command == 'alertingme') {
  //   userManager.notifyingUserAbout(message.author.id, message);
  // }
  //
  // if(command == 'alertingchannel') {
  //   if(message.guild == null) {
  //     message.channel.send('Sorry, you need to use this command in a server!');
  //     return;
  //   }
  //
  //   userManager.notifyingChannelAbout(message.channel.id, message.guild.id, message);
  // }
  //
  //
  //

});

client.login(config.token);

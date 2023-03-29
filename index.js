const { Client, GatewayIntentBits } = require('discord.js');


const {joinVoiceChannel, createAudioResource, createAudioPlayer,  NoSubscriberBehavior, AudioPlayerStatus} = require("@discordjs/voice")


let connection = null;
let player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});;
let resource = null;

let isLooping = false;

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    ] });


const getApiData = require("./apidata.js")

const {downloadAudio} = require("./downloadAudio.js")

const {downloadVoice} = require("./textToSpeech.js")


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const rpsOptions = ['rock', 'paper', 'scissors'];



function sumAscii(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}


player.on(AudioPlayerStatus.Idle, () => {
    if(!isLooping) return
    player.play(createAudioResource('./audio.mp3'))
});



async function handleMessage(msg){


  try {
    if(msg.author.bot) return
  
    // EASTER EGGS
  
    msg.content === "beli ist bald" && msg.reply("yessir"); 
    
    msg.author.username === "vasoux" && msg.reply(`:rotating_light: ADC DOGGO DETECTED!!!! :rotating_light: ${msg.author}`)
    
    msg.author.username === "Cuz_Im_Broken" && msg.reply(`:face_with_symbols_over_mouth:  JORAAAAMM DUUU KOSTEST!!!!! :face_with_symbols_over_mouth: ${msg.author}`)
  

    msg.content.toLowerCase().includes("warum") && msg.reply(`Darum! :angry: ${msg.author}`)
  
    // ROCK PAPER SCISSORS
  
    const msgArr = msg.content.split(' ');
    const [command, ...choice] = msgArr

    console.log(command,choice)
  
    if (command === 'rps' && rpsOptions.includes(choice.toString())) {
      const rpsChoice = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
  
      msg.channel.send(`I choose ${rpsChoice}!`);
  
      if (choice.toString() === rpsChoice) {
        msg.channel.send(`${msg.author} , it\'s a tie!`);
      } else if (choice.toString() == 'rock' && rpsChoice == 'scissors' ||
          choice == 'paper' && rpsChoice ==  'rock' ||
          choice == 'scissors' && rpsChoice == 'paper') {
        msg.channel.send(`${msg.author}, you win!`);
      } else {
        msg.channel.send(`${msg.author}, I win!`);
      }
    }

    if (command === "play") {
      // Check if the user is in a voice channel
      try {
        if (!msg.member.voice.channel) {
          msg.reply("You're not in a voice channel.");
          return;
        }
  
        if(isLooping){
          isLooping = false;
        }
  
          connection = joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
          guildId: msg.guild.id,
          adapterCreator: msg.guild.voiceAdapterCreator,
          selfDeaf: false
        })
        

        if(choice[0] === "music") {
          await downloadAudio(choice.toString().replaceAll(",","").replace("music",""))
          resource = createAudioResource('./audio.mp3')
        };

        if (choice[0] === "voice") {
          await downloadVoice(choice.toString().replaceAll(",","").replace("voice",""))
          resource = createAudioResource('./voice.mp3')
        };
        player.play(resource);
        
  
        connection.subscribe(player);
  
        
        msg.reply(`I've joined ${msg.member.voice.channel.name}!`);
      } catch (error) {
        msg.reply(`Ich konnte dem Channel nicht beitreten, Info für Köfte ${error}`)
        console.error(error)
      }
    }

    if(command === "stop"){
      connection ? connection.destroy() : msg.reply("Ich spiele garnichts du doggo! :angry_face:")
    }
    
    if(command === "pause"){
      connection ? player.pause() : msg.reply("Was genau soll ich pausieren du dogge! :angry_face:")
    }

    if(command === "resume"){
      connection ? player.unpause() : msg.reply("Was genau soll ich pausieren du dogge! :angry_face:")
    }

    if(command === "loop") {

      if (!connection) msg.reply("LULE was willst du loopen ???") 

      isLooping = true;
      msg.reply("Der Song wird nun in Schleife gespielt")
     
    }
    
    if(command === "unloop"){

      if (!connection) msg.reply("LULE was willst du unloopen ???")
      
      isLooping = false;
      msg.reply("Der Song wird nicht mehr in Schleife gespielt")
      
    }
  
    if(command === "doggoselbsttest"){
      let prob = msg.author.username
      prob = (Math.sqrt(sumAscii(prob)) % 1) * 100
      prob = prob.toFixed(2)
      msg.reply(`${msg.author} ist zu ${prob}% ein doggo :dog:`)
    }
  
    if(command === "doggotest"){
      let prob =  choice.toString().replaceAll(","," ") 
      prob = (Math.sqrt(sumAscii(prob)) % 1) * 100
      prob = prob.toFixed(2)
      msg.reply(`${choice} ist zu ${prob}% ein doggo :dog:`)

    }
  
    if(command === "wr"){
      try{let data = await getApiData.getSummonerData("EUW1",choice.toString().replaceAll(","," "),'RGAPI-e36f2124-4e92-4341-9d00-1a67903ccbe6');
      data && msg.reply(`${choice.toString().replaceAll(","," ")} hat eine Winrate von: ${data.winrate}`);}
      catch(error){msg.reply("Den Namen gibt es nicht");console.error(error)}
  
    }
  
    if(command === "mc"){
      try {let data = await getApiData.getMostPlayedChampion("EUW1",choice.toString().replaceAll(","," "),'RGAPI-e36f2124-4e92-4341-9d00-1a67903ccbe6'); data && msg.reply(data)}
      catch(error){msg.reply("Den Namen gibt es nicht");console.error(error)}  
     
    }

    if(command === "say"){
      downloadVoice(choice.toString())
      resource = createAudioResource('./voice.mp3');
      player.play(resource)
    }

  } catch (error) {
    msg.author.bot || msg.reply("Es gab einen Fehler , Kontaktiere Köfte oder auch nicht")
    console.error(error)
  }
}


client.on("messageCreate", async message => {await handleMessage(message)});

client.login("MTA3NzY3NjM1NTUwNTg5NzQ3Mg.GE5_VG.WweTfbjHVOk2dcYKepGscB-jzYm26wzrL3wYlM");


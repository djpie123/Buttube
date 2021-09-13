# Buttube

A music package with buttons
<div align="center">
  <p>
    <a href="https://nodei.co/npm/buttube
/"><img src="https://nodei.co/npm/buttube.png?downloads=true&stars=true" alt="NPM Info" /></a>
  </p>
</div>

<div align="center">
 <p>
 For errors and questions you can join <a href="https://discord.gg/Hfem6FbVgQ">My server</a></p>
</div>

# Installation
# Table of content:
## - [installation](https://www.npmjs.com/package/buttube#installation-)
## - [Get started](https://www.npmjs.com/package/buttube#get-started)
## - [How to use](https://www.npmjs.com/package/buttube#how-to-use)
npm:
```powershell
npm i buttube
 ```

yarn:
```powershell
yarn add buttube
 ```

## get started
Here is how to get started
# First you need to decide whether you will use a local file database or quick-mongo
Below is the line for Quic mongo
```js
const Discord = require('discord.js');
Client = Discord.Client;
Intents = Discord.Intents;
//GUILD_VOICE_STATES intent is required
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const {buttube} = require('buttube')
client.buttube = new buttube(client, "mongodb url", embed, api)
```
> ### params
client - Discord.client </br>
mongodb url - mongodb connection url </br>
embed - The setup embed  </br>
api - the youtube api key used for add song to playlist function(now is shifted to this place)
## OR
Below is for Local file database
```js
const Discord = require('discord.js');
Client = Discord.Client;
Intents = Discord.Intents;
//GUILD_VOICE_STATES intent is required
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const {quickbuttube} = require('buttube')
client.buttube = new quickbuttube(client, embed, api)
```
> ### params
client - Discord.client </br>
embed - The setup embed  </br>
api - the youtube api key used for add song to playlist function(now is shifted to this place)
> ### another step 
```js
//add this event
client.on('interactionCreate', async(interaction) => {
    if (!interaction.isButton()) return;
    client.buttube.interaction(interaction)
})
```
> ### another step
Here you can set the embed details.
eg:-
```js
//I have not added image as the image has to be the song thumnail
//you can only set title, footer and dexcription for now.
const playembed = {
    title: 'Now playing: -song.name-',
    footer: "Song's duration: -song.duration-",
    description: 'Some description' 
}
//-song.name- : this is the name of the song
//-song.url- : this is the song url
//-song.duration- : this is the song duration
//-song.user- : the user who requested the song
```
add the following line in Your code anywhere:-
```js
client.buttube.events(playembed)
```
# how to use
here is how to create commands
>### play command
```js
if(command === "play" || command === "p"){
         
        client.buttube.play(message, args.join(" "));
        //For playing your playlist the args.join(" ") should be equal to "my list". Eg: ?p my list.
    }
```
>### to make setup command
```js
if(command === "setup" || command === "leave"){
     client.buttube.setup(message);
    }
```
>### Creating Playlist Command
```js
if(command === "addlist" || command === "a"){
         
        client.buttube.addSongToPlaylist(message, args.join(" "));
    }
```
>### Deleting a playlist
```js
if(command === "clearList" || command === "c"){
         
        client.buttube.clearList(message);
    }
```
### Slash Commands
added slash commands
```js
//set listEnabled to true if you have provided an api key else set it to false
//if listEnabled is true then please fill addList and clear command's name
client.buttube.slashCmd(client, 'client_id', {
    listEnabled: true/false, 
    playCmd: 'play command name',
    setupCmd: 'setup command name',
    addList: 'add song to playlist command name',
    songName: 'the option name which is added to the slash command',
    clear: 'clear command name'
    })        
```
addlist function will not work witout api key 
addlist slashcommand is off by default to turn it on just set the above to true and provide the youtube api key
# That's it enjoy

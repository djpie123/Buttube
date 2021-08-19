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
client.buttube = new buttube(client, "mongodb url", footer, imageUrl)
```
> ### params
client - Discord.client </br>
mongodb url - mongodb connection url </br>
footer - footer for embed  </br>
image url - image url for embed </br>
## OR
Below is for Local file database
```js
const Discord = require('discord.js');
Client = Discord.Client;
Intents = Discord.Intents;
//GUILD_VOICE_STATES intent is required
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const {quickbuttube} = require('buttube')
client.buttube = new quickbuttube(client, footer, imageUrl)
```
> ### params
client - Discord.client </br>
footer - footer for embed  </br>
image url - image url for embed </br>
> ### another step 
```js
//add this event
client.on('interactionCreate', async(interaction) => {
    if (!interaction.isButton()) return;
    client.buttube.interaction(interaction)
})
```
> ### another step
add this line in Your code anywhere
```js
client.buttube.events()
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
         
        client.buttube.addSongToPlaylist(message, args.join(" "), apikey);
    }
```
>### Deleting a playlist
```js
if(command === "clearList" || command === "c"){
         
        client.buttube.clearList(message);
    }
```
# That's it enjoy

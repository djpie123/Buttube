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
```js
const {buttube} = require('buttube')
const client = new Discord.Client();
//necessary to be at this place only
require('discord-buttons')(client)
client.buttube = new buttube(client, "mongodb url")
```
> ### params
client - Discord.client
mongodb url - mongodb connection url
> ### another step 
```js
//add this event
client.on("clickButton", async(button) => {
client.buttube.button(button)
})
```
# how to use
here is how to create commands
>### play command
```js
if(command === "play" || command === "p"){
         
        client.buttube.play(message, args.join(" "));
    }
```
>### to make setup command
```js
if(command === "setup" || command === "leave"){
     client.buttube.setup(message);
    }
```
>
#That's it enjoy


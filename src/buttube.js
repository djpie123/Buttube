const DisTube = require('distube')
const { MessageButton, MessageActionRow } = require('discord-buttons'); 
const {MessageEmbed} = require("discord.js")
class buttube {
    /**
     * 
     * @param {Discord.Client} client - A discord.js client.
     */

    constructor(client) {

        if (!client) throw new Error("A client wasn't provided.");

        this.client = client;
    this.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
    }
    async setup(message){
        message.delete()
        const stop = new MessageButton()
      .setLabel('stop')
      .setStyle('red')
      .setID('stop');
      const pause = new MessageButton()
      .setLabel('pause')
      .setStyle('blurple')
      .setID('pause');
      const resume = new MessageButton()
      .setLabel('resume')
      .setStyle('green')
      .setID('resume');
      const skip = new MessageButton()
      .setLabel('skip')
      .setStyle('grey')
      .setID('skip');
      const que = new MessageButton()
      .setLabel('Get que')
      .setStyle('blurple')
      .setID('que');
      const row = new MessageActionRow()
      .addComponent(stop)
      .addComponent(pause)
      .addComponent(resume)
      .addComponent(skip)
      .addComponent(que);
 const musicem = new MessageEmbed()
.setTitle('Not Playing')
 .setImage(`https://i.imgur.com/msgNNqN.gif`)
        this.msg = await  message.channel.send(musicem, row)
    this.events(this.msg)
    }
async events(msg){
    this.distube
 .on("playSong", (message, queue, song) =>{
 const embed1 = new MessageEmbed()
    .setTitle(`Now Playing ${song.name}`)
    .setImage(`${song.thumbnail}`)  
  msg.edit(embed1)
    })
	.on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ).then(m => m.delete({ timeout: 5000 })
    ))
    .on("finish", (message, que, song) =>{
const embed = new MessageEmbed()
    .setTitle('Not Playing')
    .setImage(`https://i.imgur.com/msgNNqN.gif`)
    msg.edit(embed)
    });
}
async play(message, music){
    this.distube.play(message, music)
    message.delete()
}
async button(button){
    const embed = new MessageEmbed()
    .setTitle('Not Playing')
    .setImage(`https://i.imgur.com/msgNNqN.gif`)
  const message = button.message;
  if(button.id == 'stop'){
    this.distube.stop(message)
    button.message.edit(embed)
    button.reply.send('Stopped', true)
  }else if(button.id == 'pause'){
    this.distube.pause(message)
    button.reply.send('Paused', true)
  }else if(button.id == 'resume'){
    this.distube.resume(message)
    button.reply.send('Resumed', true)
  }else if(button.id == 'que'){
    let queue = this.distube.getQueue(message);
        let curqueue = queue.songs.map((song, id) =>
        `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).join("\n");
    button.reply.send(curqueue, true)
  }else if(button.id == 'skip'){
    this.distube.skip(message)
    button.reply.send('Skipped', true)
}
}
}
module.exports =  buttube;
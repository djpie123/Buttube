const {DisTube} = require('distube')
const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")
const { Database } = require("quickmongo");
class buttube {
    /**
     * 
     * @param {Discord.Client} client - A discord.js client.
     */

    constructor(client, url = '', footer = '', imageURL = '') {

        if (!client) throw new Error("A client wasn't provided.");
        if (!url) throw new Error("Please provide a mongodb connection url")
        if(!footer) footer =  "";
        this.footer = footer
        if(!imageURL) imageURL = 'https://i.imgur.com/msgNNqN.gif'
        this.imageURL = imageURL
        this.client = client;
        this.db = new Database(url)
    this.distube = new DisTube(client, { searchSongs: 1, emitNewSongOnly: true, leaveOnFinish: true, emitAddSongWhenCreatingQueue: false, emitAddListWhenCreatingQueue: false, leaveOnEmpty: true });
    }
    async setup(message){
      message.delete()
const musicem = {
  title: 'Not Playing',
  image: {
    url: this.imageURL,
  },
  footer: {
    text: this.footer,
    },
  };
      this.msg = await  message.channel.send({
        embeds:[musicem],
        components:[]
      })
      this.db.set(`${message.guild.id}`, `${this.msg.id}`)
  }
  async play(message, music){
if(music.toLocaleLowerCase() == 'my list'){
let list = await this.db.get(`playlist_${message.author.id}`)
this.distube.playCustomPlaylist(message, list, { name: `${message.author.id}` })
}else{
      this.distube.play(message, music)
}
message.delete()
  }
   async volume(message, percent){
      this.distube.setVolume(message, percent)
      message.delete()
      message.channel.send(`Volume is now set to ${percent}%`).then(m => m.delete({ timeout: 5000 })
  )
  }
async addSongToPlaylist(message, song, key){
const { YTSearcher } = require('ytsearcher');
const searcher = new YTSearcher(key);
let result = await searcher.search(`${song}`, { type: 'video' });
const url = result.first.url
message.delete()
 this.db.push(`playlist_${message.author.id}`, `${url}`)
message.channel.send({content: `Added ${url} to your playlist`, }).then(m => m.delete({ timeout: 300000 }))    
}
async clearList(message){
message.delete()
this.db.delete(`playlist_${message.author.id}`)
message.channel.send({content: `Cleared all songs from your play list`, }).then(m => m.delete({ timeout: 300000 }))    
}
  async events(){
    this.distube
     .on("playSong", async (queue, song) =>{
        const msgId = await this.db.get(`${queue.textChannel.guild.id}`)
        const msg = await queue.textChannel.messages.fetch(msgId)
        const row = new MessageActionRow()
        .addComponents(
    new MessageButton()
        .setLabel('stop')
        .setStyle('DANGER')
        .setCustomId('stop')
        .setEmoji('874995061589434418'),
       new MessageButton()
        .setLabel('pause')
        .setStyle('PRIMARY')
        .setCustomId('pause')
      .setEmoji('874995633356939265'),
        new MessageButton()
        .setLabel('resume')
        .setStyle('SUCCESS')
        .setCustomId('resume')
.setEmoji('819923518556209172'),
        new MessageButton()
        .setLabel('skip')
        .setStyle('SECONDARY')
        .setCustomId('skip')
.setEmoji('874995323896987678'),
        new MessageButton()
        .setLabel('Get que')
        .setStyle('PRIMARY')
        .setCustomId('que')
.setEmoji('874999759637725225'))
        const row2 = new MessageActionRow()
        .addComponents(  
        new MessageButton()
        .setLabel('Set Volume')
        .setStyle('SECONDARY')
        .setCustomId('volume')
.setEmoji('874996210937774191'),
        new MessageButton()
        .setLabel('Set Filter')
        .setStyle('SECONDARY')
        .setCustomId('filter')
.setEmoji('874996455247589427'))
      const embed1 = {
        title: `Now Playing: ${song.name}`,
        image: {
          url: `${song.thumbnail}`,
        },
        footer: {
          text: this.footer,
          },
        };
      msg.edit({embeds:[embed1], components:[row, row2]})
        })
      .on("addSong", (queue, song) => {
        queue.textChannel.send({
        content: `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`,
      }).then(m => m.delete({ timeout: 300000 }))
    
    })
.on("addList", (queue, playlist) => {
       let curqueue = playlist.songs.map((song, id) =>
      `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
      ).join("\n");
    queue.textChannel.send({
        content: `The following songs will be played from the playlist of <@${playlist.name}>. \n ${curqueue}`,
      }).then(m => m.delete({ timeout: 300000 }))
    })
.on("empty", async queue =>{
 const msgId = await this.db.get(`${queue.textChannel.guild.id}`)
        const msg = await queue.textChannel.messages.fetch(msgId)
          const embed = {
            title: 'Not Playing',
  image: {
    url: this.imageURL,
  },
  footer: {
    text: this.footer,
    },
  };
        msg.edit({embeds:[embed], components:[]})
})
      .on("finish", async (queue) =>{
        const msgId = await this.db.get(`${queue.textChannel.guild.id}`)
        const msg = await queue.textChannel.messages.fetch(msgId)
          const embed = {
            title: 'Not Playing',
  image: {
    url: this.imageURL,
  },
  footer: {
    text: this.footer,
    },
  };
        msg.edit({embeds:[embed], components:[]})
        });
    }
async interaction(button){
const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave","flanger", "none"]
const msgId = await this.db.get(`${button.guildId}`)
const msg = await button.channel.messages.fetch(msgId)
const embed = {
  title: 'Not Playing',
  image: {
    url: this.imageURL,
  },
  footer: {
    text: this.footer,
    },
  };
const message = button.message;
if(button.customId == 'stop'){
  this.distube.stop(message)
  msg.edit({embeds:[embed], components: [] })
  button.reply({content:'Stopped', ephemeral:true})
}else if(button.customId == 'pause'){
  this.distube.pause(message)
  button.reply({content:'Paused', ephemeral:true })
}else if(button.customId == 'resume'){
  this.distube.resume(message)
  button.reply({content:'Resumed', ephemeral:true })
}else if(button.customId == 'que'){
  let queue = this.distube.getQueue(message);
      let curqueue = queue.songs.map((song, id) =>
      `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
      ).join("\n");
  button.reply({content:curqueue, ephemeral:true })
}else if(button.customId == 'skip'){
  this.distube.skip(message)
  button.reply({content:'Skipped', ephemeral:true })
}else if(button.customId == 'volume'){
button.reply({content:'Please send the amount of volume in percentage (eg- 10)', ephemeral:true })
const filter = m => m.author.id == button.clicker.id
const collector = await button.channel.createMessageCollector(filter, { time: 30000 })
collector.on('collect', async (msg) => {
 msg.delete()
 if (!msg.content){
   return collector.stop('error');
   }else if(isNaN(msg.content)){
     return collector.stop('num');
   }else{
     this.distube.setVolume(message, Number(msg.content))
     button.editReply({content:`volume is now set to ${msg.content}%`, ephemeral:true })
     collector.stop('done')
   }
})
collector.on('end', async (msgs, reason) => {
 if(reason == 'error') return button.editReply({content: 'Please send something', ephemeral:true });
 if(reason == 'num') return button.editReply({content: 'Please send a number', ephemeral:true });
 if(reason == 'time') return button.editReply({content: 'You did not reply on time', ephemeral:true });
})
  }else if(button.customId == 'filter'){
    button.reply({content:'Please send the name of filter to apply among the following filters. Filters: `3d`,`bassboost`,`echo`,`karaoke`,`nightcore`,`vaporwave`,`flanger` and `None`', ephemeral:true })
   const filter = m => m.author.id == button.clicker.id
   const collector = await button.channel.createMessageCollector(filter, { time: 30000 })
   collector.on('collect', async (msg) => {
     msg.delete()
     if (!msg.content){
       return collector.stop('error');
      }else if(!filters.includes(msg.content)){
         return collector.stop('nu');
       }else{
if(msg.content.toLocaleLowerCase() == 'none'){
this.distube.setFilter(message, false)
button.editReply({content:`Removed all the filters`, ephemeral:true })
         collector.stop('done')
}else{
         let filter = this.distube.setFilter(message, msg.content)
         button.editReply({content:`Applied the filter ${msg.content}`, ephemeral:true })
         collector.stop('done')
       }
       }
   })
   collector.on('end', async (msgs, reason) => {
     if(reason == 'error') return button.editReply({content: 'Please send something', ephemeral:true });
     if(reason == 'nu') return button.editReply({content: 'The reply you gave is not among the filters list', ephemeral:true });
     if(reason == 'time') return button.editReply({content: 'You did not reply on time', ephemeral:true });
  })
      }
}
}

module.exports =  buttube;
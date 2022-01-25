const {DisTube} = require('distube')
const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")
const { YTSearcher } = require('ytsearcher');
class quickbuttube {
    /**
     * 
     * @param {Discord.Client} client - A discord.js client.
     */

    constructor(client, musicem, api = '') {

        if (!client) throw new Error("A client wasn't provided.");
        this.client = client;
        this.musicem = musicem
        if(!musicem){
            musicem = new MessageEmbed()
            .setTitle('Not Playing')
            .setImage('https://i.imgur.com/msgNNqN.gif')
        }
        if(api) this.searcher = new YTSearcher(api);
        this.distube = new DisTube(client, { searchSongs: 1, emitNewSongOnly: true, leaveOnFinish: true, emitAddSongWhenCreatingQueue: false, emitAddListWhenCreatingQueue: false });
        const quickdb = require('./db/index.js');
        this.db = quickdb()
    };
    
        
    async setup(message){
      message.delete()
      this.msg = await  message.channel.send({
        embeds:[this.musicem],
        components:[]
      })
      this.db.set(`${message.guild.id}`, `${this.msg.id}`)
  }
  async play(message, music){
    if(music.toLocaleLowerCase() == 'my list'){
      let list = await this.db.get(`playlist_${message.author.id}`)
      const user_playlist = await this.distube.createCustomPlaylist(list, {
      member: message.member, 
      properties: { name: `playlist_${message.author.id}` }, 
      parallel: true
      });
      this.distube.play(message.member.voice?.channel, user_playlist, {
      member: message.member, 
      textChannel: message.channel, 
      message
      });
      }else{
            this.distube.play(message.member.voice?.channel, music, {member: message.member, textChannel: message.channel, message})
      }
    message.delete()
      }
   async volume(message, percent){
      this.distube.setVolume(message, percent)
      message.delete()
      message.channel.send(`Volume is now set to ${percent}%`).then(m => m.delete({ timeout: 5000 })
  )
  }
  async addSongToPlaylist(message, song){
    let result = await this.searcher.search(`${song}`, { type: 'video' });
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
    async events(playembed){
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
          .setEmoji('⏺️'),
         new MessageButton()
          .setLabel('pause')
          .setStyle('PRIMARY')
          .setCustomId('pause')
        .setEmoji('⏸️'),
          new MessageButton()
          .setLabel('resume')
          .setStyle('SUCCESS')
          .setCustomId('resume')
  .setEmoji('▶️'),
          new MessageButton()
          .setLabel('skip')
          .setStyle('SECONDARY')
          .setCustomId('skip')
  .setEmoji('⏭'),
          new MessageButton()
          .setLabel('Get que')
          .setStyle('PRIMARY')
          .setCustomId('que')
  .setEmoji('🎛️'))
          const row2 = new MessageActionRow()
          .addComponents(  
          new MessageButton()
          .setLabel('Set Volume')
          .setStyle('SECONDARY')
          .setCustomId('volume')
  .setEmoji('🔈'),
          new MessageButton()
          .setLabel('Set Filter')
          .setStyle('SECONDARY')
          .setCustomId('filter')
  .setEmoji('🎚️'))
       if(!playembed){
        playembed = {
          title: `Now Playing: -song.name-`,
          };
       }
       const embed1 = new Discord.MessageEmbed()
       .setImage(song.thumbnail)
       if(playembed.title) embed1.setTitle(playembed.title
        .replace("-song.name-", `${song.name}`)
       .replace("-song.url-", `${song.url}`)
       .replace("-song.duration-", `${song.formattedDuration}`)
       .replace("-song.user-", `${song.user}`));
       if(playembed.description) embed1.setDescription(playembed.description
       .replace("-song.name-", `${song.name}`)
       .replace("-song.url-", `${song.url}`)
       .replace("-song.duration-", `${song.formattedDuration}`)
       .replace("-song.user-", `${song.user}`));
       if(playembed.footer) embed1.setFooter(playembed.footer
        .replace("-song.name-", `${song.name}`)
        .replace("-song.url-", `${song.url}`)
        .replace("-song.duration-", `${song.formattedDuration}`)
        .replace("-song.user-", `${song.user}`));
      msg.edit({embeds:[embed1], components:[row, row2]})
        })
      .on("addSong", (queue, song) => {
        queue.textChannel.send({
        content: `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`,
      }).then(m => m.delete({ timeout: 300000 }))
    
    })
    .on("empty", async queue =>{
      const msgId = await this.db.get(`${queue.textChannel.guild.id}`)
             const msg = await queue.textChannel.messages.fetch(msgId)
             msg.edit({embeds:[this.musicem], components:[]})
     })
      .on("finish", async (queue) =>{
        const msgId = await this.db.get(`${queue.textChannel.guild.id}`)
        const msg = await queue.textChannel.messages.fetch(msgId)
        msg.edit({embeds:[this.musicem], components:[]})
        });
    }
async interaction(button){
const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave","flanger", "none"]
const msgId = await this.db.get(`${button.guildId}`)
const msg = await button.channel.messages.fetch(msgId)
const embed = this.musicem
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
         let filter = this.distube.setFilter(message, msg.content)
         button.editReply({content:`Applied the filter ${msg.content}`, ephemeral:true })
         collector.stop('done')
       }
   })
   collector.on('end', async (msgs, reason) => {
     if(reason == 'error') return button.editReply({content: 'Please send something', ephemeral:true });
     if(reason == 'nu') return button.editReply({content: 'The reply you gave is not among the filters list', ephemeral:true });
     if(reason == 'time') return button.editReply({content: 'You did not reply on time', ephemeral:true });
  })
      }
}
async slashCmd(client, client_id = '', options){
  client.on('interactionCreate', async interaction => {
  const message = interaction.message
  const slcmd = interaction.commandName
    if(slcmd == options.setupCmd){
  interaction.reply("Sen't the setup embed")
  const msg = await interaction.channel.send({embeds: [this.musicem]})
  this.db.set(interaction.guild.id, msg.id)
  }else if(slcmd == options.playCmd){
    const music = interaction.options.get('song_name').value;
    if(music.toLocaleLowerCase() == 'my list'){
    let list = await this.db.get(`playlist_${interaction.member.id}`)
    const user_playlist = await this.distube.createCustomPlaylist(list, {
    member: interaction.member, 
    properties: { name: `playlist_${interaction.member.id}` }, 
    parallel: true
    });
    this.distube.playVoiceChannel(interaction.member.voice.channel, user_playlist, { member: interaction.member, textChannel: interaction.channel })
    }else{
    this.distube.playVoiceChannel(interaction.member.voice.channel, music, { member: interaction.member, textChannel: interaction.channel })
    }
    interaction.reply({ content: 'Done', ephemeral: true });
}
if(options.listEnabled == true){
if(slcmd == options.addList){
   const music = interaction.options.get(options.songName).value
  let result = await this.searcher.search(`${music}`, { type: 'video' });
  const url = result.first.url
   this.db.push(`playlist_${interaction.member.id}`, `${url}`)
  interaction.reply({content: `Added ${url} to your playlist`, ephemeral: true})
  }else if(slcmd == options.clear){
  this.db.delete(`playlist_${interaction.member.id}`)
  interaction.reply({content: `Cleared all songs from your play list`, ephemeral: true})
  }
}
  })
  }
}
module.exports =  quickbuttube;
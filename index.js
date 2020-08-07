const Discord = require('discord.js')
const client = new Discord.Client()
const fetch = require('node-fetch')

var m = null
var bot = null

function changeStatus(color, status){
  var e = new Discord.MessageEmbed()
  e.setTitle(`Null Status`)
  e.addField(`Status`,status)
  e.addField(`Last Updated`, `${new Date().getHours()}:${new Date().getMinutes()} RTZ (Repl Time Zone)`)
  e.setFooter(`Null has an 99.99% uptime`)
  e.setColor(color)

  m.edit(e)
}

client.on('ready', async ()=>{
  console.log(`Ready! ${client.user.tag}`)
  client.user.setActivity(' Null!', {type: 'WATCHING'})

  m = await client.channels.cache.get('734887347812040777').messages.fetch('740590574444216320')
  bot = await client.users.cache.get('734192520996716556')

  
  changeStatus(`#50c878`, `Online - Null is online and ready to respond`)

  setInterval(async()=>{
    if(bot.presence.status == 'offline'){
      changeStatus(`#FF0000`, `Down - Null is currently down. We're working on fixing it`)
      client.user.setActivity(' Null is down!', {type: 'PLAYING'})
      return
    }
    client.user.setActivity(' Null!', {type: 'WATCHING'})
    var body = await fetch('http://null-discord-bot.herokuapp.com/')
    if(body.status == 503){
      changeStatus(`#FF0000`, `Not Responding - Null is not responding. We're not sure what's going on.`)
    }else if(body.status == '200'){
      changeStatus(`#50c878`, `Online - Null is online and ready to respond.`)
    }else{
      changeStatus(`#FFFF00`, `Restarting - Null is restarting and may now be available in every server.`)
    }
  }, 600000)
})

client.on('message', async (m)=>{
  if(m.content.toLowerCase() == 'reload' && m.member.hasPermission('ADMINISTRATOR')){
    m.react('👍')
    if(bot.presence.status == 'offline'){
      changeStatus(`#FF0000`, `Down - Null is currently down. We're working on fixing it`)
      client.user.setActivity(' Null is down!', {type: 'PLAYING'})
      return
    }
    client.user.setActivity(' Null!', {type: 'WATCHING'})
    var error = null
    var body = await fetch('http://null-discord-bot.herokuapp.com/').catch((err)=>{
      error = err
    })
    if(error != null){
      changeStatus(`#FF0000`, `Down - Null is currently down. We're working on fixing it`)
      return
    }
    if(body.status == 503){
      changeStatus(`#FF0000`, `Not Responding - Null is not responding. We're not sure what's going on.`)
    }else if(body.status == '200'){
      changeStatus(`#50c878`, `Online - Null is online and ready to respond.`)
    }else{
      changeStatus(`#FFFF00`, `Restarting - Null is restarting and may now be available in every server.`)
    }
  }
})
client.login(process.env.TOKEN)
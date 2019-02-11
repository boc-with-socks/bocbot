// ENV
const dotenv = require('dotenv')
dotenv.config()

// Import the discord.js module
const Discord = require('discord.js')

// Create an instance of a Discord client
const client = new Discord.Client()

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!')
});

const Handler = require('./src/handler.js')
const h = new Handler()

client.on('message', message => {

    h.process(message)
})

client.on('error', () => {

    client.destroy() // idk what i'm doing
    client.login(process.env.TOKEN)
})

client.login(process.env.TOKEN)
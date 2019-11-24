const axios = require('axios')

module.exports = class Chembl
{
    constructor(message) {

        this.message = message

        this.message.channel.startTyping()
        this.endpoint = this.getEndpoint()
        
        this.load().then(data => {

            var molecule = this.parseData(data.data.molecules)

            this.sendMessage(`The formula of ${molecule.name} is ${molecule.formula}`)
            this.message.channel.stopTyping()

        }).catch(err => {

            this.message.channel.stopTyping()
            console.log(err)
        })
    }

    getEndpoint() {

        var limit = 100
        var conditions = 'pref_name__isnull=false&molecule_properties__full_molformula__isnull=false'

        return `https://www.ebi.ac.uk/chembl/api/data/molecule.json?limit=${limit}&${conditions}`
    }

    parseData(molecules) {

        var molecule = molecules[Math.floor(Math.random()*molecules.length)]

        var fullNameArray = molecule.pref_name.toLowerCase().split(' ')

        for (var i = 0; i < fullNameArray.length; i++) {
           // You do not need to check if i is larger than splitStr length, as your for does that for you
           // Assign it back to the array
           fullNameArray[i] = fullNameArray[i].charAt(0).toUpperCase() + fullNameArray[i].substring(1);     
        }
        // Directly return the joined string
        var fullName = fullNameArray.join(' '); 

        return {
            name: fullName,
            formula: molecule.molecule_properties.full_molformula
        }
    }

    load() {

        return axios.get(this.endpoint)
    }

    sendMessage(content) {

        this.message.channel.send(content)
    }
}
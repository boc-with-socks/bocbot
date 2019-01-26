const axios = require('axios')

module.exports = class OpenTDB
{
    constructor(options) {

        this._options = options
    }

    load() {

        return axios.get('https://opentdb.com/api.php?amount=10')
    }
}
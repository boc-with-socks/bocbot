const axios = require('axios')
const he = require('he')

module.exports = class Damkus
{
    constructor(options) {

        this._options = options
        this.category_default = "science"
        this.difficulty_default = "easy"
        this.amount_default = 10
    }

    load() {

        var options = this.parseOptions()

        return axios.get(`http://damkus.xyz/api/category=${options.category}&amount=${options.amount}&difficulty=${options.difficulty}`)
    }

    parseQuestions(q) {

        var parsedQ = []
        q.forEach(item => {

            parsedQ.push({
                'category': item[0],
                'difficulty': this.difficulty_default, //todo
                'question': he.decode(item[1]).replace(/<\/?[^>]+(>|$)/g, ''),
                'answer': he.decode(item[2]).toLowerCase()
            })
        })

        return parsedQ
    }

    parseOptions() {

        var category = this._options[0] ? this._options[0] : this.category_default
        category = category.replace(/[_]/gi, ' ')

        return {

            'category': category,
            'difficulty': this._options[1] ? this._options[1] : this.difficulty_default,
            'amount': this._options[2] ? this._options[2] : this.amount_default
        }
    }
}
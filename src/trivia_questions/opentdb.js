const axios = require('axios')
var he = require('he')

module.exports = class OpenTDB
{
    constructor(options) {

        this._options = options
        this.category_default = 9
        this.difficulty_default = "easy"
        this.amount_default = 10
    }

    load() {

        var options = this.parseOptions()

        return axios.get(`https://opentdb.com/api.php?amount=${options.amount}&category=${options.category}&difficulty=${options.difficulty}&type=multiple`)
    }

    parseQuestions(q) {

        var parsedQ = []
        q.forEach(item => {

            parsedQ.push({
                'category': item.category,
                'difficulty': item.difficulty,
                'question': he.decode(item.question),
                'answer': he.decode(item.correct_answer).toLowerCase()
            })
        })

        return parsedQ
    }

    parseOptions() {

        return {

            'category': this._options[0] ? this._options[0] : this.category_default,
            'difficulty': this._options[1] ? this._options[1] : this.difficulty_default,
            'amount': this._options[2] ? this._options[2] : this.amount_default
        }
    }
}
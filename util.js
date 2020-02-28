const methods = {
    array: 'resArr',
    object: 'resObj',
    boolean: 'resBool',
    string: 'resStr',
    null: 'resNull'
}

export default class Result {
    static resList = (list) => {
        return list.forEach(item => {


            const methodName = `res${item.type}`
            return Result[methodName](item)
        });
    }

    static resObj = (obj) => {
        /**
         *  "type": "Object",
            "name": "responseData",
            "rule": "",
            "value": "",
            children: [...]
         *
         */
        return {
            type: 'object',
            properties: Result.resList(obj.children)
        }
    }

    static resArr = (arr) => {
        /**
         * "type": "Array",
           "name": "executor",
           "rule": "1",
           "value": "['admin','sadmin','audit','administrator','tenant']",
         */

        if (arr.value) {
            return {
                type: 'string',
                enum: arr.value
            }
        }

        /**
         *  "type": "Array",
            "name": "data",
            "rule": "10-30",
            "value": "",
            "children": [...]
         */
        const arrObj = {
            type: 'array',
            items: Result.resList(obj.children)
        }

        if (arr.rule) {
            let rule = arr.rule.split('-')
            arrObj.minItems = rule[0]
            arrObj.maxItems = rule[1]
        }

        return arrObj
    }

    static resBool = (boolean) => {
        /**
         *  "type": "Boolean",
            "name": "boolean",
            "rule": "1-2",
            "value": "true",
         *
         */
        return {
            type: 'boolean',
            default: boolean.value === 'true' ? true : false
        }
    }

    static resNull = () => {
        return {
            type: 'null'
        }
    }

    static resStr = (str) => {
        /**
         *  "type": "String",
            "name": "result",
            "rule": "1",
            "value": "['成功','失败']",
         *
         */
        let strObj = {
            type: 'string',
            mock: {
                mock:str.value
            }
        }

        if(str.rule) {
            if (str.rule === 1) {
                return {
                    type: 'string',
                    enum: str.value
                }
            }
        }

        return {...strObj, ...resRule(str)}
    }

    static resRule = (obj) => {
        let rules = {}
        if (obj.rule) {
            let rule = arr.rule.split('-')
            rules.minItems = rule[0]
            rules.maxItems = rule[1]
        }
        return rules
    }
}


var resStr=function(str) {
    var strObj = {
        type: 'string',
        mock: {
            mock:str.value
        }
    }
    // return {...strObj, ...resRule(str)}
    return Object.assign(strObj, resRule(str))
}

var resRule = function(obj) {
    var rules = {}
    if (obj.rule) {
        var rule = obj.rule.split('-')
        rules.minItems = rule[0]
        rules.maxItems = rule[1]
    }
    return rules
}

console.log(resStr({
    rule: "1",
    value: ['成功','失败'],
}))



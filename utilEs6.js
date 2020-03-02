const methods = {
    array: 'resArr',
    object: 'resObj',
    boolean: 'resBool',
    string: 'resStr',
    number: 'resNum',
    null: 'resNull',
    regexp: 'resReg',
    function: 'resFun'
}

export default class Result {
    static resList = (list) => {
        let resultObj = {}

        if (list instanceof Array) {
            list.forEach(item => {
                const method = methods[item.type.toLowerCase()]
                let result = {}
                if (!method) {
                    result = Result.resNull(item)
                } else {
                    Result[method](item)
                }

                // const result = Result[method](item)
                resultObj[item.name] = result
            });
            return resultObj
        }
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
        let values = []
        arr.value.replace(/\'(\w|[^\x00-\xff])+\'/g, (...args) => {
            values.push(args[0].slice(1, args[0].length -1))
        })

        if (arr.value) {
            return {
                type: 'string',
                enum: values
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
            items: {
                type: 'object',
                properties: Result.resList(arr.children)
            }
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

    static resNum = (number) => {
        return {
            type: 'number',
            mock: {
                mock: number.value
            }
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
        if (str.value.includes('[')) {
            return Result.resArr(str)
        }

        let strObj = {
            type: 'string',
            mock: {
                mock:str.value
            }
        }

        if(str.rule) {
            /**
             *  "type": "String",
                "name": "result",
                "rule": "1",
                "value": "['成功','失败']",
            *
            */
            if (str.rule === 1) {
                return {
                    type: 'string',
                    enum: str.value
                }
            } else {
            /**
             *  "type": "String",
                "name": "result",
                "rule": "1-14",
                "value": "*",
            *
            */
                let length = str.rule.split('-')

                return {...strObj,
                    minLength: length[0],
                    maxLength: length[1] || ''
                }
            }
        }

        return strObj
    }

    static resReg = (reg) => {
        return {
            type: 'string',
            pattern: reg.value
        }
    }

    static resFun = (fun) => {
        return {
            type: 'string',
            value: fun.value
        }
    }

    static resUnd = (und) => {
        return Result.resNull(und)
    }
}

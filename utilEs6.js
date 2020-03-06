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
                if (item.name === 'responseData') {
                    console.log('----------mountData')
                    console.log(item)
                    console.log('++++++++++++++mountData')
                }

                const method = methods[item.type.toLowerCase()]
                let result = {}
                if (!method) {
                    result = Result.resNull(item)
                } else {
                    result = Result[method](item)
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
        // "['admin','sadmin','audit','administrator','tenant']" => ['admin','sadmin','audit','administrator','tenant']
        // 场景一
        // {
        //     "id": 13073322,
        //     "scope": "response",
        //     "type": "Array",
        //     "pos": 2,
        //     "name": "items",
        //     "rule": "",
        //     "value": "[1, true, 'hello', /\\w{10}/]",
        //     "description": "自定义数组元素示例",
        //     "parentId": -1,
        //     "priority": 1,
        //     "interfaceId": 1351315,
        //     "creatorId": 137864,
        //     "moduleId": 334928,
        //     "repositoryId": 229842,
        //     "required": false,
        //     "createdAt": "2019-11-01T01:34:46.000Z",
        //     "updatedAt": "2019-11-01T01:34:46.000Z",
        //     "deletedAt": null
        // }
        // 场景二
        // {
        //     "id": 13073680,
        //     "scope": "response",
        //     "type": "Array",
        //     "pos": 3,
        //     "name": "month",
        //     "rule": "1",
        //     "value": "[\"201901\",\"201902\",\"201903\",\"201904\",\"201905\",\"201906\",\"201907\",\"201908\",\"201909\",\"201910\",\"201911\",\"201912\"]",
        //     "description": null,
        //     "parentId": 13073679,
        //     "priority": 1572573016631,
        //     "interfaceId": 1351336,
        //     "creatorId": null,
        //     "moduleId": 334928,
        //     "repositoryId": 229842,
        //     "required": false,
        //     "createdAt": "2019-11-01T01:50:16.000Z",
        //     "updatedAt": "2019-11-02T08:20:25.000Z",
        //     "deletedAt": null
        //   }
        // 场景三
        // [1,2] => [1,2]
        // 场景四 添加maxItem为3
        // {
        //     "id": 12222256,
        //     "scope": "response",
        //     "type": "Array",
        //     "pos": 2,
        //     "name": "data",
        //     "rule": "3",
        //     "value": "",
        //     "description": "3",
        //     "parentId": 12222255,
        //     "priority": 1567316670749,
        //     "interfaceId": 1298342,
        //     "creatorId": null,
        //     "moduleId": 323347,
        //     "repositoryId": 229842,
        //     "required": false,
        //     "createdAt": "2019-09-01T05:44:30.000Z",
        //     "updatedAt": "2019-11-21T01:58:38.000Z",
        //     "deletedAt": null
        //   }
        arr.value.replace(/\'(\w|[^\x00-\xff])+\'/g, (...args) => {
            let value = args[0]
            if (typeof args[0] === String) {
                value = args[0].slice(1, args[0].length -1)
            }
            values.push(value)
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

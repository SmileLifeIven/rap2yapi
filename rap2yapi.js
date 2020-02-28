const fs = require("fs");

const handle

const handleObj = (data) => {
    return {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: 'object',
        properties: {
            totalNum: {
                type: 'number',
                mock: {
                    mock: 10
                }
            }
        }
    }
}

const interfateObj = (data) => {
    return [{
        name: "日志111",
        list: [
            {
                method: 'GET',
                title: '日志列表111',
                path: '/logs/user_log',
                res_body: data,
                res_body_is_json_schema: true,
                status: 'done'
            }
        ]
    }]
}

const result = handleObj()
const interResult = interfateObj(result)

const resultStr = JSON.stringify(interResult, (key, value) => {
    if (key === 'res_body') {
        return JSON.stringify(value)
    }
    return value
})
// console.log(resultStr)

// fs.writeFile('rap2yapi.json', resultStr,  function(err) {
//    if (err) {
//        return console.error(err);
//    }
//    console.log("数据写入成功！");
//    console.log("--------我是分割线-------------")
//    console.log("读取写入的数据！");
// });

var http=require('http');
const util = require('./util').default
const mountProperty = require('./mountProperty').default
const fs = require("fs");
const  repositoryData  = require('./repository.json').data

const handleResponseProperties = (data) => {
    let mountData = mountProperty.mount(data)
    // console.log('----------mountData')
    // console.log(JSON.stringify(mountData))
    // console.log('++++++++++++++mountData')
    let properties = util.resList(mountData)

    return {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: 'object',
        // properties: util.resList(mountData)
        properties: properties
    }
}

const handleInterfaceProperties = (data) => {
    // console.log(data.name)
    // if (data.name !== '获取数据中心') {
    //     return
    // }


    return {
        method: data.method,
        title: data.name,
        path: data.url.match(/^\//) ? data.url : `/${data.url}`,
        res_body: handleResponseProperties(data.properties),
        res_body_is_json_schema: true,
        status: 'done'
    }
}

const handleModule = (repository, moduleName) => {
    const moduleObj = repository.modules.filter(moduleObj => moduleObj.name === moduleName)[0]
    return {
        name: moduleObj.name,
        desc: moduleObj.description,
        list: moduleObj.interfaces.map(interfaceItem => handleInterfaceProperties(interfaceItem))
    }
    // let test = repository.modules.filter(moduleObj => moduleObj.name === moduleName)[0].interfaces.filter(interfaceItem => interfaceItem.name === '获取所有授权')[0]
    // handleInterfaceProperties(test)
}

const handleRepository = (repository) => {
    return repository.modules.map(moduleObj => handleModule(repository, moduleObj.name))
}

// const result = []
// result.push(handleModule(repositoryData, 'cloud'))
// result.push(handleModule(repositoryData, '首页'))
const result = handleRepository(repositoryData)

// http.get('http://rap2.taobao.org:38080/interface/get?id=1426326', (req,res) => {
//     let result = res
//     const resultStr = JSON.stringify(result, (key, value) => {
//         if (key === 'res_body') {
//             return JSON.stringify(value)
//         }
//         return value
//     })

//     fs.writeFile('rap2yapi.json', resultStr,  function(err) {
//     // fs.writeFile('rap2yapi.json', JSON.stringify(result),  function(err) {
//        if (err) {
//            return console.error(err);
//        }
//        console.log("数据写入成功！");
//        console.log("--------我是分割线-------------")
//        console.log("读取写入的数据！");
//     });
// })


const resultStr = JSON.stringify(result, (key, value) => {
    if (key === 'res_body') {
        return JSON.stringify(value)
    }
    return value
})

fs.writeFile('rap2yapi1.json', resultStr,  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("数据写入成功！");
   console.log("--------我是分割线-------------")
   console.log("读取写入的数据！");
});



// const resultStr = JSON.stringify(result, (key, value) => {
//     if (key === 'res_body') {
//         return JSON.stringify(value)
//     }
//     return value
// })

// fs.writeFile('rap2yapi.json', resultStr,  function(err) {
// // fs.writeFile('rap2yapi.json', JSON.stringify(result),  function(err) {
//    if (err) {
//        return console.error(err);
//    }
//    console.log("数据写入成功！");
//    console.log("--------我是分割线-------------")
//    console.log("读取写入的数据！");
// });

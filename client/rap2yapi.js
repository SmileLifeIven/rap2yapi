import util from './util'
import mountProperty from './mountProperty'

const handleResponseProperties = (data) => {
    let mountData = mountProperty.mount(data)
    return {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: 'object',
        properties: util.resList(mountData)
    }
}

const handleInterfaceProperties = (data) => {
    return {
        method: data.method,
        title: data.name,
        path: data.url,
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
}

const handleRepository = (repository) => {
    let modules =  repository.modules.map(moduleObj => handleModule(repository, moduleObj.name))
    return formateReposity(modules)
}

const formateReposity = (modules) => {
    return JSON.stringify(modules, (key, value) => {
        if (key === 'res_body') {
            return JSON.stringify(value)
        }
        return value
    })
}

export default handleRepository

export default class MountProperty {
    static mount(data) {
        MountProperty.removeRepetition(data)
        const readyRemoveIndex = []
        const parents = {}

        data.forEach((property, index) => {
            if (property.parentId !== -1) {
                if (!parents[property.parentId]) {
                    parents[property.parentId] = []
                }
                parents[property.parentId].push(property)
                readyRemoveIndex.push(index)
            }
        });

        let dataWithChildren = MountProperty.mountParent(parents, data)
        return MountProperty.removeChildrenProperty(readyRemoveIndex, dataWithChildren)
    }

    static mountParent(parents, arr) {
        const parentIds = Object.keys(parents)
        parentIds.forEach(parentId => {
            let parentIndex = arr.findIndex((item) => item.id.toString() === parentId)

            if (parentIndex !== -1) {
                arr[parentIndex].children = parents[parentId]
            }
        })
        return arr
    }

    static removeChildrenProperty(indexs, data) {
        // 从后向前删除数组
        indexs.reverse().forEach(index => {
            data.splice(index, 1)
        })
        return data
    }

    // 去除rap重复数据
    static removeRepetition(data) {
        // 1. 根据parentId不为-1或者该parentId可在数组内id找到
        // 1. 根据name以及createTime确定重复数据 - 废弃
        // 2. 根据parentId确定上级重复数据,若无则以改数据为parent
        // 3. 根据重读上级id,确定下级多个重复数据去重

        let repetitionItem = MountProperty.ensureRepetition(data)
        if (!repetitionItem) {
            return data
        }

        console.log('--------')
        console.log(JSON.stringify(repetitionItem))
        // console.log(parentIndex)
        console.log('+++++++++++++')

        let readyRemoveIndexs = MountProperty.ensureRepetionIndexs(repetitionItem, data)

        readyRemoveIndexs.reverse().forEach(item => {
            data.splice(item, 1)
        })

        MountProperty.removeRepetition(data)
    }

    static ensureRepetition(data) {
        let repetitionItem = null
        data.some(outItem => {
            if (outItem.parentId === -1) {
                return false
            }

            let item = data.find((innerItem) => innerItem.id === outItem.parentId )
            if (!item) {
                repetitionItem = item
                return true
            }
        })

        return repetitionItem
        // let targetItem = null
        // let repetitionItem = null

        // data.some((outItem, index) => {
        //     let item = data.slice(index + 1).find(item => item.name === outItem.name)

        //     if (item) {
        //         targetItem = outItem
        //         repetitionItem = item
        //         return true
        //     }

        //     return false
        // })

        // if (!targetItem) {
        //     return null
        // }

        // return targetItem.createdAt > repetitionItem.createdAt ? repetitionItem : targetItem
    }

    static ensureRepetionIndexs(repetitionItem, data) {
        let removeIndexs = []
        data.filter((item, index) => {
            if (repetitionItem.id === item.id) {
                removeIndexs.push(index)
            }

            if (item.id === repetitionItem.parentId || repetitionItem.id === item.parentId) {
                removeIndexs.push(index)
            }
        })
        return removeIndexs
    }
}
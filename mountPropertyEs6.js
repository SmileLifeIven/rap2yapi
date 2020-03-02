export default class MountProperty {
    static mount(data) {
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
            arr[parentIndex].children = parents[parentId]
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
}
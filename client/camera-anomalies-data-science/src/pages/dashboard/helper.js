const findPage = (list, contextId, itemPerPage) => {
    //const numberOfPages = Math.ceil(list.length ? list.length / itemPerPage : 0)
    const elementIndex = list.findIndex(item => item.contextId === contextId)

    const pageElementExists = Math.floor(elementIndex / itemPerPage)

    return pageElementExists
}


export default findPage
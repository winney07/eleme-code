// 存储
export function saveToLocal (id, key, value) {
    // __seller__私有属性用__
    let seller = window.localStorage.__seller__
    if (!seller) {
        seller = {}
        seller[id] = {}
    } else {
        seller = JSON.parse(seller)
    // 如果商家不存在
        if (!seller[id]) {
            seller[id] = {}
        }
    }
    seller[id][key] = value
    window.localStorage.__seller__ = JSON.stringify(seller)
};
// 取数据
export function loadFromLocal (id, key, def) {
    let seller = window.localStorage.__seller__

    if (!seller) {
        return def
    }
    seller = JSON.parse(seller)[id]
    if (!seller) {
        return def
    }
    let ret = seller[key]
    return ret || def
};

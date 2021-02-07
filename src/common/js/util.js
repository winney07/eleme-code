/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse () {
let url = window.location.hash.split('?')[1]

if (!url) {
    url = 'id=1212'
}
console.log(url)

let obj = {}

let urlArr = url.split('&')

let arr = urlArr[0]
let tempArr = arr.split('=')
let key = decodeURIComponent(tempArr[0])
let val = decodeURIComponent(tempArr[1])
obj[key] = val

return obj
};

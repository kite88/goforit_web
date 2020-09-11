export function formatUnix(timestamp) {
    if (timestamp == '' || timestamp == 0 || timestamp == null) {
        return ''
    }
    let data3 = new Date(timestamp * 1000)   //精确到毫秒的就不用 *1000  了
    let y = data3.getFullYear(),
        month = data3.getMonth() + 1,
        m = month < 10 ? "0" + month : month,
        d = (data3.getDate() < 10) ? "0" + data3.getDate() : data3.getDate(),
        h = (data3.getHours() < 10) ? "0" + data3.getHours() : data3.getHours(),
        mi = (data3.getMinutes() < 10) ? "0" + data3.getMinutes() : data3.getMinutes(),
        s = (data3.getSeconds() < 10) ? "0" + data3.getSeconds() : data3.getSeconds()
    return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s
}
export default{
    formatUnix
}
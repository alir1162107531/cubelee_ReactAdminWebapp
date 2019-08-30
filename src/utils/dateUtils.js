
// export function formateDate(time) {
//   if (!time) return ''
//   let date = new Date(time)
//   return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
//     ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
// }
export function formateDate(t) {
  if (!t) return ''
    let str = '';
    let time = new Date(t)
    let yy = time.getYear();
    if(yy < 1900)
     yy = yy+1900;
    let MM = time.getMonth()+1;
    if(MM < 10)
     MM = '0' + MM;
    let dd = time.getDate();
    if(dd < 10)
     dd = '0' + dd;
    let hh = time.getHours();
    if(hh < 10)
     hh = '0' + hh;
    let mm = time.getMinutes();
    if(mm < 10)
     mm = '0' + mm;
    let ss = time.getSeconds();
    if(ss < 10)
     ss = '0' + ss;
    let ww = time.getDay();
    if(ww === 0)  ww="星期日1";
    if(ww === 1)  ww="星期一";
    if(ww === 2)  ww="星期二";
    if(ww === 3)  ww="星期三";
    if(ww === 4)  ww="星期四";
    if(ww === 5)  ww="星期五";
    if(ww === 6)  ww="星期六";
    str =  yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "  " + ww;
  return str;
}
export function greenToRed(r = 50) {
  if (r < 50) {
    // 比例小于50的时候红色是越来越多的,直到红色为255时(红+绿)变为黄色.
    return `rgb(${2 * r}%, 100%, 0%)`
  } else {
    return `rgb(100%, ${200 - 2 * r}%, 0%)`
  }
}

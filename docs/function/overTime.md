# 倒计时

```js
/**
 * 倒计时或过期时间
 * @param {String, Number} target - 日期的字符串或时间戳
 *
 * @return {Object} - { year, month, date, hour, minute, second, out }
 * @param {Boolean} out - 表示目标时间是否过期
 */
overTime(target);
```

## Usage

```js
import overTime from "../../function/time/overTime";

const param1 = "2019/11/12 13:14:15"; // 参数为日期字符串
const param2 = new Date("2019/11/12 13:14:15").getTime(); // 参数时间戳

overTime(param1); //
overTime(param2); //
```

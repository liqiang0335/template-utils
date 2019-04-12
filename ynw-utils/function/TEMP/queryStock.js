/**
 * 查询股票实时数据
 * @param {Array} codes - 股票代码
 * @return {Promise}
 */
export default function queryStocks(codes) {
  return new Promise(resolve => {
    const _codes = addPrefix(codes);
    const params = _codes.join(",");
    $.ajax({
      cache: true,
      url: "http://hq.sinajs.cn/list=" + params,
      type: "GET",
      dataType: "script",
      success: () => {
        let result = {};

        _codes.forEach(code => {
          const arr = window[`hq_str_${code}`].split(",") || [];
          const matchCode = code.match(/\d+/);
          const stockCode = matchCode ? matchCode[0] : "---";

          const notValid = arr.length < 5; //数据有问题
          const isStop = arr[32] == "03"; //停牌

          if (notValid || isStop) {
            result[stockCode] = {
              valid: false,
              stockCode,
              name: "--",
              open: "--",
              yclose: "--",
              current: "--",
              high: "--",
              low: "--",
              dealCount: "--",
              dealMoney: "--",
              rise: "--"
            };
          } else {
            const current = getNum(arr[3]) || arr[2];

            //涨跌幅: 当前价减去昨天收盘价除以昨天收盘价, [0/0.123]
            const rise = ((current - arr[2]) / arr[2]) * 100;
            const color = getStockColor(rise);
            const riseOutput = output(toFixed(rise));

            result[stockCode] = {
              color,
              valid: true,
              stockCode,
              name: arr[0],
              open: arr[1],
              yclose: arr[2],
              current: toFixed(current),
              high: arr[4],
              low: arr[5],
              dealCount: toFixed(arr[8] / 1000000) + "万",
              dealMoney: arr[9],
              rise: riseOutput,
              riseValid: riseOutput == "--"
            };
          }
        });
        resolve(result);
      }
    });
  });
}

////////////////////// utils //////////////////////

/**
 * 股票代码添加前缀
 * @param {Array} codes - 股票代码
 */
function addPrefix(codes) {
  if (!Array.isArray(codes)) {
    throw new Error("addPrefix: params must be Array");
  }
  const prefixs = { 0: "sz", 3: "sz", 6: "sh" };
  return codes.map(item => {
    const first = `${item}`.substring(0, 1);
    return prefixs[first] + item;
  });
}

function toFixed(num) {
  return Math.floor(+num * 100) / 100;
}

function getNum(str) {
  if (str === "0.00") {
    return 0;
  }
  return +str;
}

function getStockColor(num) {
  if (num > 0) {
    return "red";
  }
  if (num < 0) {
    return "green";
  }
  if (num === 0) {
    return "gray";
  }
}

function output(num) {
  if (num === 0) {
    return "--";
  }
  return num;
}

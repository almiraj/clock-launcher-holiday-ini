const fs = require('fs');
const iconv = require('iconv-lite');
const JapaneseHolidays = require('japanese-holidays');

const [fromYear, toYear] = process.argv.slice(2);
if (!fromYear || !toYear || !/\d{4}/.test(fromYear) || !/\d{4}/.test(toYear)) {
  console.log('USAGE: node app.js 2011 2099');
  process.exit(0);
}
if (Number(toYear) < Number(fromYear)) {
  console.log('1st-arg is larger than 2nd-arg');
  process.exit(0);
}

/**
 * @param {number} year
 * @return {object} { 1=[], 2=[], ..., 31=[] }
 */
const createMonthMap = function(year) {
  const monthMap = {};
  for (let m = 1; m <= 12; m++) {
    const date = new Date(year, m);
    date.setUTCDate(0);
    date.setUTCHours(0);
    const lastDate = date.getUTCDate();
    for (let d = 1; d <= lastDate; d++) {
      monthMap[d] = [];
    }
  }
  return monthMap;
};

const yearBlocks = [];
for (var year = toYear; year >= fromYear; year--) {
  var yearBlock = [];
  yearBlock.push('[' + year + ']');

  const monthMap = createMonthMap(year);
  JapaneseHolidays.getHolidaysOf(year).forEach(holiday => {
    monthMap[holiday.month].push(('0' + holiday.date).slice(-2));
  });

  for (var month in monthMap) {
    yearBlock.push(month + '=' + monthMap[month].join(','));
  }
  yearBlocks.push(yearBlock);
}

const contentHead = '[Format]\r\n月=休日1,休日1,休日3,…\r\n1日の場合でも01とし2桁にする\r\n\r\n';
const content = contentHead + yearBlocks.map(b => b.join('\r\n')).join('\r\n\r\n') + '\r\n';

const writer = fs.createWriteStream('./dest/holiday.ini');
writer.write(iconv.encode(content, "Shift_JIS"));
writer.end();

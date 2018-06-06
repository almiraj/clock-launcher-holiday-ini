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

const yearBlocks = [];
for (var year = toYear; year >= fromYear; year--) {
  var yearBlock = [];
  yearBlock.push('[' + year + ']');
  const holidays = JapaneseHolidays.getHolidaysOf(year);
  const monthMap = {};
  holidays.forEach(holiday => {
    monthMap[holiday.month] = (monthMap[holiday.month] || []);
    monthMap[holiday.month].push(('0' + holiday.date).slice(-2));
  });
  for (var month in monthMap) {
    yearBlock.push(month + '=' + monthMap[month].join(','));
  }
  yearBlocks.push(yearBlock);
}

console.log(yearBlocks.map(b => b.join('\r\n')).join('\r\n\r\n'));

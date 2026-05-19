function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}月${day}日 ${weekdays[d.getDay()]}`;
}

function isToday(isoDate) {
  return isoDate === todayISO();
}

module.exports = { todayISO, addDays, formatDateLabel, isToday };

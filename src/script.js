function updateLocalTime() {
  const now = new Date();
  const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('local-time').textContent = `Local Time: ${localTime}`;
}

function updateCityTime(timezone) {
  if (!timezone) {
    document.getElementById('city-time').textContent = '';
    return;
  }
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timezone };
  const cityTime = now.toLocaleTimeString([], options);
  document.getElementById('city-time').textContent = `Time in ${timezone.replace('_', ' ')}: ${cityTime}`;
}

document.getElementById('countries').addEventListener('change', function() {
  const timezone = this.value;
  updateCityTime(timezone);
});

setInterval(updateLocalTime, 1000);
setInterval(() => {
  const timezone = document.getElementById('countries').value;
  if (timezone) updateCityTime(timezone);
}, 1000);

updateLocalTime();

// HW-10 Task 1 — Timer (flatpickr + iziToast)

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;
let timerId = null;

// flatpickr options (з ТЗ)
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];

    // якщо не обрано або минуле — блокуємо старт і показуємо toast
    if (!date || date <= new Date()) {
      refs.startBtn.disabled = true;
      userSelectedDate = null;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 2500,
      });
      return;
    }

    userSelectedDate = date.getTime();
    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.input, options);

// старт відліку
refs.startBtn.addEventListener('click', () => {
  if (!userSelectedDate || timerId) return;

  refs.startBtn.disabled = true;
  refs.input.disabled = true;

  tick(); // показати перший раз одразу
  timerId = setInterval(tick, 1000);
});

function tick() {
  const msLeft = userSelectedDate - Date.now();

  if (msLeft <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateClock({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false; // можна вибрати наступну дату
    return;
  }

  updateClock(convertMs(msLeft));
}

function updateClock({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// 2-значний формат (для 1 цифри додає 0; якщо більше 2 — не обрізає)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// convertMs з ТЗ
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

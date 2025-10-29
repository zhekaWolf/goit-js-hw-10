// HW-10 Task 2 — Generator of promises (iziToast)

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const fd = new FormData(form);
  const delay = Number(fd.get('delay'));
  const state = fd.get('state'); // 'fulfilled' | 'rejected'

  if (!Number.isFinite(delay) || delay < 0 || !state) {
    iziToast.warning({
      message: 'Please provide delay and choose state',
      position: 'topRight',
    });
    return;
  }

  createPromise(state, delay)
    .then(d =>
      iziToast.success({
        message: `✅ Fulfilled promise in ${d}ms`,
        position: 'topRight',
      })
    )
    .catch(d =>
      iziToast.error({
        message: `❌ Rejected promise in ${d}ms`,
        position: 'topRight',
      })
    );

  form.reset();
});

function createPromise(state, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
}

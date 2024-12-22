const start = document.getElementById('start');
const reset = document.getElementById('reset');
const time = document.getElementById('timer');
const beepSound = document.getElementById('beep-sound'); // Подключаем звуковой элемент
const defuseSound = document.getElementById('defuse-sound');
const boomVid = document.getElementById('gif');
const boomSound = document.getElementById('boom');
const errorMessage = document.getElementById('error-message'); // Элемент для сообщения об ошибке
let countdown;
let timeRemaining;
let blinkInterval;

function startTimer() {
    const minutes = parseInt(document.getElementById('minutes').value || 0);
    const seconds = parseInt(document.getElementById('seconds').value || 0);

    // Проверка, есть ли хотя бы одна буква в любом из полей "Минуты" или "Секунды"
    if (/[a-zA-Z]/.test(document.getElementById('minutes').value) || /[a-zA-Z]/.test(document.getElementById('seconds').value)) {
        errorMessage.style.visibility = 'visible'; // Показываем сообщение об ошибке
        return; // Не запускаем таймер, если есть буквы
    } else {
        errorMessage.style.visibility = 'hidden'; // Скрываем сообщение об ошибке, если все в порядке
    }

    // Инициализация времени, учитываем введенные минуты и секунды
    timeRemaining = minutes * 60 + seconds;

    // Проверка на корректность ввода
    if (timeRemaining <= 0) {
        alert('Ты цифры с буквами попутал?');
        return;
    }

    boomVid.style.display = 'none'; // Скрываем GIF перед началом отсчета
    time.style.visibility = 'visible'; // Делаем таймер видимым
    time.style.color = 'red'; // Устанавливаем начальный цвет текста в красный
    updateDisplay(); // Обновляем отображение времени сразу после начала отсчета

    clearInterval(countdown);
    countdown = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            clearInterval(blinkInterval); // Останавливаем мигание
            time.textContent = '';
            boomSound.play(); // Воспроизводим звук взрыва
            boomVid.style.display = 'block'; // Показываем GIF
            return;
        }

        timeRemaining--;
        updateDisplay(); // Обновляем отображение времени при каждом тике

        // Если осталось 5 секунд или меньше, начинаем мигание
        if (timeRemaining <= 5) {
            startBlinking();
        } else {
            stopBlinking(); // Останавливаем мигание, если больше 5 секунд
            time.style.color = 'red'; // Устанавливаем цвет обратно в красный
        }

        // Воспроизводим звук на каждой секунде (по желанию)
        beepSound.play();
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    clearInterval(blinkInterval); // Останавливаем мигание при сбросе
    timeRemaining = 0;
    time.textContent = '00:00';
    time.style.visibility = 'hidden'; // Скрываем таймер
    
    defuseSound.play(); // Воспроизводим звук "обезвреживания"
}

function updateDisplay() {
    const hours = Math.floor(timeRemaining / 3600); // Часы
    const minutes = Math.floor((timeRemaining % 3600) / 60); // Минуты
    const seconds = timeRemaining % 60; // Секунды

    // Отображаем время в формате HH:MM:SS
    time.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startBlinking() {
    if (!blinkInterval) {
        blinkInterval = setInterval(() => {
            // Меняем цвет текста таймера каждую 0.5 секунды
            if (time.style.color === 'red') {
                time.style.color = 'white';
            } else {
                time.style.color = 'red';
            }
        }, 500);
    }
}

function stopBlinking() {
    clearInterval(blinkInterval); // Останавливаем мигание
    time.style.color = 'red'; // Устанавливаем цвет в красный по умолчанию
}

time.style.visibility = 'hidden'; // Скрываем таймер при загрузке страницы

boomVid.addEventListener('animationend', () => {
    boomVid.style.display = 'none'; // Скрыть GIF после окончания анимации
});

start.addEventListener('click', startTimer);
reset.addEventListener('click', resetTimer);

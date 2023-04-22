// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

let menuBtn = document.querySelector('.header__menu')

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active')
    })
}

// Модальные окна

if (document.getElementsByClassName("modal")) {

    var modals = document.getElementsByClassName("modal");
    var btns = document.getElementsByClassName("open-modal");
    var spans = document.getElementsByClassName("close");

    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var modalId = this.getAttribute("data-modal");
            var modal = document.getElementById(modalId);
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    }

    for (var i = 0; i < spans.length; i++) {
        spans[i].addEventListener("click", function () {
            var modal = this.parentElement.parentElement;
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });
    }

    window.addEventListener("click", function (event) {
        for (var i = 0; i < modals.length; i++) {
            if (event.target == modals[i]) {
                modals[i].style.display = "none";
                document.body.style.overflow = "auto";
            }
        }
    });

    window.addEventListener("keydown", function (event) {
        for (var i = 0; i < modals.length; i++) {
            if (event.key === "Escape" && modals[i].style.display === "block") {
                modals[i].style.display = "none";
                document.body.style.overflow = "auto";
            }
        }
    });

    for (var i = 0; i < modals.length; i++) {
        modals[i].addEventListener("animationend", function (event) {
            if (event.animationName === "modalopen" && this.style.display === "block") {
                this.style.animation = "";
            }
        });
    }

}

// Form


function setErrorFor(input, message) {
    input.style.borderColor = "red";
}

function setSuccessFor(input) {
    input.parentElement.style.borderColor = 'rgba(53, 110, 173, 0.4)'
}

function isValidEmail(email) {
    // Простейшая проверка на валидность email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#textarea');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    // Валидация имени, почты и сообщения
    if (nameValue === '') {
        setErrorFor(nameInput, 'Пожалуйста, введите ваше имя');
    } else {
        setSuccessFor(nameInput);
    }

    // Валидация почты
    if (emailValue === '') {
        setErrorFor(emailInput, 'Пожалуйста, введите вашу почту');
    } else if (!isValidEmail(emailValue)) {
        setErrorFor(emailInput, 'Пожалуйста, введите корректную почту');
    } else {
        setSuccessFor(emailInput);
    }

    // Валидация текста сообщения
    if (messageValue === '') {
        setErrorFor(messageInput, 'Пожалуйста, введите текст сообщения');
    } else {
        setSuccessFor(messageInput);
    }

    if (nameValue != '' && emailValue != '' && messageValue != '' && isValidEmail(emailValue)) {
        // Отправка сообщения в Телеграмм
        const chatId = '@monshero'; // замените на ID вашей чат-группы
        const botToken = '6111024453:AAHnDkXdv7lgRyQD4vzyUiKwgW7MFsuerHQ'; // замените на API-ключ вашего бота
        const message = `Новое сообщение от ${nameValue} (${emailValue}): ${messageValue}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    form.reset();
                    form.closest('.modal').style.display = "none";
                    document.body.style.overflow = "auto";
                    document.getElementById('modal-2').querySelector('.modal__title').textContent = 'Ваше сообщение успешно отправлено';
                    document.getElementById('modal-2').style.display = "block";
                    document.body.style.overflow = "hidden";
                } else {
                    document.getElementById('modal-2').querySelector('.modal__title').textContent = 'Ошибка отправки сообщения';
                    document.getElementById('modal-2').style.display = "block";
                    document.body.style.overflow = "hidden";
                }
            })
            .catch(error => {
                document.getElementById('modal-2').querySelector('.modal__title').textContent = 'Ошибка отправки сообщения' + error;
                document.getElementById('modal-2').style.display = "block";
                document.body.style.overflow = "hidden";
                console.error(error);
            });
    }

});
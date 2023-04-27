import modal from "./modal.js";

var token = '6111024453:AAHnDkXdv7lgRyQD4vzyUiKwgW7MFsuerHQ';
var chat_id = '@monshero';

document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
        if (targetElement.hasAttribute('data-required')) {
            formValidate.checkValidate(targetElement);
        }
    }
});

export let formValidate = {
    checkValidate(input) {
        let error = 0
        if (input.dataset.required === 'email') {
            if (this.emailTest(input)) {
                error++
                this.addError(input)
            } else {
                this.removeError(input)
            }
            return error
        }

        if (!input.value) {
            error++
            this.addError(input)
        } else {
            this.removeError(input)
        }
        return error
    },
    addError(requiredElement) {
        requiredElement.classList.add('error')
    },
    removeError(requiredElement) {
        requiredElement.classList.remove('error')
    },
    emailTest(requiredElement) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(requiredElement.value);
    }
}

export function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
        for (const form of forms) {
            form.addEventListener('submit', function (e) {
                e.preventDefault()
                const form = e.target;
                validateFormInputs(form)
            });
            form.addEventListener('reset', function (e) {
                const form = e.target;
                form.reset()
            });
        }
    }

    function validateFormInputs(form) {
        const requiredInputs = form.querySelectorAll('[data-required]');
        let errors = 0
        if (requiredInputs.length) {
            requiredInputs.forEach(requiredInput => {
                errors += formValidate.checkValidate(requiredInput)
            })
        }
        if (errors === 0) {
            holdSendButton(form)
            formFetch(form)
        }
    }

    async function formFetch(form) {
        var form_data = new FormData(form);
        setTextToElement(form, 'SENDING...')
        // отправка данных формы в Telegram Bot API
        fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        //   body: 'chat_id=' + chat_id + '&text=' + form_data
        body: 'chat_id=' + chat_id + '&text=' + JSON.stringify(Object.fromEntries(form_data.entries()))
        })
        .then(function(response) {
          if (response.ok) {
            // уведомление об успешной отправке
            form.reset()
            modal.toggleModal(form.closest('[data-modal]'))
            openPopup('Успешная отправка формы')
          } else {
            // уведомление о неуспешной отправке
            openPopup('Ошибка отправки формы!');
          }
        })
        .catch(function(error) {
          // уведомление об ошибке
          openPopup('Ошибка: ' + error.message);
        })
        .finally( () => {
            holdSendButton(form)
            setTextToElement(form, 'SUBMIT')
        })
    }

    function holdSendButton(form) {
        const sendButton = form.querySelector('button[type="submit"]')
        if (sendButton.hasAttribute('disabled')) {
            sendButton.disabled = false
        } else {
            sendButton.disabled = true
        }
    }

    function setTextToElement(form, text) {
        const sendButton = form.querySelector('button[type="submit"]')
        sendButton.innerHTML = text
    }

    function openPopup(message) {
        let infoModal = document.getElementById('modal-2')
        modal.activeModalClass = infoModal.id
        infoModal.querySelector('.modal__title').innerHTML = message
        modal.toggleModal(infoModal)
    }
}
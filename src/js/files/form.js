import modal from "./modal.js";

const token = '6111024453:AAHnDkXdv7lgRyQD4vzyUiKwgW7MFsuerHQ';
const chat_id = '@monshero';

document.body.addEventListener("focusout", handleFocusOut);

export const formValidate = {
    checkValidate(input) {
        let error = 0;
        if (input.dataset.required === 'email') {
            if (this.emailTest(input)) {
                error++;
                this.addError(input);
            } else {
                this.removeError(input);
            }
            return error;
        }

        if (!input.value) {
            error++;
            this.addError(input);
        } else {
            this.removeError(input);
        }
        return error;
    },
    addError(requiredElement) {
        requiredElement.classList.add('error');
    },
    removeError(requiredElement) {
        requiredElement.classList.remove('error');
    },
    emailTest(requiredElement) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(requiredElement.value);
    }
};

export function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
        for (const form of forms) {
            form.addEventListener('submit', handleSubmit);
            form.addEventListener('reset', handleReset);
        }
    }
}

function handleFocusOut(e) {
    const targetElement = e.target;
    if (targetElement.matches('input[data-required], textarea[data-required]')) {
        formValidate.checkValidate(targetElement);
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    validateFormInputs(form);
}

function handleReset(e) {
    const form = e.target;
    form.reset();
}

async function validateFormInputs(form) {
    const requiredInputs = form.querySelectorAll('[data-required]');
    let errors = 0;
    if (requiredInputs.length) {
        requiredInputs.forEach(requiredInput => {
            errors += formValidate.checkValidate(requiredInput);
        });
    }
    if (errors === 0) {
        holdSendButton(form);
        formFetch(form);
    }
}

async function formFetch(form) {
    const form_data = new FormData(form);
    setTextToElement(form, 'SENDING...');
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `chat_id=${chat_id}&text=${JSON.stringify(Object.fromEntries(form_data.entries()))}`
        });
        if (response.ok) {
            form.reset();
            modal.toggleModal(form.closest('[data-modal]'));
            openPopup('Успешная отправка формы');
        } else {
            openPopup('Ошибка отправки формы!');
        }
    } catch (error) {
        openPopup(`Ошибка: ${error.message}`);
    } finally {
        holdSendButton(form);
        setTextToElement(form, 'SUBMIT');
    }
}

function holdSendButton(form) {
    const sendButton = form.querySelector('button[type="submit"]');
    sendButton.disabled = !sendButton.disabled;
}

function setTextToElement(form, text) {
    const sendButton = form.querySelector('button[type="submit"]');
    sendButton.innerHTML = text;
}

function openPopup(message) {
    const infoModal = document.getElementById('modal-2');
    modal.activeModalClass = infoModal.id;
    infoModal.querySelector('.modal__title').innerHTML = message;
    modal.toggleModal(infoModal);
}

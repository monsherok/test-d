class Modal {
    constructor() {
        this.datas = {
            modalWindow: 'data-modal',
            modalBtn: 'data-modal-btn',
            modalClose: 'data-close'
        };
        this.classes = {
            open: 'modal__open',
            content: 'modal-content',
            lock: 'lock'
        };
        this.open = false;
        this.activeModalClass = '';
        this.init();
    }

    init() {
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    handleDocumentClick(e) {
        if (e.target.classList.contains('open-modal')) {
            this.modalOpen(e);
        } else if (e.target.closest(`.${this.classes.open}`)) {
            if (!e.target.closest(`.${this.classes.content}`) || e.target.hasAttribute(`${this.datas.modalClose}`)) {
                e.preventDefault();
                this.toggleModal(document.getElementById(`${this.activeModalClass}`));
            }
        }
    }

    modalOpen(e) {
        e.preventDefault();
        const modal = document.querySelector(`#${e.target.dataset.modalBtn}`);
        this.activeModalClass = e.target.dataset.modalBtn;
        if (modal) {
            this.toggleModal(modal);
        }
    }

    toggleModal(modal) {
        modal.classList.toggle('modal__open');
        document.documentElement.classList.toggle('lock');
    }
}

const modal = new Modal()

export default modal;

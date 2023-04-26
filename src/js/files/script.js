const menuBtn = document.querySelector('.header__menu')

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active')
    })
}

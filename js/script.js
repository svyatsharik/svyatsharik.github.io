function countdown() {

    function update() {
        const total = Date.parse('August 31 2027 23:59:59 GMT+03:00') - Date.parse(new Date());
        const timeLeft = {
            'days': Math.floor(total / (1000 * 60 * 60 * 24)),
            'hours': Math.floor((total / (1000 * 60 * 60)) % 24),
            'minutes': Math.floor((total / 1000 / 60) % 60),
            'seconds': Math.floor((total / 1000) % 60)
        };
        daysSpan.innerHTML = timeLeft.days;
        hoursSpan.innerHTML = timeLeft.hours;
        minutesSpan.innerHTML = timeLeft.minutes;
        secondsSpan.innerHTML = timeLeft.seconds;
        if (total <= 0) clearInterval(timeinterval);
    }

    const daysSpan = document.getElementById('clock').querySelector('.days');  
    const hoursSpan = document.getElementById('clock').querySelector('.hours');  
    const minutesSpan = document.getElementById('clock').querySelector('.minutes');  
    const secondsSpan = document.getElementById('clock').querySelector('.seconds');
    update();
    const timeinterval = setInterval(update, 1000);
}

function popap() {
    const popap = document.querySelector('.popap');
    const button = popap.querySelector('.button');
    const blackout = document.querySelector('.blackout');
    const feedbackButton = document.querySelector('.feedback-button');
    setTimeout(() => {
        // if (document.cookie == '') {
            popap.style.display = 'block';
            blackout.style.display = 'block';
            document.cookie = 'Попап открыт';
        // }
        
    }, 5000);
    
    button.addEventListener('click', function () {
        if (popap.style.display === 'block') {
            popap.style.display = 'none';
            blackout.style.display = 'none';
            feedbackButton.style.display = 'block';
        }
    });
}

function fixMenu() {
    const menu = document.querySelector('.menu');
    const header = document.querySelector('.header');
    const content = document.querySelector('.content');
    let k = 0;
    window.addEventListener('scroll', function() {
        if (menu.getBoundingClientRect().y <= 0 && k === 0) {
            menu.style.position = 'fixed';
            menu.style.top = 0;
            menu.style.left = 0;
            if (window.innerWidth >= 850) {
                content.style.marginTop = '75px';
            } else {
                content.style.marginTop = '50px';
            }
            k = 1;
        } else if (header.getBoundingClientRect().y + header.getBoundingClientRect().height >= 0 && k === 1) {
            menu.style.position = 'static';
            content.style.marginTop = '0px';
            k = 0;
        }
    });
}

function formValidation() {
    const showInputError = (formElement, inputElement, errorMessage) => {
        const errorElement = formElement.querySelector(`.${inputElement.id}-input-error`);
        errorElement.textContent = errorMessage;
      };
      
      const hideInputError = (formElement, inputElement) => {
        const errorElement = formElement.querySelector(`.${inputElement.id}-input-error`);
        errorElement.textContent = '';
      };
      
      const checkInputValidity = (formElement, inputElement) => {
        if (!inputElement.validity.valid) {
          showInputError(formElement, inputElement, inputElement.validationMessage);
        } else {
          hideInputError(formElement, inputElement);
        }
      };
      
      const setEventListeners = (formElement) => {
        const inputList = Array.from(formElement.querySelectorAll('.form__item'));
        const buttonElement = document.querySelector('.form__button[type="submit"]');
        toggleButtonState(inputList, buttonElement);
        inputList.forEach((inputElement) => {
          inputElement.addEventListener('input', function () {
            checkInputValidity(formElement, inputElement);
            toggleButtonState(inputList, buttonElement);
          });
        });
      };
      
      const enableValidation = () => {
        const formElement = document.querySelector('.form');
        formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        setEventListeners(formElement);
      };
    
      const hasInvalidInput = (inputList) => {
        return inputList.some((inputElement) => {
          return !inputElement.validity.valid;
        })
      };
    
      const toggleButtonState = (inputList, buttonElement) => {
        
        if (hasInvalidInput(inputList)) {
          buttonElement.disabled = true;
        } else {
          buttonElement.disabled = false;
        }
      }; 
    
      enableValidation();
}

popap();
countdown();
fixMenu();
formValidation();

const form = document.querySelector('.form');
const button = document.querySelector('.feedback-button');
const blackout = document.querySelector('.blackout');
const closeButton = document.querySelector('.form__button[type="button"]');
const submitButton = document.querySelector('.form__button[type="submit"]');
button.addEventListener('click', function () {
    form.style.zIndex = 2;
    form.style.opacity = 1;
    blackout.style.display = 'block';
});
closeButton.addEventListener('click', function () {
    form.style.zIndex = -1;
    form.style.opacity = 0;
    blackout.style.display = 'none';
});
submitButton.addEventListener('click', function () {
    fetch('/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.querySelector('.form__item_el_name').value,
            email: document.querySelector('.form__item_el_email').value,
            tel: document.querySelector('.form__item_el_tel').value,
            mainText: document.querySelector('.form__item_el_main-text').value
        })
    });
    location.reload();
});
  
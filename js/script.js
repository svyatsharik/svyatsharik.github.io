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
    setTimeout(() => {
        popap.style.display = 'block';
        blackout.style.display = 'block';
    }, 30000);
    
    button.addEventListener('click', function () {
        if (popap.style.display === 'block') {
            popap.style.display = 'none';
            blackout.style.display = 'none';
        }
    });
}

popap();
countdown();

const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
let k = 0;
window.addEventListener('scroll', function() {
    console.log(window);
    if (menu.getBoundingClientRect().y <= 0 && k === 0) {
        menu.style.position = 'fixed';
        menu.style.top = 0;
        menu.style.left = 0;
        k = 1;
    } else if (header.getBoundingClientRect().y + header.getBoundingClientRect().height >= 0 && k === 1) {
        menu.style.position = 'static';
        k = 0;
    }
  });

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

countdown();

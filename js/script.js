function countdown() {
    const timeinterval = setInterval(function () {
        const total = Date.parse('August 31 2027 23:59:59 GMT+03:00') - Date.parse(new Date());
        const timeLeft = {
            'days': Math.floor(total / (1000 * 60 * 60 * 24)),
            'hours': Math.floor((total / (1000 * 60 * 60)) % 24),
            'minutes': Math.floor((total / 1000 / 60) % 60),
            'seconds': Math.floor((total / 1000) % 60)
        };
        document.getElementById('clock').innerHTML = '<h3>До получения диплома Физтеха осталось:</h3>Дней: ' + timeLeft.days +
            '<br />Часов: '+ timeLeft.hours +
            '<br />Минут: ' + timeLeft.minutes +
            '<br />Секунд: ' + timeLeft.seconds;
        if (total <= 0) clearInterval(timeinterval);
    }, 1000);
}

countdown();

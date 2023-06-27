let n = 0;

const futureHours = document.getElementById('futureHours');

$('#after').click(() => {
    if (n > -3) {
        n = n - 1
        futureHours.style.transform = 'translateX(' + n * 48 + 'vw)';
    }
})

$('#before').click(() => {
    if (n < 0) {
        n = n + 1
        futureHours.style.transform = 'translateX(' + n * 48 + 'vw)';
    }
})

futureHours.style.transition = 'all 1.5s';
futureHours.style.transformStyle = 'ease-in-out';

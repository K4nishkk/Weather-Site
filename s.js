// scroll effect
let n = 0;
$('#d0').css('color', 'rgb(255, 255, 255)');
$('#d1').css('color', 'rgb(180, 180, 180)');
$('#d2').css('color', 'rgb(180, 180, 180)');
$('#d3').css('color', 'rgb(180, 180, 180)');

const futureHours = document.getElementById('futureHours');

$('#after').click(() => {
    if (n < 3) {
        n = n + 1
        futureHours.style.transform = 'translateX(-' + n * 48 + 'vw)';
        $('#d' + (n - 1)).css('color', 'rgb(180, 180, 180)');
        $('#d' + n).css('color', 'rgb(255, 255, 255)');
    }
})

$('#before').click(() => {
    if (n > 0) {
        n = n - 1;
        futureHours.style.transform = 'translateX(-' + n * 48 + 'vw)';
        $('#d' + (n + 1)).css('color', 'rgb(180, 180, 180)');
        $('#d' + n).css('color', 'rgb(255, 255, 255)');
    }
})

futureHours.style.transition = 'transform 1.5s';
futureHours.style.transformStyle = 'ease-in-out';

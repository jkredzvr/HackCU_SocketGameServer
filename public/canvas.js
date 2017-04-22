var elem = document.getElementById('myCanvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];
    coords = "";

// Add event listener for `click` events.
elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    console.log(x, y);

     socket.emit('COORD', [x,y]);

    coords = x + " " + y;
    elements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
            alert('clicked an element');
        }
    });

}, false);

//module.exports{coords}
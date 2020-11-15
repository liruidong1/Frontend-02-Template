function drag(dragEl, cb) {

    let baseX = 0, baseY = 0;

    dragEl.addEventListener('mousedown', event => {
        let startX = event.clientX, startY = event.clientY;

        let move = (event) => {
            cb(event.clientX, event.clientY);
            // dragEl.style.transform = `translate(${baseX + event.clientX - startX}px,${baseY + event.clientY - startY}px)`;
        }

        let up = (event) => {
            baseX = baseX + event.clientX - startX;
            baseY = baseY + event.clientY - startY;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);

    });
}

function float(containerEl, floatEl) {
    document.addEventListener('selectstart', event => event.preventDefault());

    let ranges = [];

    for(let i = 0; i < containerEl.childNodes[0].textContent.length; i++) {
        let range = document.createRange();
        range.setStart(containerEl.childNodes[0], i);
        range.setEnd(containerEl.childNodes[0], i);
        ranges.push(range);
    }

    floatEl.style.display = 'inline-block';

    drag(floatEl, (x, y)=>{
        let nearest = getNearest(x, y, ranges);
        nearest && nearest.insertNode(floatEl);
    });
}

function getNearest(x, y, ranges) {
    let min = Infinity;
    let nearest = null;

    for(let range of ranges) {
        let rect = range.getBoundingClientRect();
        let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2;

        if(distance < min) {
            min = distance;
            nearest = range;
        }
    }

    return nearest;
}
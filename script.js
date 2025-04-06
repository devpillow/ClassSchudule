const position = { x: 0, y: 0 }

interact('.draggable').draggable({
  listeners: {
    start (event) {
      console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
})

const gridContainer = document.getElementById('grid-container');

for (let i = 0; i < 84; i++) { // 7 วัน * 12 ชั่วโมง = 84 ช่อง
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridContainer.appendChild(gridItem);
}

// ทำให้กล่องใน initial box สามารถลากไปที่ตารางเรียน
const mposition = {x:0,y:0}
interact('.draggable-box')
    .draggable({
        onstart(event) {
            event.target.style.opacity = '0.5';
            mposition.x =event.pageX 
            mposition.y = event.pageY
        },
        onmove(event) {
           /* event.target.style.left = `${event.pageX - event.target.offsetWidth / 2}px`;
            event.target.style.top = `${event.pageY - event.target.offsetHeight / 2}px`;*/
            event.target.style.left = `${event.pageX-mposition.x}px`;
            event.target.style.top = `${event.pageY-mposition.y}px`;
        },
        onend(event) {
            event.target.style.opacity = '1';
        }
    });

// ทำให้ผู้ใช้ลากกล่องไปยังกริด
interact('.grid-item')
    .dropzone({
        accept: '.draggable-box',
        ondrop(event) {
            // เมื่อกล่องถูกลากไปวางในกริด
            const droppedBox = event.relatedTarget;
            const gridItem = event.target;

            // ทำให้กล่องถูกย้ายไปในกริด
            gridItem.appendChild(droppedBox);
            droppedBox.style.position = 'relative';
            droppedBox.style.left = '0';
            droppedBox.style.top = '0';
            droppedBox.style.cursor = 'default';
        }
    });
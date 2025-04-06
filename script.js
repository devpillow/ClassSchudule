const position = { x: 0, y: 0 }

//ทดลองทำ Dragable 
interact('.draggable').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target)
        },
        move(event) {
            position.x += event.dx
            position.y += event.dy

            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
        },
    }
})/////////


///สร้างตาราง
const gridContainer = document.getElementById('grid-container');

for (let i = 0; i < 84; i++) { // 7 วัน * 12 ชั่วโมง = 84 ช่อง
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridContainer.appendChild(gridItem);
}
//////////
/////////////// Grid//////////

let wasDropped = false;
// ทำให้ผู้ใช้ลากกล่องไปยังกริด
interact('.grid-item')
    .dropzone({
        accept: '.draggable-box',
        ondrop(event) {
            wasDropped = true; // ถ้ามีการ drop ลง grid → เปลี่ยนค่านี้เป็น true

            // เมื่อกล่องถูกลากไปวางในกริด
            const droppedBox = event.relatedTarget;
            const gridItem = event.target;

            // ทำให้กล่องถูกย้ายไปในกริด
            gridItem.appendChild(droppedBox);
            droppedBox.style.position = 'relative';
            droppedBox.style.left = '0';
            droppedBox.style.top = '0';
            droppedBox.style.cursor = 'default';
            createNewBox('abc');
        }
    });



// ทำให้กล่องใน initial box สามารถลากไปที่ตารางเรียน
const mposition = { x: 0, y: 0 }
// ฟังก์ชัน options สำหรับ draggable (แชร์ได้หลายกล่อง)
const draggableOptions = {
    onstart(event) {
        event.target.style.position = 'relative';

        if (event.target.closest('.free_area')) {
            const rect = event.target.getBoundingClientRect();
            mposition.x = event.clientX - rect.left;
            mposition.y = event.clientY - rect.top;
        } else {
            mposition.x = event.pageX
            mposition.y = event.pageY
        }
        event.target.style.opacity = '0.5';

    },
    onmove(event) {
        const target = event.target;
        /* event.target.style.left = `${event.pageX - event.target.offsetWidth / 2}px`;
         event.target.style.top = `${event.pageY - event.target.offsetHeight / 2}px`;*/

        console.log("กำหลังขยับ")
        if (event.target.closest('.free_area')) {


            // คำนวณพิกัดใหม่แบบสัมพันธ์กับ viewport
            const parentRect = target.offsetParent.getBoundingClientRect();
            const x = event.clientX - parentRect.left - mposition.x;
            const y = event.clientY - parentRect.top - mposition.y;

            target.style.position = 'absolute';
            target.style.left = `${x}px`;
            target.style.top = `${y}px`;
        }


        else {
            target.style.left = `${event.pageX - mposition.x}px`;
            target.style.top = `${event.pageY - mposition.y}px`;
        }
    },
    onend(event) {
        event.target.style.opacity = '1';
        if (!wasDropped) {

            // ถ้าไม่ได้ drop ลงช่อง → ลบกล่อง
            event.target.remove();
            console.log('ลบกล่อง เพราะไม่ได้วางลงช่องตาราง');
            createNewBox('abc');
        }
        if (wasDropped) { wasDropped = false; }
    }
}
/////
/////ฟังช้ั่นสร้างกล่อง (ถูกเรียกเมื่อ กล่องเดิมถูกลบ ตอนที่ลากไม่ตรงกับตาราง)
let boxCounter = 1; // ตัวนับ ID กล่องใหม่
function createNewBox(subjectName = `วิชา ${boxCounter}`) {
    const boxContainer = document.getElementById('box-container');
    const draggableBoxes = boxContainer.querySelectorAll('.draggable-box');

    if (!(draggableBoxes.length === 0)) {
        // ถ้ายังไม่มีกล่องวิชาใด ๆ ก็สร้างกล่องใหม่
        return
    }

    const newBox = document.createElement('div');
    newBox.classList.add('draggable-box');
    newBox.id = `box-${boxCounter}`;
    newBox.textContent = subjectName;

    boxContainer.appendChild(newBox);

    // ทำให้ลากได้
    interact(newBox).draggable(draggableOptions);

    boxCounter++; // เพิ่มเลขกล่อง
}



//ทำให้ class Draggable-box ทุกตัวที่มีอยู่เดิม มีฟังชั่นของ draggableOptions
interact('.draggable-box')
    .draggable(draggableOptions);




////////ที่วางกล่องชั่วคราว
//const free_area_div = document.getElementById('free_area');
interact('.free_area').dropzone({
  accept: '.draggable-box',

  ondrop(event) {
    wasDropped = true;

    const box = event.relatedTarget;
    const freeArea = event.target;

    // ย้ายกล่องไปไว้ใน free_area
    freeArea.appendChild(box);

    // ทำให้กล่องอยู่อิสระใน free_area
    box.style.position = 'absolute';

    // คำนวณตำแหน่งจากตำแหน่งเมาส์
    const rect = freeArea.getBoundingClientRect();
    const mouseX = event.dragEvent.client.x - rect.left;
    const mouseY = event.dragEvent.client.y - rect.top;

    box.style.left = `${mouseX - box.offsetWidth / 2}px`;
    box.style.top = `${mouseY - box.offsetHeight / 2}px`;

     createNewBox("def");
  }
});
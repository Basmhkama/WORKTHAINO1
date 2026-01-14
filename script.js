// =====================
// ข้อมูลสถานที่ท่องเที่ยว
// =====================
const touristPlaces = [
    {
        id: 1,
        name: 'วัดพระแก้ว',
        type: 'วัดวาอาราม',
        zone: 'วัด',
        cost: 500,
        time: 2,
        lat: 13.7515,
        lng: 100.4927,
        description: 'วัดประจำพระบรมมหาราชวัง'
    },
    {
        id: 2,
        name: 'วัดอรุณราชวราราม',
        type: 'วัดวาอาราม',
        zone: 'วัด',
        cost: 100,
        time: 1.5,
        lat: 13.7437,
        lng: 100.4889,
        description: 'วัดริมแม่น้ำเจ้าพระยา'
    },
    {
        id: 3,
        name: 'เจ้าพระยาริเวอร์ครูซ',
        type: 'กิจกรรม',
        zone: 'ริมแม่น้ำ',
        cost: 800,
        time: 2,
        lat: 13.7059,
        lng: 100.4927,
        description: 'นั่งเรือชมวิวริมแม่น้ำเจ้าพระยายามค่ำคืน'
    },
    {
        id: 4,
        name: 'ตลาดน้ำดำเนินสะดวก',
        type: 'ตลาด',
        zone: 'ตลาด',
        cost: 300,
        time: 3,
        lat: 13.5187,
        lng: 99.9596,
        description: 'ตลาดน้ำที่มีชื่อเสียง ชิมอาหารและซื้อของฝาก'
    },
    {
        id: 5,
        name: 'เยาวราช',
        type: 'ย่านอาหาร',
        zone: 'ตลาด',
        cost: 400,
        time: 2,
        lat: 13.7400,
        lng: 100.5090,
        description: 'ย่านไชน่าทาวน์ อาหารอร่อยมากมาย'
    },
    {
        id: 6,
        name: 'ตลาดนัดจตุจักร',
        type: 'ตลาด',
        zone: 'ตลาด',
        cost: 200,
        time: 4,
        lat: 13.7995,
        lng: 100.5492,
        description: 'ตลาดนัดที่ใหญ่ที่สุดในประเทศไทย'
    },
    {
        id: 7,
        name: 'สยามสแควร์',
        type: 'ช้อปปิ้ง',
        zone: 'เมือง',
        cost: 500,
        time: 3,
        lat: 13.7456,
        lng: 100.5347,
        description: 'ศูนย์กลางการช้อปปิ้งและบันเทิง'
    },
    {
        id: 8,
        name: 'พระบรมมหาราชวัง',
        type: 'สถานที่ประวัติศาสตร์',
        zone: 'วัด',
        cost: 500,
        time: 2.5,
        lat: 13.7500,
        lng: 100.4913,
        description: 'พระราชวังหลวงที่สวยงามและมีความสำคัญทางประวัติศาสตร์'
    }
];

// =====================
// ตัวแปรระบบ
// =====================
let calculatedCost = null;
let tripPlan = null;

// =====================
// แสดงสถานที่ท่องเที่ยว
// =====================
function displayPlaces() {
    const placesGrid = document.getElementById('places-grid');
    placesGrid.innerHTML = touristPlaces.map(place => `
        <div class="place-card">
            <h3>${place.name}</h3>
            <div class="place-info">ประเภท: ${place.type}</div>
            <div class="place-info">โซน: ${place.zone}</div>
            <div class="place-info">ค่าใช้จ่าย: ฿${place.cost.toLocaleString()}</div>
            <div class="place-info">เวลา: ${place.time} ชั่วโมง</div>
            <p class="place-description">${place.description}</p>
            <button onclick="showMap(${place.lat}, ${place.lng})">📍 ดูแผนที่</button>
        </div>
    `).join('');
}

// =====================
// แสดง Google Map
// =====================
function showMap(lat, lng) {
    document.getElementById('google-map').src =
        `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

// =====================
// เปลี่ยนหน้า
// =====================
function changePage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

// =====================
// คำนวณค่าใช้จ่าย
// =====================
function calculateCost() {
    const budget = +document.getElementById('budget').value || 0;
    const days = +document.getElementById('days').value || 1;
    const transport = +document.getElementById('transport').value || 0;

    const food = days * 500;
    const accommodation = days * 1000;
    const activities = Math.max(0, budget - transport - food - accommodation);

    calculatedCost = {
        budget,
        days,
        transport,
        food,
        accommodation,
        activities,
        total: transport + food + accommodation
    };
}

// =====================
// คำนวณ + แสดงสรุป
// =====================
function calculateAndShowSummary() {
    calculateCost();
    displaySummary();
    changePage('summary');
}

// =====================
// วางแผนทริป
// =====================
function planTrip() {
    const budget = +document.getElementById('planner-budget').value || 0;
    const days = +document.getElementById('planner-days').value || 1;
    const transport = +document.getElementById('planner-transport').value || 0;

    document.getElementById('budget').value = budget;
    document.getElementById('days').value = days;
    document.getElementById('transport').value = transport;

    calculateCost();

    let cost = 0, time = 0;
    const maxTime = days * 8;
    const places = [];

    touristPlaces.forEach(place => {
        if (cost + place.cost <= calculatedCost.activities &&
            time + place.time <= maxTime) {
            places.push(place);
            cost += place.cost;
            time += place.time;
        }
    });

    tripPlan = { places, totalCost: cost, totalTime: time, days };
    displaySummary();
    changePage('summary');
}

// =====================
// แสดงสรุป
// =====================
function displaySummary() {
    const el = document.getElementById('summary-content');
    let html = '';

    if (calculatedCost) {
        html += `
        <div class="summary-card">
            <h3>รายละเอียดค่าใช้จ่าย</h3>
            <p>งบทั้งหมด: ฿${calculatedCost.budget.toLocaleString()}</p>
            <p>ค่าเดินทาง: ฿${calculatedCost.transport.toLocaleString()}</p>
            <p>ค่าอาหาร: ฿${calculatedCost.food.toLocaleString()}</p>
            <p>ค่าที่พัก: ฿${calculatedCost.accommodation.toLocaleString()}</p>
            <p class="blue">งบกิจกรรม: ฿${calculatedCost.activities.toLocaleString()}</p>
        </div>`;
    }

    if (tripPlan) {
        html += `<div class="summary-card"><h3>แผนทริป ${tripPlan.days} วัน</h3>`;
        tripPlan.places.length
            ? tripPlan.places.forEach((p, i) => {
                html += `<p>${i + 1}. ${p.name} • ฿${p.cost}</p>`;
            })
            : html += `<p>งบไม่เพียงพอ</p>`;
        html += `</div>`;
    }

    el.innerHTML = html || '<div class="empty-summary">ยังไม่มีข้อมูล</div>';
}

// =====================
// Feedback
// =====================
function submitFeedback() {
    const feedback = document.getElementById('feedback').value.trim();
    if (!feedback) return alert('กรุณากรอกข้อเสนอแนะ');
    alert('ขอบคุณสำหรับข้อเสนอแนะ ❤️');
    document.getElementById('feedback').value = '';
}

// =====================
// เริ่มต้นระบบ
// =====================
document.addEventListener('DOMContentLoaded', () => {
    displayPlaces();
    changePage('home');
});

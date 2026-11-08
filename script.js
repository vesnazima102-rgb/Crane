// Конструктор пожеланий
const parts1 = [
    "Пусть сегодня", "Пусть эта неделя", "Пусть каждый момент", 
    "Желаю, чтобы этот день", "Пусть судьба", "Пусть у тебя", 
    "Пусть ангел-хранитель", "Пусть вселенная", "Пусть твое сердце"
];

const parts2 = [
    " подарит тебе", " наполнит твою жизнь", " откроет для тебя", 
    " принесет в твой дом", " окружит тебя", " подарит долгожданное", 
    " подарит волшебную", " подарит удивительную", " создаст для тебя"
];

const parts3 = [
    "море тепла и улыбок! ✨", "невероятное вдохновение и легкость. 🌸", 
    "приятное и теплое чудо. 🕊️", "уют, гармонию и радость. ☕", 
    "мощный заряд позитивной энергии! ☀️", "повод для искренней улыбки. 💛", 
    "самые светлые и добрые моменты. 💌", "гармонию в душе и покой. 🌿"
];

let generatedCount = 0;

// Встроенная генерация мягкой позитивной музыки (Web Audio API)
let audioCtx = null;
let isPlaying = false;
let musicInterval = null;

const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Ноты C, D, E, G, A, C (пентатоника)

function playTone(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
}

function startMusic() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    isPlaying = true;
    document.getElementById('musicToggleBtn').classList.add('playing');
    
    // Играет мягкую мелодию каждые 800 мс
    musicInterval = setInterval(() => {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        playTone(randomNote);
    }, 800);
}

function stopMusic() {
    isPlaying = false;
    document.getElementById('musicToggleBtn').classList.remove('playing');
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

document.getElementById('musicToggleBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
});

// Three.js 3D-Сцена
const canvas = document.getElementById('canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 11);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0xffd1dc, 1, 15);
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// Создаем геометрию журавлика из бумаги
const craneGroup = new THREE.Group();

const paperMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    emissive: 0xfff0f5,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide,
    flatShading: true,
    shininess: 30
});

// Тело
const bodyGeo = new THREE.BufferGeometry();
const bodyVertices = new Float32Array([
    0, 0, 1.2,   -0.5, 0.5, 0,  0, -0.6, 0,
    0, 0, 1.2,    0, -0.6, 0,   0.5, 0.5, 0,
    0, 0, -1.2,   0, -0.6, 0,  -0.5, 0.5, 0,
    0, 0, -1.2,   0.5, 0.5, 0,   0, -0.6, 0
]);
bodyGeo.setAttribute('position', new THREE.BufferAttribute(bodyVertices, 3));
bodyGeo.computeVertexNormals();
const bodyMesh = new THREE.Mesh(bodyGeo, paperMaterial);
craneGroup.add(bodyMesh);

// Шея и Голова (с загнутым вниз клювиком)
const neckGeo = new THREE.BufferGeometry();
const neckVertices = new Float32Array([
    0, 0, 0.9,   0.15, 0.3, 0.5,  -0.15, 0.3, 0.5,
    0, 0, 0.9,   0, 1.8, 1.3,   0.15, 0.3, 0.5,
    0, 0, 0.9,  -0.15, 0.3, 0.5,   0, 1.8, 1.3,
    0, 1.8, 1.3,   0, 2.0, 1.1,   0, 1.5, 0.7,
    0, 1.8, 1.3,   0, 1.5, 0.7,   0, 2.0, 1.1
]);
neckGeo.setAttribute('position', new THREE.BufferAttribute(neckVertices, 3));
neckGeo.computeVertexNormals();
const neckMesh = new THREE.Mesh(neckGeo, paperMaterial);
craneGroup.add(neckMesh);

// Хвост
const tailGeo = new THREE.BufferGeometry();
const tailVertices = new Float32Array([
    0, 0, -0.9,  0.2, 0.3, -0.5,   0, 1.6, -1.3,
    0, 0, -0.9,  0, 1.6, -1.3,   -0.2, 0.3, -0.5
]);
tailGeo.setAttribute('position', new THREE.BufferAttribute(tailVertices, 3));
tailGeo.computeVertexNormals();
const tailMesh = new THREE.Mesh(tailGeo, paperMaterial);
craneGroup.add(tailMesh);

// Левое крыло
const leftWingGroup = new THREE.Group();
leftWingGroup.position.set(-0.35, 0.2, 0);
const leftWingGeo = new THREE.BufferGeometry();
const leftWingVerts = new Float32Array([
    0, 0, 0.8,   -3.2, 1.2, 0,   0, 0, -0.8,
    0, 0, 0.8,   -1.8, -0.5, 0,  -3.2, 1.2, 0
]);
leftWingGeo.setAttribute('position', new THREE.BufferAttribute(leftWingVerts, 3));
leftWingGeo.computeVertexNormals();
const leftWingMesh = new THREE.Mesh(leftWingGeo, paperMaterial);
leftWingGroup.add(leftWingMesh);
craneGroup.add(leftWingGroup);

// Правое крыло
const rightWingGroup = new THREE.Group();
rightWingGroup.position.set(0.35, 0.2, 0);
const rightWingGeo = new THREE.BufferGeometry();
const rightWingVerts = new Float32Array([
    0, 0, 0.8,   0, 0, -0.8,    3.2, 1.2, 0,
    0, 0, 0.8,   3.2, 1.2, 0,   1.8, -0.5, 0
]);
rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightWingVerts, 3));
rightWingGeo.computeVertexNormals();
const rightWingMesh = new THREE.Mesh(rightWingGeo, paperMaterial);
rightWingGroup.add(rightWingMesh);
craneGroup.add(rightWingGroup);

scene.add(craneGroup);

// Золотистая пыльца
const particleCount = 70;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 18;
    particlePos[i + 1] = (Math.random() - 0.5) * 14;
    particlePos[i + 2] = (Math.random() - 0.5) * 10;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
const particleMat = new THREE.PointsMaterial({
    color: 0xfff6bd,
    size: 0.12,
    transparent: true,
    opacity: 0.8
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Управление вращением
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotationX = 0.2;
let targetRotationY = -0.4;
let flapJump = 0;

window.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    targetRotationY += (e.clientX - previousMousePosition.x) * 0.008;
    targetRotationX += (e.clientY - previousMousePosition.y) * 0.008;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => isDragging = false);

// Клик по журавлику
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(craneGroup.children, true);

    if (intersects.length > 0) {
        generateNewWish();
        flapJump = 1.2;
    }
});

// Генерация пожелания
function generateNewWish() {
    generatedCount++;
    
    const p1 = parts1[Math.floor(Math.random() * parts1.length)];
    const p2 = parts2[Math.floor(Math.random() * parts2.length)];
    const p3 = parts3[Math.floor(Math.random() * parts3.length)];

    const wishCard = document.getElementById('wishCard');
    const wishText = document.getElementById('wishText');
    const wishStep = document.getElementById('wishStep');

    wishCard.classList.add('bounce');
    setTimeout(() => wishCard.classList.remove('bounce'), 400);

    wishStep.innerText = `Пожелание №${generatedCount}`;
    wishText.innerText = `${p1}${p2} ${p3}`;
}

document.getElementById('nextWishBtn').addEventListener('click', generateNewWish);

// Анимация сцены
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    const wingAngle = Math.sin(time * 4.5) * 0.4 + (flapJump * 0.3);
    leftWingGroup.rotation.z = wingAngle;
    rightWingGroup.rotation.z = -wingAngle;

    if (flapJump > 0) flapJump -= 0.03;
    craneGroup.position.y = Math.sin(time * 2) * 0.25 + flapJump;
    
    craneGroup.rotation.x += (targetRotationX - craneGroup.rotation.x) * 0.05;
    craneGroup.rotation.y += (targetRotationY - craneGroup.rotation.y) * 0.05;

    particles.rotation.y = time * 0.04;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
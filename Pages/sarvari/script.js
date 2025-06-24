// Switch tab contents
function showTabContent(id) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(id).classList.add('active-tab');
}

function showTabContent(id) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(id).classList.add('active-tab');
}

// Generic Photo Gallery Script with Swipe Animation, Dots, and Image Caching
document.addEventListener("DOMContentLoaded", function(){
    // Global cache for images that have already loaded
    let loadedImagesCache = {};

    document.querySelectorAll('.gallery').forEach(function(gallery){
        let images;
        try {
            images = JSON.parse(gallery.getAttribute('data-images'));
        } catch (e) {
            console.error("Error parsing images data:", e);
            return;
        }
        let index = 0;
        const imgEl = gallery.querySelector('img');
        const nextBtn = gallery.querySelector('.next');
        const prevBtn = gallery.querySelector('.prev');
        const spinner = gallery.querySelector('.spinner');
        const dotsContainer = gallery.querySelector('.dots');

        // Create navigation dots for each image in the gallery.
        images.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', function(){
                if (idx !== index) {
                    transitionToImage(idx, idx > index ? "next" : "prev");
                }
            });
            dotsContainer.appendChild(dot);
        });

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }

        function preloadNext() {
            const nextIndex = (index + 1) % images.length;
            const preloadedImg = new Image();
            preloadedImg.src = images[nextIndex];
        }

        function transitionToImage(newIndex, direction) {
            const newImageURL = images[newIndex];
            // Only show spinner if this image has not been loaded before.
            if (!loadedImagesCache[newImageURL]) {
                spinner.style.display = "block";
            } else {
                spinner.style.display = "none";
            }
            // Slide out the current image.
            if (direction === "next") {
                imgEl.style.transition = "transform 0.5s ease";
                imgEl.style.transform = "translateX(-100%)";
            } else {
                imgEl.style.transition = "transform 0.5s ease";
                imgEl.style.transform = "translateX(100%)";
            }
            setTimeout(() => {
                // Update index and image source.
                index = newIndex;
                imgEl.src = newImageURL;
                updateDots();
                // If image is cached, hide spinner immediately.
                if (loadedImagesCache[newImageURL]) {
                    spinner.style.display = "none";
                }
                // Prepare the image off-screen for the slide-in effect.
                if (direction === "next") {
                    imgEl.style.transition = "none";
                    imgEl.style.transform = "translateX(100%)";
                } else {
                    imgEl.style.transition = "none";
                    imgEl.style.transform = "translateX(-100%)";
                }
                // Force reflow.
                void imgEl.offsetWidth;
                // Slide the image into view.
                imgEl.style.transition = "transform 0.5s ease";
                imgEl.style.transform = "translateX(0)";
                preloadNext();
            }, 500);
        }

        nextBtn.addEventListener("click", function(){
            const newIndex = (index + 1) % images.length;
            transitionToImage(newIndex, "next");
        });
        prevBtn.addEventListener("click", function(){
            const newIndex = (index - 1 + images.length) % images.length;
            transitionToImage(newIndex, "prev");
        });

        // When the image loads, mark it as cached.
        imgEl.addEventListener("load", function(){
            loadedImagesCache[imgEl.src] = true;
            spinner.style.display = "none";
        });

        // Initialize gallery.
        imgEl.src = images[index];
        preloadNext();
    });
    
    // For non-gallery images, hide spinner when loaded.
    document.querySelectorAll('.img-container img').forEach(function(image){
        image.addEventListener("load", function(){
            let sp = image.parentElement.querySelector('.spinner');
            if(sp) sp.style.display = "none";
        });
    });
});

// Button Click Animations
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function () {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 100);
    });
});
document.querySelectorAll('.icon-button').forEach(button => {
    button.addEventListener('click', function () {
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 100);
    });
});

// Quran page logic
let currentPage = parseInt(document.getElementById("val-var4")?.textContent.trim() || "1", 10);
const totalPages = 604;

function updateContent() {
    const valElement = document.getElementById("val-var4");
    const valText = valElement ? valElement.textContent.trim() : "0";
    const parsedPage = parseInt(valText, 10);

    if (isNaN(parsedPage)) {
        alert('مقدار صفحه معتبر نیست!');
        return;
    }

    let currentPage = parsedPage;

    if (currentPage >= totalPages) {
        alert('به پایان قرآن رسیدید!');
        return;
    }

    currentPage++;

    document.getElementById("quranImage").src =
        `https://www.yadeo.ir/media/quran_pages/QuranDaneshAmouzi-${String(currentPage).padStart(3, '0')}.jpg`;

    const audio = document.getElementById("quranAudio");
    audio.src =
        `https://www.yadeo.ir/media/quran_sound/Page${String(currentPage).padStart(3, '0')}.mp3`;
    audio.load();

    valElement.textContent = currentPage;
}

// profile page logic
const images = [
    "https://raw.githubusercontent.com/sarvari1378/MemorialQR_Codes/main/Imagees/Taghizade/Profile2.jpg"
];

const profileImg = document.getElementById('profile-gallery-img');
const modal = document.getElementById('profile-gallery-modal');
const modalImg = document.getElementById('profile-gallery-modal-img');
const closeBtn = document.getElementById('profile-gallery-closeBtn');
const prevBtn = document.getElementById('profile-gallery-prevBtn');
const nextBtn = document.getElementById('profile-gallery-nextBtn');

let currentIndex = 0;

if (profileImg) {
    profileImg.addEventListener('click', () => {
        currentIndex = 0;
        showImage(currentIndex);
        modal.classList.add('active');
    });
}

function showImage(index) {
    modalImg.src = images[index];
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// variables worker logic
const baseUrl = 'https://variable.cobaka6220.workers.dev';
const buffers = {};
const lastSent = {};

async function getValue(varName) {
    try {
        const res = await fetch(`${baseUrl}/${varName}/get`);
        const data = await res.json();
        return parseInt(data.value) || 0;
    } catch (e) {
        console.error(e);
        return 0;
    }
}

async function flushBuffer(varName) {
    if (!buffers[varName] || buffers[varName] === 0 || lastSent[varName]) return;

    const clicks = buffers[varName];
    buffers[varName] = 0;
    lastSent[varName] = true;

    try {
        const current = await getValue(varName);
        const newVal = current + clicks;

        const res = await fetch(`${baseUrl}/${varName}/post/${newVal}`, {
            method: 'POST',
        });

        if (res.ok) {
            const data = await res.json();
            document.getElementById('val-' + varName).textContent = data.value;
        } else {
            throw new Error('POST failed');
        }
    } catch (e) {
        console.error('ارسال ناموفق:', e);
        buffers[varName] = clicks;
    } finally {
        lastSent[varName] = false;
    }
}

document.querySelectorAll('button[data-var]').forEach(btn => {
    const varName = btn.getAttribute('data-var');
    const valSpan = document.getElementById('val-' + varName);

    if (valSpan) {
        getValue(varName).then(val => valSpan.textContent = val);
        buffers[varName] = 0;
        btn.addEventListener('click', () => {
            buffers[varName]++;
            const current = parseInt(valSpan.textContent) || 0;
            valSpan.textContent = current + 1;
        });
        setInterval(() => flushBuffer(varName), 1000);
    }
});

// Quran page logic
document.addEventListener("DOMContentLoaded", () => {
    const indexElement = document.getElementById("val-var4");
    const img = document.getElementById("quranImage");
    const audio = document.getElementById("quranAudio");
    const audioSource = audio ? audio.querySelector("source") : null;

    if (!indexElement || !img || !audioSource) return;

    const loadMedia = () => {
        let content = indexElement.textContent.trim();
        if (content === "درحال بارگذاری ...") return;

        let pageIndex = parseInt(content);
        if (isNaN(pageIndex) || pageIndex < 1 || pageIndex > 604) {
            pageIndex = 1;
        }

        const padded = String(pageIndex).padStart(3, '0');
        img.src = `https://www.yadeo.ir/media/quran_pages/QuranDaneshAmouzi-${padded}.jpg`;
        audioSource.src = `https://www.yadeo.ir/media/quran_sound/Page${padded}.mp3`;
        audio.load();
    };

    if (indexElement.textContent.trim() !== "درحال بارگذاری ...") {
        loadMedia();
    } else {
        const observer = new MutationObserver(() => {
            if (indexElement.textContent.trim() !== "درحال بارگذاری ...") {
                observer.disconnect();
                loadMedia();
            }
        });
        observer.observe(indexElement, { childList: true });
    }
});

// Aparat video logic
const aparatVideos = {
    "22563382336": "0a67L",
    "25306786704": "ttky579",
    "77790668734": "udjsl77",
    "37495468652": "r88myrr",
    "15310558190": "w08bmg5",
    "75431856343": "6Mnwc",
    "71339878342": "Ko7W4"
};

const select = document.getElementById('prayerSelect');

if (select) {
    select.addEventListener('change', function() {
        const value = this.value;

        Object.keys(aparatVideos).forEach(id => {
            const div = document.getElementById(id);
            if (div) {
                div.style.display = 'none';
                div.innerHTML = '';
            }
        });

        if (value && aparatVideos[value]) {
            const container = document.getElementById(value);
            if (container) {
                container.style.display = 'block';
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://www.aparat.com/embed/${aparatVideos[value]}?data[rnddiv]=${value}&data[responsive]=yes`;
                container.appendChild(script);
            }
        }
    });
}

// Fullscreen image click logic
document.addEventListener('click', function handleClick() {
    const mainImage = document.getElementById('main-image');
    const bgImage = document.getElementById('bg-image');

    if (mainImage && bgImage) {
        mainImage.classList.add('hide-main');
        setTimeout(() => {
            bgImage.classList.add('hide-bg');
        }, 150);

        setTimeout(() => {
            mainImage.style.display = 'none';
            bgImage.style.display = 'none';
        }, 1200);
    }

    document.removeEventListener('click', handleClick);
});

// Notes Module logic
const NOTES_BASE_URL = 'https://notes.cobaka6220.workers.dev';

function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('userId', userId);
    }
    return userId;
}

const userId = getUserId();

async function saveNote() {
    const contentEl = document.getElementById('content');
    const content = contentEl.value.trim();
    if (!content) {
        alert('دل‌نوشته نمی‌تواند خالی باشد');
        return;
    }
    try {
        const res = await fetch(NOTES_BASE_URL + '/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, userId }),
        });
        if (!res.ok) {
            alert('خطا در ذخیره دل‌نوشته: ' + res.status);
            return;
        }
        contentEl.value = '';
        await loadNotes();
    } catch (e) {
        alert('خطا در ذخیره دل‌نوشته: ' + e.message);
    }
}

async function loadNotes() {
    const notesDiv = document.getElementById('notes');
    if (!notesDiv) return;
    notesDiv.innerHTML = 'در حال بارگذاری دل‌نوشته‌ها...';
    try {
        const res = await fetch(NOTES_BASE_URL + '/list');
        if (!res.ok) throw new Error('خطا در دریافت لیست');
        const notes = await res.json();

        if (notes.length === 0) {
            notesDiv.innerHTML = 'هیچ دل‌نوشته‌ای وجود ندارد.';
            return;
        }

        notesDiv.innerHTML = '';
        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note';
            div.innerHTML = `
                <div>${note.content.replace(/\n/g, '<br>')}</div>
                <small>زمان ذخیره: ${new Date(note.timestamp).toLocaleString('fa-IR')}</small>
            `;
            if (note.userId === userId) {
                const btn = document.createElement('button');
                btn.className = 'delete-btn';
                btn.textContent = 'حذف';
                btn.onclick = () => deleteNote(note.timestamp);
                div.appendChild(btn);
            }
            notesDiv.appendChild(div);
        });
    } catch (e) {
        notesDiv.innerHTML = 'خطا در بارگذاری دل‌نوشته‌ها: ' + e.message;
    }
}

async function deleteNote(key) {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این دل‌نوشته را حذف کنید؟')) return;
    try {
        const res = await fetch(NOTES_BASE_URL + '/delete?key=' + encodeURIComponent(key), {
            method: 'DELETE',
            headers: { 'x-user-id': userId },
        });
        if (!res.ok) {
            alert('خطا در حذف دل‌نوشته: ' + res.status);
            return;
        }
        await loadNotes();
    } catch (e) {
        alert('خطا در حذف دل‌نوشته: ' + e.message);
    }
}

const saveBtn = document.getElementById('NotessaveBtn');
if (saveBtn) {
    saveBtn.addEventListener('click', saveNote);
    loadNotes();
}

// Notes Module text height logic
const textarea = document.getElementById('content');

function autoResize() {
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}

if (textarea) {
    textarea.addEventListener('input', autoResize);
    window.addEventListener('load', autoResize);
}

// Audio footer and visualizer logic
const audio = document.getElementById("myAudio");
const footer = document.getElementById("myAudioFooter");
const controlBtn = document.getElementById("myControlBtn");
const visualizer = document.getElementById("myVisualizer");
const playIcon = document.getElementById("myPlayIcon");
const pauseIcon = document.getElementById("myPauseIcon");

if (audio && footer && controlBtn && visualizer && playIcon && pauseIcon) {
    const barCount = 60;
    const bars = [];

    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement("div");
        bar.className = "myBar";
        visualizer.appendChild(bar);
        bars.push(bar);
    }

    let audioContext, analyser, source, dataArray;

    function setupAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 128;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
    }

    function renderVisualizer() {
        requestAnimationFrame(renderVisualizer);
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bars.length; i++) {
            const value = dataArray[i];
            const height = (value / 255) * 40;
            bars[i].style.height = `${height}px`;
        }
    }

    let started = false;

    document.addEventListener("click", () => {
        if (!started) {
            setupAudioContext();
            audio.play();
            renderVisualizer();
            footer.classList.add("visible");
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
            started = true;
        }
    }, { once: true }); // Ensure this runs only once

    controlBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the document click listener from firing again
        if (audio.paused) {
            audio.play();
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
            footer.classList.add("visible");
        } else {
            audio.pause();
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
        }
    });

    audio.addEventListener("ended", () => {
        footer.classList.remove("visible");
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
    });
}
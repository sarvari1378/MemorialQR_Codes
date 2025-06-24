// ===================================================================
//          کد اصلاح شده برای مدیریت گالری
// ===================================================================

// --- تابع اصلی برای ساخت و راه‌اندازی مجدد گالری ---
// این تابع بدون تغییر باقی می‌ماند چون منطق درستی دارد
function initializeGallery(galleryElement) {
    if (!galleryElement) return;

    // پاک کردن محتوای قبلی (مخصوصاً دات‌ها) برای جلوگیری از تکرار
    const dotsContainer = galleryElement.querySelector('.dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
    } else {
        console.error("عنصر .dots در گالری پیدا نشد.");
        return;
    }

    let images;
    try {
        images = JSON.parse(galleryElement.dataset.images || '[]');
    } catch (e) {
        console.error("خطا در خواندن data-images گالری:", e);
        const spinner = galleryElement.querySelector('.spinner');
        if (spinner) spinner.style.display = 'none';
        return;
    }

    const imgEl = galleryElement.querySelector('img');
    const nextBtn = galleryElement.querySelector('.next');
    const prevBtn = galleryElement.querySelector('.prev');
    const spinner = galleryElement.querySelector('.spinner');
    
    if (!imgEl || !nextBtn || !prevBtn || !spinner) {
        console.error("یکی از المان‌های ضروری گالری پیدا نشد.");
        return;
    }

    if (!images || images.length === 0) {
        imgEl.style.display = 'none';
        spinner.style.display = 'none';
        dotsContainer.innerHTML = '<p style="color: white; padding: 20px;">هیچ تصویری برای نمایش وجود ندارد.</p>';
        return;
    }
    
    imgEl.style.display = 'block';
    let index = 0;
    let loadedImagesCache = {};

    // ساخت دات‌های جدید
    images.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', function() {
            if (idx !== index) {
                transitionToImage(idx, idx > index ? "next" : "prev");
            }
        });
        dotsContainer.appendChild(dot);
    });

    function updateDots() {
        dotsContainer.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
    }

    function preloadNext() {
        if (images.length <= 1) return;
        const nextIndex = (index + 1) % images.length;
        const preloadedImg = new Image();
        preloadedImg.src = images[nextIndex];
    }

    function transitionToImage(newIndex, direction) {
        const newImageURL = images[newIndex];
        if (!loadedImagesCache[newImageURL]) {
            spinner.style.display = "block";
        } else {
            spinner.style.display = "none";
        }

        const slideOutClass = direction === "next" ? "translateX(-100%)" : "translateX(100%)";
        const slideInClass = direction === "next" ? "translateX(100%)" : "translateX(-100%)";

        imgEl.style.transition = "transform 0.5s ease";
        imgEl.style.transform = slideOutClass;

        setTimeout(() => {
            index = newIndex;
            imgEl.src = newImageURL;
            updateDots();
            if (loadedImagesCache[newImageURL]) {
                spinner.style.display = "none";
            }
            imgEl.style.transition = "none";
            imgEl.style.transform = slideInClass;
            void imgEl.offsetWidth; // Force reflow
            imgEl.style.transition = "transform 0.5s ease";
            imgEl.style.transform = "translateX(0)";
            preloadNext();
        }, 500);
    }

    // بازنویسی رویدادها برای جلوگیری از چند بار ثبت شدن
    nextBtn.onclick = function() {
        if (images.length > 0) {
            const newIndex = (index + 1) % images.length;
            transitionToImage(newIndex, "next");
        }
    };
    prevBtn.onclick = function() {
        if (images.length > 0) {
            const newIndex = (index - 1 + images.length) % images.length;
            transitionToImage(newIndex, "prev");
        }
    };

    imgEl.onload = function() {
        loadedImagesCache[imgEl.src] = true;
        spinner.style.display = "none";
    };

    // بارگذاری اولین تصویر
    if (images.length > 0) {
        imgEl.src = images[0];
        preloadNext();
    }
}

// *** تغییر اصلی اینجاست ***
// تابع را بلافاصله در دسترس سراسری قرار می‌دهیم تا ویرایشگر به آن دسترسی داشته باشد
window.reinitializeGallery = initializeGallery;


// --- رویداد اصلی برای اجرای اولیه در هنگام بارگذاری صفحه ---
document.addEventListener("DOMContentLoaded", function() {
    // راه‌اندازی تمام گالری‌های موجود در صفحه در هنگام بارگذاری اولیه
    document.querySelectorAll('.gallery').forEach(gallery => {
        if (window.reinitializeGallery) {
            window.reinitializeGallery(gallery);
        }
    });

    // سایر کدهای شما که باید بعد از بارگذاری کامل صفحه اجرا شوند، اینجا قرار می‌گیرند
});
// ===================================================================



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
// در فایل script.js

// ==========================================================
//               Variables Worker Logic (نسخه جدید)
// ==========================================================
const baseUrl = 'https://variable.cobaka6220.workers.dev';
const buffers = {};
const lastSent = {};

// تابع جدید برای گرفتن پیشوند پروژه
function getProjectPrefix() {
    const prefixElement = document.getElementById('project-prefix-input');
    // اگر در حالت ویرایش هستیم از اینپوت بخوان، در غیر این صورت از یک المان مخفی
    if (prefixElement) {
        return prefixElement.value.trim();
    }
    const storedPrefixElement = document.getElementById('project-prefix-data');
    return storedPrefixElement ? storedPrefixElement.textContent.trim() : '';
}

// تابع جدید برای ساخت نام کامل متغیر
function getFullVarName(baseVarName) {
    const prefix = getProjectPrefix();
    return prefix ? `${prefix}-${baseVarName}` : baseVarName;
}

async function getValue(varName) {
    const fullVarName = getFullVarName(varName); // استفاده از نام کامل
    try {
        const res = await fetch(`${baseUrl}/${fullVarName}/get`);
        if (!res.ok) return 0; // اگر متغیر وجود نداشت، ۰ برگردان
        const data = await res.json();
        return parseInt(data.value) || 0;
    } catch (e) {
        console.error(e);
        return 0;
    }
}

async function flushBuffer(varName) {
    const fullVarName = getFullVarName(varName); // استفاده از نام کامل
    if (!buffers[varName] || buffers[varName] === 0 || lastSent[varName]) return;

    const clicks = buffers[varName];
    buffers[varName] = 0;
    lastSent[varName] = true;

    try {
        const current = await getValue(varName); // getValue خودش پیشوند را مدیریت می‌کند
        const newVal = current + clicks;

        const res = await fetch(`${baseUrl}/${fullVarName}/post/${newVal}`, {
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
        // برای بارگذاری اولیه، کمی تاخیر می‌دهیم تا مقدار پیشوند از اینپوت خوانده شود
        setTimeout(() => {
            getValue(varName).then(val => valSpan.textContent = val);
        }, 500);
        
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
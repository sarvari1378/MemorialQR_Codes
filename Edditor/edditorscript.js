// =================================================================
//      فایل کامل، نهایی و یکپارچه edditorscript.js
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------- متغیرهای اصلی -----------------
    const mainEditBtn = document.getElementById('main-edit-btn');
    const exportBtn = document.getElementById('export-btn');
    const body = document.body;
    const sidebar = document.getElementById('control-sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    
    let isEditingMode = false;
    let globalToolbar = null;
    let hideToolbarTimeout;

    // ----------------- توابع اصلی ویرایشگر -----------------

    function toggleEditMode() {
        isEditingMode = !isEditingMode;
        body.classList.toggle('editing-mode', isEditingMode);
        mainEditBtn.classList.toggle('is-editing', isEditingMode);
        
        if (isEditingMode) {
            mainEditBtn.innerHTML = '<i class="fas fa-times"></i> پایان ویرایش';
            exportBtn.style.display = 'block';
            createGlobalToolbar();
            initEditableElements();
        } else {
            mainEditBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> ویرایش صفحه';
            exportBtn.style.display = 'none';
            if (globalToolbar) {
                globalToolbar.remove();
                globalToolbar = null;
            }
            autoConfirmAllEdits();
            const activeElement = document.querySelector('[data-is-being-edited="true"]');
            if(activeElement) activeElement.removeAttribute('data-is-being-edited');
        }
    }

    function initEditableElements() {
        document.querySelectorAll('[editable="true"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (isEditingMode) showToolbarFor(el);
            });
            el.addEventListener('mouseleave', () => {
                if (isEditingMode) hideToolbar();
            });
        });
    }
    
    // تابع کمکی برای مدیریت کلید Space در دکمه‌ها
    const spacebarHandler = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            document.execCommand('insertText', false, ' ');
        }
    };


    // ----------------- توابع مربوط به تولبار ویرایش -----------------

    function createGlobalToolbar() {
        if (globalToolbar) globalToolbar.remove();
        
        globalToolbar = document.createElement('div');
        globalToolbar.className = 'edit-toolbar';
        globalToolbar.id = 'global-edit-toolbar';
        globalToolbar.setAttribute('contenteditable', 'false');
        document.body.appendChild(globalToolbar);

        globalToolbar.addEventListener('click', (e) => {
            e.stopPropagation();
            const button = e.target.closest('button');
            if (!button) return;

            const targetTempId = globalToolbar.dataset.targetTempId;
            if (!targetTempId) return;

            const targetElement = document.querySelector(`[data-temp-id="${targetTempId}"]`);
            if (targetElement) {
                handleToolbarClick(button.dataset.action, targetElement, globalToolbar);
            }
        });

        globalToolbar.addEventListener('mouseenter', () => clearTimeout(hideToolbarTimeout));
        globalToolbar.addEventListener('mouseleave', () => hideToolbar());
    }

    function showToolbarFor(element) {
        if (!globalToolbar || element.hasAttribute('data-is-being-edited') || element.classList.contains('is-actively-editing')) {
            return;
        }
        
        clearTimeout(hideToolbarTimeout);
        
        const tempId = 'editable-' + Date.now();
        element.dataset.tempId = tempId;
        globalToolbar.dataset.targetTempId = tempId;

        globalToolbar.innerHTML = `<button class="toolbar-btn" data-action="edit" title="ویرایش"><i class="fas fa-pencil-alt"></i></button>`;

        const rect = element.getBoundingClientRect();
        const toolbarHeight = 40;
        const margin = 8;
        let top = rect.top - toolbarHeight - margin;
        if (top < 5) top = rect.bottom + margin;
        
        globalToolbar.style.top = `${top}px`;
        globalToolbar.style.left = `${rect.left}px`;
        globalToolbar.classList.add('visible');
    }

    function hideToolbar() {
        hideToolbarTimeout = setTimeout(() => {
            if (globalToolbar && !document.querySelector('.is-actively-editing')) {
                globalToolbar.classList.remove('visible');
            }
        }, 300);
    }
    
    function handleToolbarClick(action, element, toolbar) {
        const editType = element.dataset.editType;
        if (action === 'edit') {
            if (document.querySelector('[data-is-being-edited="true"]') || document.querySelector('.is-actively-editing')) {
                alert('ابتدا ویرایش المان دیگر را تمام کنید.');
                return;
            }
            clearTimeout(hideToolbarTimeout);

            if (editType === 'text') {
                element.dataset.originalContent = element.innerHTML;
                element.classList.add('is-actively-editing');
                element.setAttribute('contenteditable', 'true');
                if (element.tagName === 'BUTTON') element.addEventListener('keydown', spacebarHandler);
                element.focus();
                document.execCommand('selectAll', false, null);
                toolbar.innerHTML = `<button class="toolbar-btn cancel" data-action="cancel" title="لغو"><i class="fas fa-times"></i></button><button class="toolbar-btn confirm" data-action="confirm" title="تایید"><i class="fas fa-check"></i></button>`;
            } else if (editType === 'image' || editType === 'video' || editType === 'button' || editType === 'gallery') {
                element.setAttribute('data-is-being-edited', 'true');
                showEditModal(element, editType);
            }
            
        } else if (action === 'confirm' || action === 'cancel') {
            if (element.tagName === 'BUTTON') element.removeEventListener('keydown', spacebarHandler);
            element.removeAttribute('contenteditable');
            element.classList.remove('is-actively-editing');
            if (action === 'cancel') {
                element.innerHTML = element.dataset.originalContent;
            }
            delete element.dataset.originalContent;
            toolbar.innerHTML = `<button class="toolbar-btn" data-action="edit" title="ویرایش"><i class="fas fa-pencil-alt"></i></button>`;
            hideToolbar();
        }
    }

    // در فایل edditorscript.js

    function showEditModal(element, type) {
        const modal = document.getElementById('edit-modal');
        const title = document.getElementById('modal-title');
        const inputsContainer = document.getElementById('modal-inputs-container');
        
        // پاک کردن محتوای قبلی مودال
        inputsContainer.innerHTML = '';
        title.textContent = `ویرایش ${type}`;

        // --- ساخت فرم بر اساس نوع المان ---

        if (type === 'video') {
            // پیدا کردن تگ <source> در ویدیو
            const videoSource = element.querySelector('video source');
            const currentSrc = videoSource ? videoSource.src : '';

            // ساخت فیلد ورودی برای لینک ویدیو
            inputsContainer.innerHTML = `
                <label for="modal-input-url">آدرس فایل ویدیو (URL):</label>
                <input type="text" id="modal-input-url" value="${currentSrc || ''}">
                <small style="display:block; margin-top:5px; color:#777;">فقط لینک مستقیم به فایل ویدیو (مثلا .mp4) پشتیبانی می‌شود.</small>
            `;

        } else if (type === 'button') {
            // پیدا کردن تگ <a> و <button>
            const buttonTag = element.querySelector('button');
            const linkTag = element.querySelector('a');
            
            const currentText = buttonTag ? buttonTag.textContent : '';
            const currentHref = linkTag ? linkTag.href : '';

            // ساخت فیلدهای ورودی برای متن و لینک دکمه
            inputsContainer.innerHTML = `
                <label for="modal-input-text">متن دکمه:</label>
                <input type="text" id="modal-input-text" value="${currentText}" style="direction: rtl;">
                
                <label for="modal-input-href">آدرس لینک (URL):</label>
                <input type="text" id="modal-input-href" value="${currentHref}">
            `;

        } else if (type === 'gallery') {
            // این بخش از قبل پیاده‌سازی شده و بدون تغییر است
            title.textContent = 'ویرایش لینک‌های گالری';
            const linksContainer = document.createElement('div');
            linksContainer.id = 'gallery-links-container';
            try {
                const imagesArray = JSON.parse(element.dataset.images || '[]');
                if (imagesArray.length > 0) {
                    imagesArray.forEach(link => linksContainer.appendChild(createLinkInputRow(link)));
                } else {
                    linksContainer.appendChild(createLinkInputRow());
                }
            } catch (e) {
                linksContainer.innerHTML = `<p style="color: red;">خطا در فرمت JSON گالری.</p>`;
            }
            inputsContainer.appendChild(linksContainer);
            const addBtn = document.createElement('button');
            addBtn.id = 'add-new-link-btn';
            addBtn.textContent = 'افزودن لینک جدید';
            addBtn.onclick = () => linksContainer.appendChild(createLinkInputRow());
            inputsContainer.appendChild(addBtn);

        }
        // می‌توانید نوع 'image' را هم به همین شکل اضافه کنید
        
        // نمایش مودال
        modal.style.display = 'flex';
    }

    function createLinkInputRow(linkValue = '') {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-link-item';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'gallery-link-input';
        input.value = linkValue;
        input.placeholder = 'آدرس تصویر را اینجا وارد کنید';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-link-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => itemDiv.remove();
        itemDiv.appendChild(input);
        itemDiv.appendChild(deleteBtn);
        return itemDiv;
    }

    function hideModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    function closeModalAndCleanUp() {
        const element = document.querySelector('[data-is-being-edited="true"]');
        if (element) {
            element.removeAttribute('data-is-being-edited');
        }
        hideModal();
    }

    // ----------------- تابع خروجی گرفتن پروژه -----------------
    
    function autoConfirmAllEdits() {
        document.querySelectorAll('.is-actively-editing').forEach(element => {
            if (element.tagName === 'BUTTON') {
                element.removeEventListener('keydown', spacebarHandler);
            }
            element.removeAttribute('contenteditable');
            element.classList.remove('is-actively-editing');
            delete element.dataset.originalContent;
        });
    }

    // در فایل edditorscript.js

    async function exportHTML() {
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ساخت پروژه...';

        try {
            // 1. آماده‌سازی برای خروجی
            const zip = new JSZip();
            autoConfirmAllEdits(); // تایید تمام ویرایش‌های متنی که هنوز باز هستند

            // --- مرحله ۱: آماده‌سازی فایل style.css ---
            const styleCssResponse = await fetch('style.css');
            const originalStyleCss = await styleCssResponse.text();
            
            let newColorsCss = ':root {\n';
            const rootStyles = getComputedStyle(document.documentElement);
            const editableColorVars = [
                '--theme-primary-text', '--theme-primary-bg', '--theme-secondary-bg',
                '--theme-accent', '--theme-gallery-border', '--theme-gallery-dot-border',
                '--theme-gallery-dot-active', '--theme-button-bg', '--theme-button-text',
                '--theme-spinner-top', '--footer-player-bg', '--footer-player-bar',
                '--footer-player-icon', '--footer-player-icon-hover', '--note-bg',
                '--note-text', '--note-delete-btn-bg', '--note-delete-btn-hover-bg'
            ];
            editableColorVars.forEach(varName => {
                newColorsCss += `  ${varName}: ${rootStyles.getPropertyValue(varName).trim()};\n`;
            });
            newColorsCss += '}';

            // جایگزینی بخش :root در فایل CSS با رنگ‌های جدید
            const finalStyleCss = originalStyleCss.replace(/:root\s*{[^}]*}/, newColorsCss);
            zip.file("style.css", finalStyleCss);

            // --- مرحله ۲: آماده‌سازی فایل script.js ---
            const scriptJsResponse = await fetch('script.js');
            const scriptJsContent = await scriptJsResponse.text();
            zip.file("script.js", scriptJsContent);

            // --- مرحله ۳: خواندن فایل HTML اولیه و اعمال تغییرات ---
            const htmlResponse = await fetch(window.location.pathname);
            const originalHtmlText = await htmlResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(originalHtmlText, 'text/html');

            // --- بخش اصلی و اصلاح شده برای اعمال تغییرات ---
            const liveElements = document.querySelectorAll('[editable="true"]');
            const docElements = doc.querySelectorAll('[editable="true"]');

            liveElements.forEach((liveElement, index) => {
                const targetElement = docElements[index];
                if (!targetElement) return;

                const editType = liveElement.dataset.editType;

                if (editType === 'text') {
                    targetElement.innerHTML = liveElement.innerHTML;
                } 
                else if (editType === 'gallery') {
                    targetElement.dataset.images = liveElement.dataset.images;
                } 
                else if (editType === 'video') {
                    const liveSourceTag = liveElement.querySelector('video source');
                    const docSourceTag = targetElement.querySelector('video source');
                    if (liveSourceTag && docSourceTag) {
                        docSourceTag.src = liveSourceTag.src;
                    }
                }
                else if (editType === 'button') {
                    const liveLinkTag = liveElement.querySelector('a');
                    const liveButtonTag = liveElement.querySelector('button');
                    const docLinkTag = targetElement.querySelector('a');
                    const docButtonTag = targetElement.querySelector('button');

                    if (liveLinkTag && docLinkTag) {
                        docLinkTag.href = liveLinkTag.href;
                    }
                    if (liveButtonTag && docButtonTag) {
                        docButtonTag.textContent = liveButtonTag.textContent;
                    }
                }
            });

            // --- مرحله ۴: تمیزکاری نهایی سند برای خروجی ---
            doc.querySelector('#control-sidebar')?.remove();
            doc.querySelector('#edit-modal')?.remove();
            doc.querySelector('link[href="edditorstyle.css"]')?.remove();
            doc.querySelectorAll('script').forEach(s => {
                if (s.src.includes('edditorscript.js') || s.src.includes('jszip.min.js')) {
                    s.remove();
                }
            });
            
            doc.querySelectorAll('[editable], [data-edit-type], [data-original-content], .is-actively-editing, [data-is-being-edited], [data-temp-id]').forEach(el => {
                el.removeAttribute('editable');
                el.removeAttribute('data-edit-type');
                el.removeAttribute('data-original-content');
                el.removeAttribute('data-is-being-edited');
                el.removeAttribute('data-temp-id');
                el.classList.remove('is-actively-editing');
            });


            const projectPrefix = document.getElementById('project-prefix-input').value.trim();
            if (projectPrefix) {
                // یک المان مخفی در body ایجاد می‌کنیم تا پیشوند را در خود نگه دارد
                const prefixDataElement = doc.createElement('div');
                prefixDataElement.id = 'project-prefix-data';
                prefixDataElement.style.display = 'none'; // این المان دیده نمی‌شود
                prefixDataElement.textContent = projectPrefix;
                doc.body.appendChild(prefixDataElement);
            }

            // حذف اینپوت پیشوند از فایل خروجی (چون دیگر لازم نیست)
            const prefixInputElement = doc.getElementById('project-prefix-input');
            if(prefixInputElement) {
                prefixInputElement.closest('.sidebar-setting-item').remove();
            }


            const liveH1 = document.querySelector('h1[editable="true"][data-edit-type="text"]');
            // 2. تگ <title> را در سند خروجی (doc) پیدا می‌کنیم
            const docTitle = doc.querySelector('title');

            // 3. اگر هر دو وجود داشتند، عنوان را به‌روز می‌کنیم
            if (liveH1 && docTitle) {
                const newTitleText = liveH1.textContent.trim();
                if (newTitleText) {
                    docTitle.textContent = newTitleText;
                }
            }


            const finalHtmlContent = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
            zip.file("index.html", finalHtmlContent);

            // --- مرحله ۵: ساخت و دانلود فایل ZIP ---
            const zipContent = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipContent);
            link.download = 'project.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            alert('پروژه با موفقیت در فایل project.zip دانلود شد.');

        } catch (error) {
            console.error("خطا در هنگام ساخت پروژه ZIP:", error);
            alert("خطایی در هنگام آماده‌سازی فایل رخ داد. لطفاً کنسول را بررسی کنید.");
        } finally {
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-download"></i> خروجی HTML';
        }
    }


    // ----------------- رویدادهای اصلی -----------------

    mainEditBtn.addEventListener('click', toggleEditMode);
    exportBtn.addEventListener('click', exportHTML);

    // در فایل edditorscript.js

    document.getElementById('modal-save-btn').addEventListener('click', () => {
        // المان در حال ویرایش را پیدا کن
        const element = document.querySelector('[data-is-being-edited="true"]');
        if (!element) {
            closeModalAndCleanUp();
            return;
        }
        
        const type = element.dataset.editType;

        // --- اعمال تغییرات بر اساس نوع المان ---

        if (type === 'gallery') {
            const inputs = document.querySelectorAll('.gallery-link-input');
            const linksArray = Array.from(inputs).map(input => input.value.trim()).filter(link => link);
            element.dataset.images = JSON.stringify(linksArray, null, 2);
            if (typeof window.reinitializeGallery === 'function') {
                window.reinitializeGallery(element);
            }

        } else if (type === 'video') {
            const newSrc = document.getElementById('modal-input-url').value.trim();
            const videoTag = element.querySelector('video');
            const sourceTag = videoTag ? videoTag.querySelector('source') : null;
            
            if (sourceTag && newSrc) {
                sourceTag.src = newSrc; // تغییر سورس
                videoTag.load(); // مهم: این دستور ویدیو را با سورس جدید بارگذاری می‌کند
                // videoTag.play(); // اختیاری: می‌توانید ویدیو را بعد از تغییر پخش کنید
            }

        } else if (type === 'button') {
            const newText = document.getElementById('modal-input-text').value.trim();
            const newHref = document.getElementById('modal-input-href').value.trim();
            
            const buttonTag = element.querySelector('button');
            const linkTag = element.querySelector('a');
            
            if (buttonTag && newText) {
                buttonTag.textContent = newText;
            }
            if (linkTag) {
                // برای اطمینان از اینکه لینک کامل است
                linkTag.href = newHref.startsWith('http') || newHref.startsWith('/') ? newHref : `https://${newHref}`;
            }
        }

        // بستن مودال و پاک‌سازی
        closeModalAndCleanUp();
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', closeModalAndCleanUp);
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') closeModalAndCleanUp();
    });

    // ----------------- توابع مربوط به سایدبار و تم -----------------
    
    function setupSidebarTabs() {
        const tabButtons = document.querySelectorAll('.sidebar-tab-btn');
        const tabContents = document.querySelectorAll('.sidebar-tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });
    }
    
    function populateColorEditor() {
        const container = document.getElementById('color-picker-container');
        if (!container) return;
        container.innerHTML = '';
        const rootStyles = getComputedStyle(document.documentElement);
        const editableColorVars = [
            '--theme-primary-text', '--theme-primary-bg', '--theme-secondary-bg',
            '--theme-accent', '--theme-gallery-border', '--theme-gallery-dot-border',
            '--theme-gallery-dot-active', '--theme-button-bg', '--theme-button-text',
            '--theme-spinner-top', '--footer-player-bg', '--footer-player-bar',
            '--footer-player-icon', '--footer-player-icon-hover', '--note-bg',
            '--note-text', '--note-delete-btn-bg', '--note-delete-btn-hover-bg'
        ];

        editableColorVars.forEach(varName => {
            const colorValue = rootStyles.getPropertyValue(varName).trim();
            if (!colorValue) return;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'color-picker-item';
            const label = document.createElement('label');
            label.textContent = varName.replace('--theme-', '').replace('--', '').replace(/-/g, ' ');
            label.htmlFor = `color-picker-${varName}`;
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = `color-picker-${varName}`;
            colorInput.value = colorValue;
            colorInput.addEventListener('input', (e) => {
                document.documentElement.style.setProperty(varName, e.target.value);
            });
            itemDiv.appendChild(label);
            itemDiv.appendChild(colorInput);
            container.appendChild(itemDiv);
        });
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // راه‌اندازی اولیه
    setupSidebarTabs();
    populateColorEditor();
    if (sidebar) {
        sidebar.classList.add('open');
    }
});



const mainH1 = document.querySelector('h1[editable="true"][data-edit-type="text"]');


function updatePageTitle() {
    if (mainH1) {
        
        const newTitle = mainH1.textContent.trim();
        if (newTitle) {
            document.title = newTitle;
        }
    }
}


if (mainH1) {
  
    const observer = new MutationObserver(updatePageTitle);

  
    const config = { 
        childList: true, // تغییر در فرزندان (مثل متن)
        characterData: true, // تغییر در خود متن
        subtree: true // تغییرات در زیردرخت‌ها (اگر داخل h1 تگ دیگری باشد)
    };

  
    observer.observe(mainH1, config);

    // برای اطمینان، یک بار هم در ابتدا عنوان را تنظیم می‌کنیم
    updatePageTitle();
}
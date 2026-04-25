// =============================================
// المكتبة المتوهجة - JavaScript
// منظم ومعدل - جميع الحقوق محفوظة
// =============================================

// تعريف عام للوصول من الكونسول
window.booksDatabase = [];
window.openBookDetails = function() {};
window.closeBookDetails = function() {};

// ⭐ دالة لجلب حجم الملف تلقائياً من الرابط
async function getFileSizeFromUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            const bytes = parseInt(contentLength);
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
            return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
        }
        return 'غير معروف';
    } catch (error) {
        console.log('⚠️ فشل جلب حجم الملف:', url);
        return 'غير معروف';
    } 
}

function showToast(message, type = 'success', duration = 2000) {
    // إزالة أي toast قديم
    var old = document.querySelector('.toast-custom');
    if (old) old.remove();
    
    var toast = document.createElement('div');
    toast.className = 'toast-custom toast-' + type;
    var icon = type === 'error' ? '✗' : (type === 'warning' ? '⚠' : '✓');
    
    toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span><button class="toast-close">&times;</button>';
    
    // تنسيقات مباشرة
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:99999;background:#1a1a2e;border:2px solid;padding:14px 20px;border-radius:30px;display:flex;align-items:center;gap:10px;color:#fff;font-size:0.95rem;box-shadow:0 10px 40px rgba(0,0,0,0.6);direction:rtl;animation:slideUp 0.3s ease;font-weight:500;width:85%;max-width:450px;min-width:280px';
    // لون البوردر حسب النوع
    if (type === 'warning') toast.style.borderColor = '#ffd700';
    else if (type === 'error') toast.style.borderColor = '#ff4d4d';
    else toast.style.borderColor = '#4dff88';
    
    document.body.appendChild(toast);
    
    // زر الإغلاق
    toast.querySelector('.toast-close').onclick = function() { toast.remove(); };
    
    // إخفاء تلقائي
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
    }, duration);
}

document.addEventListener('DOMContentLoaded', function() {
    
    
    // =============================================
// ⭐ 1. شاشة البداية
// =============================================
(function() {
    const savedStyle = localStorage.getItem('splashStyle') || '1';
    const target = document.getElementById('splashScreen' + savedStyle) || document.getElementById('splashScreen1');
    if (target) {
        document.querySelectorAll('.splash-screen').forEach(s => s.style.display = 'none');
        target.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.classList.add('splash-active');
        setTimeout(() => {
            target.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.remove('splash-active');
        }, 3000);
    }
})();
    
    // =============================================
    // ⭐ 2. متغيرات عامة
    // =============================================

    let appViewMode = 'list';
    
// ⭐ دالة مساعدة: جلب التقييم الحقيقي
function getRealRating(book) {
    const savedRatings = JSON.parse(localStorage.getItem(`raylob_all_ratings_${book.id}`) || '{}');
    const savedValues = Object.values(savedRatings);
    if (savedValues.length > 0) {
        return (savedValues.reduce((sum, r) => sum + r, 0) / savedValues.length).toFixed(1);
    }
    return book.rating;
}



    window.booksDatabase = booksDatabase;

    // =============================================
    // ⭐ 5. القائمة الجانبية (Sidebar)
    // =============================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // =============================================
    // ⭐ 6. شريط البحث
    // =============================================
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    function filterBooks(query) {
        query = query.trim().toLowerCase();
        document.querySelectorAll('.book-card-horizontal, .book-card').forEach(book => {
            const titleElement = book.querySelector('h3') || book.querySelector('h2');
            if (!titleElement) return;
            const title = titleElement.textContent.toLowerCase();
            book.style.display = (title.includes(query) || query === '') ? '' : 'none';
        });
    }
    if (searchToggle) searchToggle.addEventListener('click', () => { if (searchBar) { searchBar.classList.add('active'); if (searchInput) searchInput.focus(); } });
    if (closeSearch) closeSearch.addEventListener('click', () => { if (searchBar) searchBar.classList.remove('active'); if (searchInput) searchInput.value = ''; filterBooks(''); });
    if (searchInput) searchInput.addEventListener('input', function() { filterBooks(this.value); });

    // =============================================
// ⭐ 7. التصنيفات السريعة
// =============================================
document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const category = this.textContent.trim();
        document.querySelectorAll('.book-card-horizontal, .book-card').forEach(book => {
            const bookId = book.getAttribute('data-book-id');
            if (!bookId) {
                book.style.display = '';
                return;
            }
            const bookData = booksDatabase.find(b => b.id == bookId);
            if (!bookData) {
                book.style.display = '';
                return;
            }
            const bookCategories = bookData.categories || [bookData.category];
book.style.display = (category === 'الكل' || bookCategories.includes(category)) ? '' : 'none';
        });
        showToast('📚 ' + category, 'success', 1000);
    });
});
    // =============================================
    // ⭐ 8. أزرار الصفحة الرئيسية
    // =============================================
    document.querySelectorAll('.download-btn-small').forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = '✓ تم';
            this.style.background = '#00c8ff';
            this.style.color = '#0b0c10';
            this.disabled = true;
            showToast('📥 جاري التحميل...', 'success', 1500);
            setTimeout(() => {
                this.textContent = 'تحميل';
                this.style.background = 'transparent';
                this.style.color = '#00c8ff';
                this.disabled = false;
            }, 3000);
        });
    });

    document.querySelectorAll('.see-all').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.section-header')?.querySelector('.section-title')?.textContent || 'القسم';
            showToast('📚 ' + section + ' - قريباً', 'success');
        });
    });

    // =============================================
// ⭐ 9. تبويبات الرئيسية
// =============================================
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(tab => {
    tab.addEventListener('click', function() {
        tabButtons.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.dataset.tab;
        const welcome = document.querySelector('.welcome-section');
        const categories = document.querySelector('.categories-wrapper');
        const recent = document.getElementById('recentSection');
        const popular = document.getElementById('popularSection');
        const librarySection = document.getElementById('librarySection');
        const emptyLibraryMessage = document.getElementById('emptyLibraryMessage');
        const downloadedSection = document.getElementById('downloadedSection');
        
        if (welcome) welcome.style.display = 'none';
        if (categories) categories.style.display = 'none';
        if (recent) recent.style.display = 'none';
        if (popular) popular.style.display = 'none';
        if (downloadedSection) downloadedSection.style.display = 'none';
        
        if (tabName === 'home') {
            if (welcome) welcome.style.display = 'block';
            if (categories) categories.style.display = 'flex';
            if (recent) recent.style.display = 'block';
            if (popular) popular.style.display = 'block';
            if (librarySection) librarySection.style.display = 'block';
            document.querySelectorAll('.book-card-horizontal, .book-card').forEach(b => b.style.display = '');
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            document.querySelector('.category-chip')?.classList.add('active');
            if (emptyLibraryMessage) emptyLibraryMessage.style.display = 'none';
            showToast('🏠 الرئيسية', 'success', 1000);
            
        } else if (tabName === 'downloaded') {
            if (librarySection) librarySection.style.display = 'block';
            
            const downloadedBooks = document.getElementById('downloadedBooks');
            
            if (downloadedSection && downloadedBooks) {
                downloadedSection.style.display = 'block';
                
                const downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
                const downloadedBooksData = booksDatabase.filter(b => downloaded.includes(b.id.toString()));
                
                if (downloadedBooksData.length === 0) {
                    downloadedBooks.innerHTML = '<p style="color:var(--text-secondary);padding:2rem;text-align:center;">📭 لا توجد كتب محملة - قم بتحميل الكتب أولاً</p>';
                    showToast('📭 لا توجد كتب محملة', 'warning', 1000);
                } else {
                    downloadedBooks.innerHTML = downloadedBooksData.map(book => `
                        <div class="book-card-horizontal" data-book-id="${book.id}">
                            <div class="book-cover">
                                <div class="cover-placeholder">
                                    ${book.cover && book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<span>${book.cover || '📖'}</span>`}
                                </div>
                            </div>
                            <div class="book-info-horizontal">
                                <h3>${book.title}</h3>
                                <p class="book-meta">${book.author}</p>
                            </div>
                        </div>
                    `).join('');
                    showToast('📥 المحملة (' + downloadedBooksData.length + ' كتاب)', 'success', 1000);
                }
            }
            
            if (emptyLibraryMessage) emptyLibraryMessage.style.display = 'none';
        }
    });
});

    // =============================================
    // ⭐ 10. الصفحة الشخصية
    // =============================================
    const userAvatar = document.querySelector('.user-avatar');
    const profilePage = document.getElementById('profilePage');
    const profileOverlay = document.getElementById('profileOverlay');
    const profileBackBtn = document.getElementById('profileBackBtn');

    function openProfile() {
    if (profilePage) profilePage.classList.add('active');
    if (profileOverlay) profileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ⭐ تحديث الكتب المفضلة الحقيقية
    updateProfileFavorites();
}

function updateProfileFavorites() {
    const container = document.querySelector('.favorite-books-scroll');
    if (!container) return;
    
    const favorites = JSON.parse(localStorage.getItem('raylob_favorites') || '[]');
    const favBooks = booksDatabase.filter(b => favorites.includes(b.id.toString()));
    
    if (favBooks.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:1rem;text-align:center;width:100%;">❤️ لم تضف أي كتاب للمفضلة بعد</p>';
    } else {
        container.innerHTML = favBooks.map(book => `
            <div class="favorite-book-item" onclick="window.openBookDetailsById('${book.id}')" style="cursor:pointer;">
                <div class="favorite-book-cover">
                    ${book.cover ? book.cover : '<span>📖</span>'}
                </div>
                <div class="favorite-book-info">
                    <h4>${book.title}</h4>
                    <p>${book.author}</p>
                </div>
            </div>
        `).join('');
    }
}
    function closeProfile() {
        if (profilePage) profilePage.classList.remove('active');
        if (profileOverlay) profileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (userAvatar) userAvatar.addEventListener('click', openProfile);
    if (profileBackBtn) profileBackBtn.addEventListener('click', closeProfile);
    if (profileOverlay) profileOverlay.addEventListener('click', closeProfile);

    // =============================================
    // ⭐ 11. نافذة تعديل الملف الشخصي
    // =============================================
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileOverlay = document.getElementById('editProfileOverlay');
    
    function openEditModal() {
        if (editProfileModal) editProfileModal.classList.add('active');
        if (editProfileOverlay) editProfileOverlay.classList.add('active');
    }
    function closeEditModal() {
        if (editProfileModal) editProfileModal.classList.remove('active');
        if (editProfileOverlay) editProfileOverlay.classList.remove('active');
    }
    document.getElementById('editProfileBtn')?.addEventListener('click', openEditModal);
    document.getElementById('editProfileDetailsBtn')?.addEventListener('click', openEditModal);
    document.getElementById('closeEditProfileModal')?.addEventListener('click', closeEditModal);
    document.getElementById('cancelEditProfile')?.addEventListener('click', closeEditModal);
    if (editProfileOverlay) editProfileOverlay.addEventListener('click', closeEditModal);
    document.getElementById('saveEditProfile')?.addEventListener('click', function() {
        const newName = document.getElementById('newProfileName')?.value || 'قارئ النيون';
        const newUsername = document.getElementById('newUsername')?.value || '@neon_reader';
        const newBio = document.getElementById('newBio')?.value || '📚 عاشق للكتب والقراءة';
        const profileName = document.getElementById('profileName');
        const profileUsername = document.querySelector('.profile-username');
        const profileBio = document.querySelector('.profile-bio');
        if (profileName) profileName.textContent = newName;
        if (profileUsername) profileUsername.textContent = newUsername;
        if (profileBio) profileBio.textContent = newBio;
        closeEditModal();
        showToast('✓ تم تحديث الملف الشخصي', 'success');
    });

    // =============================================
    // ⭐ 12. أزرار الحساب
    // =============================================
    document.getElementById('changeNameBtn')?.addEventListener('click', () => { openEditModal(); setTimeout(() => document.getElementById('newProfileName')?.focus(), 300); });
    document.getElementById('changePasswordBtn')?.addEventListener('click', () => showToast('🔐 تم إرسال رابط التغيير', 'success'));
    document.getElementById('readingGoalBtn')?.addEventListener('click', () => showToast('🎯 هدف القراءة: 30 كتاب', 'success'));
    document.getElementById('backupDataBtn')?.addEventListener('click', () => { showToast('☁️ جاري النسخ الاحتياطي...', 'warning', 1500); setTimeout(() => showToast('✓ تم النسخ بنجاح', 'success'), 1500); });
    document.getElementById('logoutBtn')?.addEventListener('click', () => { if (confirm('تسجيل الخروج؟')) { showToast('👋 تم تسجيل الخروج', 'success'); closeProfile(); } });

        // =============================================
    // ⭐ 13. قارئ PDF متطور
    // =============================================
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    const readerPage = document.getElementById('readerPage');
    const readerOverlay = document.getElementById('readerOverlay');
    const readerBackBtn = document.getElementById('readerBackBtn');
    const readerBookTitle = document.getElementById('readerBookTitle');
    
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const prevBtn = document.getElementById('readerPrevBtn');
    const nextBtn = document.getElementById('readerNextBtn');
    const progressFill = document.getElementById('readerProgressFill');
    const readerLoading = document.getElementById('readerLoading');
    const jumpModal = document.getElementById('readerJumpModal');
    const jumpInput = document.getElementById('readerJumpInput');
    
    let pdfDoc = null, currentPage = 1, totalPages = 0;
    let currentBook = null;
    let isFullscreen = false;
    let scrollMode = false;
    const readerHeader = document.querySelector('.reader-header');
    const readerControls = document.querySelector('.reader-controls');

function openReader(book) {
    if (!readerPage || !readerOverlay) return;
    currentBook = book;
    readerBookTitle.textContent = book.title;
    readerPage.classList.add('active');
    readerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ⭐ الحصول على العناصر من جديد
    var loading = document.getElementById('readerLoading');
    var canvas = document.getElementById('pdfCanvas');

    if (book.fileType === 'html') {
        loadHTML(book.fileUrl);
    } else {
        if (loading) loading.classList.remove('hidden');
        if (canvas) canvas.style.display = 'none';
            // ⭐ استرجاع الصفحة المحفوظة
    const savedPage = currentBook ? JSON.parse(localStorage.getItem('raylob_bookmarks') || '{}')[currentBook.id] : null;
    if (savedPage) {
        // نخزنها مؤقتاً ونستخدمها بعد التحميل
        window._savedReaderPage = savedPage;
    }
        loadPDF(book.fileUrl);
    }
    setupReaderSettings();
}
function loadHTML(url) {
    const content = document.getElementById('readerContent');
    content.innerHTML = '';
    content.style.display = 'block';
    content.style.overflow = 'auto';
    
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'width:100%;height:100%;border:none;background:#fff;';
    iframe.id = 'htmlReader';
    
    content.appendChild(iframe);
    var loading = document.getElementById('readerLoading');
    if (loading) loading.classList.add('hidden');
}
    
    function closeReader() {
        // ⭐ حفظ الصفحة الحالية قبل الخروج
    if (currentBook && currentPage > 1) {
        const bookmarks = JSON.parse(localStorage.getItem('raylob_bookmarks') || '{}');
        bookmarks[currentBook.id] = currentPage;
        localStorage.setItem('raylob_bookmarks', JSON.stringify(bookmarks));
    }
    readerPage.classList.remove('active');
    readerOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // ⭐ إعادة بناء المحتوى للقراءة القادمة
    const content = document.getElementById('readerContent');
    content.innerHTML = '';
    content.style.display = 'flex';
    content.style.overflow = 'auto';
    content.innerHTML = '<div class="reader-loading hidden" id="readerLoading"><div class="reader-spinner"></div><p>📖 جاري تحميل الكتاب...</p></div><canvas id="pdfCanvas"></canvas>';
    
    // ⭐ إعادة تعيين المتغيرات
    pdfDoc = null; currentPage = 1; totalPages = 0;
    currentBook = null;
    scrollMode = false;
    if (isFullscreen) toggleFullscreen();
    
    // ⭐ إعادة تعريف المتغيرات للعناصر الجديدة
    window.pdfCanvas = document.getElementById('pdfCanvas');
    window.readerLoading = document.getElementById('readerLoading');
}
    
    readerBackBtn.addEventListener('click', closeReader);
    readerOverlay.addEventListener('click', closeReader);

    function loadPDF(url) {
    if (!url) return;
    var loading = document.getElementById('readerLoading');
    var canvas = document.getElementById('pdfCanvas');
    
    if (loading) loading.classList.remove('hidden');
    if (canvas) canvas.style.display = 'none';
    
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf; totalPages = pdf.numPages;
        totalPagesSpan.textContent = totalPages;
        jumpInput.max = totalPages;
        
        // ⭐ حفظ عدد الصفحات للكتاب ← أضف هنا
        if (currentBook && totalPages > 0) {
            const bookInDB = booksDatabase.find(b => b.id == currentBook.id);
            if (bookInDB) bookInDB.totalPages = totalPages;
        }
        
        if (loading) loading.classList.add('hidden');
        if (canvas) canvas.style.display = '';
        var startPage = window._savedReaderPage || 1;
        if (startPage > totalPages) startPage = 1;
        renderPage(startPage); updateButtons();
        window._savedReaderPage = null;
    }).catch(error => { 
        if (loading) loading.innerHTML = '<p style="color:#ff4d4d;">❌ فشل التحميل</p>';
    });
}
    
    function renderPage(pageNum) {
        if (!pdfDoc) return;
        pdfDoc.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            pdfCanvas.height = viewport.height; 
            pdfCanvas.width = viewport.width;
            page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport });
            currentPage = pageNum;
            currentPageSpan.textContent = currentPage;
            progressFill.style.width = ((currentPage / totalPages) * 100) + '%';
            updateButtons();
            updateBookmarkStatus();

            if (readerPage.classList.contains('night-mode')) {
            pdfCanvas.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.85)';
        } else {
            pdfCanvas.style.filter = 'none';
        }
            
        });
    }
    
    function updateButtons() {
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    }
    
    prevBtn.addEventListener('click', () => { if (currentPage > 1) renderPage(currentPage - 1); });
    nextBtn.addEventListener('click', () => { if (currentPage < totalPages) renderPage(currentPage + 1); });

    // ⭐ القفز لصفحة
    document.getElementById('readerJumpBtn')?.addEventListener('click', () => { jumpModal.classList.add('active'); jumpInput.focus(); });
    document.getElementById('readerJumpCancel')?.addEventListener('click', () => jumpModal.classList.remove('active'));
    document.getElementById('readerJumpGo')?.addEventListener('click', () => {
    const page = parseInt(jumpInput.value);
    if (page >= 1 && page <= totalPages) {
        if (scrollMode) {
            // ⭐ في وضع التمرير: اسكرول للصفحة المطلوبة
            const content = document.getElementById('readerContent');
            const scrollCanvases = content.querySelectorAll('.scroll-canvas');
            if (scrollCanvases[page - 1]) {
                scrollCanvases[page - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
                currentPage = page;
                currentPageSpan.textContent = currentPage;
                progressFill.style.width = ((currentPage / totalPages) * 100) + '%';
            }
        } else {
            // في الوضع العادي
            renderPage(page);
        }
        jumpModal.classList.remove('active');
    }
});
    jumpModal.addEventListener('click', (e) => { if (e.target === jumpModal) jumpModal.classList.remove('active'); });

    // ⭐ ملء الشاشة
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            readerHeader.style.transform = 'translateY(-100%)';
            readerControls.style.transform = 'translateY(100%)';
        } else {
            readerHeader.style.transform = 'translateY(0)';
            readerControls.style.transform = 'translateY(0)';
        }
        updateFullscreenStatus();
    }
    
    function updateFullscreenStatus() {
        const el = document.getElementById('readerFullscreenStatus');
        if (el) el.textContent = isFullscreen ? 'يعمل' : 'إيقاف';
    }
    
    // لمسة للخروج من ملء الشاشة
    document.getElementById('readerContent').addEventListener('click', function(e) {
        if (isFullscreen && e.target.tagName !== 'BUTTON') {
            toggleFullscreen();
        }
    });
        function updateBookmarkStatus() {
        const el = document.getElementById('readerBookmarkStatus');
        if (!el || !currentBook) return;
        const bm = JSON.parse(localStorage.getItem('raylob_bookmarks') || '{}');
        el.textContent = bm[currentBook.id] ? 'صفحة ' + bm[currentBook.id] : 'لم تحفظ بعد';
    }
    // ⭐ دالة عرض كل الصفحات (وضع التمرير)
    function renderAllPages() {
        if (!pdfDoc) return;
        const content = document.getElementById('readerContent');
        document.getElementById('pdfCanvas').style.display = 'none';
        content.querySelectorAll('.scroll-canvas').forEach(c => c.remove());
        
        for (let i = 1; i <= totalPages; i++) {
            pdfDoc.getPage(i).then(page => {
                const canvas = document.createElement('canvas');
                canvas.className = 'scroll-canvas';
                canvas.style.cssText = 'display:block;margin:10px auto;max-width:100%;box-shadow:0 5px 20px rgba(0,0,0,0.5);';
                const viewport = page.getViewport({ scale: 1.3 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                page.render({ canvasContext: canvas.getContext('2d'), viewport });
                content.appendChild(canvas);
                                // ⭐ تطبيق الوضع الليلي
                if (readerPage.classList.contains('night-mode')) {
                    canvas.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.85)';
                }
            });
        }
        
        content.onscroll = function() {
            const scrollCanvases = content.querySelectorAll('.scroll-canvas');
            if (scrollCanvases.length === 0) return;
            let currentVisiblePage = 1;
            const contentTop = content.scrollTop;
            const contentHeight = content.clientHeight;
            scrollCanvases.forEach((canvas, index) => {
                const canvasTop = canvas.offsetTop;
                const canvasHeight = canvas.offsetHeight;
                if (contentTop + contentHeight / 2 >= canvasTop && 
                    contentTop + contentHeight / 2 < canvasTop + canvasHeight) {
                    currentVisiblePage = index + 1;
                }
            });
            currentPage = currentVisiblePage;
            currentPageSpan.textContent = currentPage;
            progressFill.style.width = ((currentPage / totalPages) * 100) + '%';
            updateBookmarkStatus();
        };
    }
    // ⭐ إعدادات القارئ

            function setupReaderSettings() {
        const menu = document.getElementById('readerSettingsMenu');
        const overlay = document.getElementById('readerSettingsOverlay');
        const btn = document.getElementById('readerSettingsBtn');
        const close = document.getElementById('readerSettingsClose');
        
        btn.onclick = () => { menu.classList.add('active'); overlay.classList.add('active'); };
        close.onclick = () => { menu.classList.remove('active'); overlay.classList.remove('active'); };
        overlay.onclick = () => { menu.classList.remove('active'); overlay.classList.remove('active'); };
        
        
        
        // ⭐ ملء الشاشة
        document.getElementById('readerFullscreenBtn').onclick = () => {
            toggleFullscreen();
            menu.classList.remove('active'); overlay.classList.remove('active');
        };
        
        // ⭐ القفز لصفحة
        document.getElementById('readerJumpBtn2').onclick = () => {
            jumpModal.classList.add('active'); jumpInput.focus();
            menu.classList.remove('active'); overlay.classList.remove('active');
        };
        
                // ⭐ وضع التمرير
        document.getElementById('readerScrollModeBtn').onclick = () => {
            scrollMode = !scrollMode;
            const content = document.getElementById('readerContent');
            const savedPage = currentPage; // ⭐ حفظ الصفحة الحالية
            
            if (scrollMode) {
                content.style.display = 'block';
                content.style.overflow = 'auto';
                pdfCanvas.style.display = 'none';
                renderAllPages();
                
                // ⭐ اسكرول للصفحة المحفوظة بعد التحميل
                setTimeout(() => {
                    const scrollCanvases = content.querySelectorAll('.scroll-canvas');
                    if (scrollCanvases[savedPage - 1]) {
                        scrollCanvases[savedPage - 1].scrollIntoView({ behavior: 'instant', block: 'start' });
                    }
                }, 300);
            } else {
                content.style.display = 'flex';
                content.style.overflow = 'auto';
                pdfCanvas.style.display = '';
                content.querySelectorAll('.scroll-canvas').forEach(c => c.remove());
                renderPage(savedPage); // ⭐ ارجع للصفحة المحفوظة
            }
            document.getElementById('readerScrollStatus').textContent = scrollMode ? 'يعمل' : 'إيقاف';
            menu.classList.remove('active'); overlay.classList.remove('active');
        };
        
        // ⭐ التمرير التلقائي (مختصر)
        let autoScrollInterval = null, autoScrollSpeed = 1;
        document.getElementById('readerAutoScrollBtn').onclick = () => {
            menu.classList.remove('active'); overlay.classList.remove('active');
            if (autoScrollInterval) { clearInterval(autoScrollInterval); autoScrollInterval = null; document.getElementById('readerAutoScrollStatus').textContent = 'إيقاف'; return; }
            document.getElementById('readerSpeedModal').classList.add('active');
        };
        // speed modal buttons
        document.querySelectorAll('.reader-speed-btn').forEach(b => {
            b.onclick = function() {
                document.querySelectorAll('.reader-speed-btn').forEach(x => x.classList.remove('active'));
                this.classList.add('active');
                autoScrollSpeed = parseFloat(this.dataset.speed);
            };
        });
        // speed cancel
        document.getElementById('readerSpeedCancel').onclick = () => document.getElementById('readerSpeedModal').classList.remove('active');
        // existing go button handler
        var goBtn = document.querySelector('.reader-speed-go');
        if (goBtn) goBtn.onclick = function() {
            const content = document.getElementById('readerContent');
            if (!scrollMode) {
                scrollMode = true; content.style.display = 'block'; content.style.overflow = 'auto';
                pdfCanvas.style.display = 'none'; renderAllPages();
                document.getElementById('readerScrollStatus').textContent = 'يعمل';
                setTimeout(() => { startScroll(); }, 500);
            } else { startScroll(); }
            function startScroll() {
                autoScrollInterval = setInterval(() => {
                    content.scrollBy({ top: autoScrollSpeed * 0.5, behavior: 'smooth' });
                    if (content.scrollTop + content.clientHeight >= content.scrollHeight - 10) {
                        clearInterval(autoScrollInterval); autoScrollInterval = null;
                        document.getElementById('readerAutoScrollStatus').textContent = 'إيقاف';
                    }
                }, 50);
            }
            document.getElementById('readerAutoScrollStatus').textContent = 'يعمل';
            document.getElementById('readerSpeedModal').classList.remove('active');
        };

                // ⭐ الوضع الليلي
        document.getElementById('readerNightMode2').onclick = () => {
            readerPage.classList.toggle('night-mode');
            document.getElementById('readerNightStatus').textContent = 
                readerPage.classList.contains('night-mode') ? 'يعمل 🌙' : 'إيقاف';
            menu.classList.remove('active'); overlay.classList.remove('active');
        };

        // ⭐ التمرير الجانبي
    let touchStartX = 0, touchStartY = 0;
    var readerContentEl = document.getElementById('readerContent');
    readerContentEl.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    readerContentEl.addEventListener('touchend', e => {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX < 0 && currentPage < totalPages) renderPage(currentPage + 1);
            else if (diffX > 0 && currentPage > 1) renderPage(currentPage - 1);
        }
    });
    }
        // =============================================
    // ⭐ 14. صفحة تفاصيل الكتاب
    // =============================================
    
    const bookDetailsPage = document.getElementById('bookDetailsPage');
    const bookDetailsOverlay = document.getElementById('bookDetailsOverlay');
    const detailsBackBtn = document.getElementById('detailsBackBtn');
    const bookDetailsContent = document.getElementById('bookDetailsContent');

    function closeBookDetails() {
        if (bookDetailsPage) bookDetailsPage.classList.remove('active');
        if (bookDetailsOverlay) bookDetailsOverlay.classList.remove('active');
        document.body.style.overflow = '';
        updateHomePage();
    }
    window.closeBookDetails = closeBookDetails;
    if (detailsBackBtn) detailsBackBtn.addEventListener('click', closeBookDetails);
    if (bookDetailsOverlay) bookDetailsOverlay.addEventListener('click', function(e) {
    // ⭐ لا تغلق إذا كان الضغط على عنصر داخل صفحة التفاصيل
    if (e.target.closest('.book-details-page')) return;
    closeBookDetails();
});

// ⭐ التحقق من نسبة القراءة
function canRate(bookId) {
    const totalPagesForBook = booksDatabase.find(b => b.id == bookId)?.totalPages;
    if (!totalPagesForBook) {
        // إذا ما نعرف عدد الصفحات، نخلي أي صفحة مقروءة تسمح بالتقييم
        const bookmarks = JSON.parse(localStorage.getItem('raylob_bookmarks') || '{}');
        return bookmarks[bookId] && bookmarks[bookId] > 1;
    }
    
    const bookmarks = JSON.parse(localStorage.getItem('raylob_bookmarks') || '{}');
    const readPage = bookmarks[bookId] || 0;
    const percent = (readPage / totalPagesForBook) * 100;
    return percent >= 10;
}  


    function openBookDetails(book) {
            console.log("openBookDetails called for:", book.title);
    console.log("bookDetailsPage:", bookDetailsPage);
    console.log("bookDetailsOverlay:", bookDetailsOverlay);
        
        if (!bookDetailsPage || !bookDetailsOverlay) return;
        const downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
        const favorites = JSON.parse(localStorage.getItem('raylob_favorites') || '[]');
        const isDownloaded = downloaded.includes(book.id.toString());
        const isFavorite = favorites.includes(book.id.toString());
                
        // ⭐ تحديث التقييم من localStorage قبل العرض
        const savedRatings = JSON.parse(localStorage.getItem(`raylob_all_ratings_${book.id}`) || '{}');
        const savedValues = Object.values(savedRatings);
        if (savedValues.length > 0) {
            const realAverage = savedValues.reduce((sum, r) => sum + r, 0) / savedValues.length;
            book.rating = parseFloat(realAverage.toFixed(1));
            
        }
        
        bookDetailsContent.innerHTML = `
    <div class="details-cover">${book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}">` : `<span>${book.cover}</span>`}</div>
    <div class="details-info">
        <h2 class="details-book-title">${book.title}</h2>
        <p class="details-book-author">${book.author}</p>
        
        <!-- ⭐ قسم الإحصائيات (تقييم + مشاهدة + تحميل) -->
        <div class="details-stats">
            <div class="stat-item">
                <i class="fas fa-star" style="color:#ffd700;"></i>
                <span>${getRealRating(book)}</span>
                <small>تقييم</small>
            </div>
            <div class="stat-item">
                <i class="fas fa-eye" style="color:#ff4da6;"></i>
                <span>${Math.floor(book.downloads / 100)}K</span>
                <small>مشاهدة</small>
            </div>
            <div class="stat-item">
                <i class="fas fa-download" style="color:#00ffc3;"></i>
                <span>${book.downloads.toLocaleString()}</span>
                <small>تحميل</small>
            </div>
        </div>
        
        <!-- ⭐ تاريخ النشر والإضافة والحجم -->
        <div class="details-meta">
            <span><i class="fas fa-calendar-alt" style="color:#ff4da6;"></i> نُشر: ${book.publishDate || 'غير معروف'}</span>
            <span><i class="fas fa-clock" style="color:#00ffc3;"></i> أُضيف: ${book.addedDate || 'حديثاً'}</span>
            <span><i class="fas fa-hdd" style="color:var(--neon-color);"></i> ${book.fileSize || 'غير معروف'}</span>
        </div>
    </div>
    
    <!-- باقي الكود (التقييم بالنجوم، الأزرار، الوصف...) يبقى كما هو دون تغيير -->
    <!-- ⭐ قسم التقييم بالنجوم -->
    <div class="details-rating-section" style="text-align:center;margin:1.2rem 0;padding:1rem;background:var(--card-bg);border-radius:16px;border:1px solid var(--border-color);">
        <div style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:8px;">⭐ قيّم هذا الكتاب</div>
        <div class="star-rating-interactive" id="starRating-${book.id}" style="display:flex;justify-content:center;gap:6px;direction:ltr;position:relative;padding:10px 15px;">
            <span class="chain-left" style="display:none;"></span>
            <span class="chain-right" style="display:none;"></span>
            <span class="chain-top" style="display:none;"></span>
            <span class="lock-icon-svg" style="display:none;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    <circle cx="12" cy="16" r="1"></circle>
                </svg>
            </span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
        </div>
        <div style="color:var(--neon-color);font-size:1.1rem;font-weight:700;margin-top:6px;" id="ratingText-${book.id}">
            ${book.rating > 0 ? book.rating.toFixed(1) + ' / 5' : 'لم يقيم بعد'}
        </div>
        <div style="color:var(--text-muted);font-size:0.75rem;margin-top:2px;" id="ratingCount-${book.id}">
            (0 تقييم)
        </div>
        <div class="rating-actions" id="ratingActions-${book.id}" style="display:none;justify-content:center;gap:12px;margin-top:12px;">
            <button class="rating-cancel-btn" id="ratingCancel-${book.id}" style="background:transparent;border:1.5px solid #ff4d4d;color:#ff4d4d;padding:8px 20px;border-radius:25px;cursor:pointer;font-weight:600;font-size:0.9rem;">✕ إلغاء</button>
            <button class="rating-confirm-btn" id="ratingConfirm-${book.id}" style="background:var(--neon-color);border:none;color:var(--bg-primary);padding:8px 20px;border-radius:25px;cursor:pointer;font-weight:700;font-size:0.9rem;box-shadow:var(--neon-glow);">✓ تأكيد</button>
        </div>
    </div>
    


            
            <div class="details-actions">
                <button class="details-favorite-btn ${isFavorite?'active':''}" id="favoriteBtn-${book.id}"><i class="fas fa-heart"></i> ${isFavorite?'المفضلة':'إضافة للمفضلة'}</button>
                ${!isDownloaded ? `
                    <button class="details-read-btn" id="readOnlineBtn-${book.id}"><i class="fas fa-book-open"></i> قراءة أونلاين</button>
                    <button class="details-download-btn" id="downloadBtn-${book.id}"><i class="fas fa-download"></i> تحميل</button>
                ` : `<button class="details-read-btn single-center" id="readBtn-${book.id}"><i class="fas fa-book-open"></i> قراءة</button>`}
            </div>
            <div class="download-progress" id="progress-${book.id}" style="display:none;"><div class="progress-bar-container"><div class="progress-bar-fill" id="progressFill-${book.id}"></div></div><span class="progress-text" id="progressText-${book.id}">0%</span></div>
            <div class="details-description"><h4 class="details-section-title"><i class="fas fa-info-circle"></i> نبذة عن الكتاب</h4><p>${book.description||'لا تتوفر نبذة عن هذا الكتاب حالياً.'}</p></div>
            <div class="details-parts"><h4 class="details-section-title"><i class="fas fa-layer-group"></i> الأجزاء</h4><div class="parts-list">${book.parts&&book.parts.length>0 ? book.parts.map((part,i)=>`<span class="part-item ${i===0?'active':''}" onclick="window.switchPart('${book.id}',${i})">${part.title}</span>`).join('') : '<span class="no-parts">لا توجد أجزاء أخرى لهذا الكتاب</span>'}</div></div>
            <div class="details-similar"><h4 class="details-section-title"><i class="fas fa-book"></i> كتب مشابهة</h4><div class="similar-books-scroll" id="similarBooks-${book.id}"></div></div>
            <div class="details-author-books"><h4 class="details-section-title"><i class="fas fa-user-pen"></i> أعمال لنفس الكاتب</h4><div class="author-books-scroll" id="authorBooks-${book.id}"></div></div>
        `;
        
        // ⭐ نظام التقييم بالنجوم - نهائي مع حفظ دائم
    setTimeout(() => {
        const ratingContainer = document.getElementById(`starRating-${book.id}`);
        if (!ratingContainer) return;
        
        const stars = ratingContainer.querySelectorAll('.star');

            
                                // ⭐ إذا ما قرأ 10%، قفل النجوم
        if (!canRate(book.id)) {
            ratingContainer.classList.add('locked');
            ratingContainer.querySelectorAll('.chain-left, .chain-right, .chain-top, .lock-icon-svg').forEach(el => {
                el.style.display = 'block';
            });
            const actionsDiv2 = document.getElementById(`ratingActions-${book.id}`);
            if (actionsDiv2) actionsDiv2.style.display = 'none';
            
            // ⭐ إشعار + أنيميشن عند الضغط
            ratingContainer.onclick = function(e) {
                // أنيميشن رجة للقفل
                ratingContainer.classList.add('shake');
                setTimeout(() => ratingContainer.classList.remove('shake'), 500);
                
                // أنيميشن للقفل
                var lockIcon = ratingContainer.querySelector('.lock-icon-svg');
                if (lockIcon) {
                    lockIcon.style.animation = 'none';
                    lockIcon.offsetHeight;
                    lockIcon.style.animation = 'lockFloat 0.3s ease 3';
                }
                
                // الإشعار
                showToast('🔒 اقرأ 10% من الكتاب على الأقل لتتمكن من تقييمه', 'warning', 2500);
            };
        }
        const actionsDiv = document.getElementById(`ratingActions-${book.id}`);
        const confirmBtn = document.getElementById(`ratingConfirm-${book.id}`);
        const cancelBtn = document.getElementById(`ratingCancel-${book.id}`);
        const ratingText = document.getElementById(`ratingText-${book.id}`);
        const ratingCountEl = document.getElementById(`ratingCount-${book.id}`);
        
        // ⭐ مستخدم فريد
        const userId = localStorage.getItem('raylob_user_id') || 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('raylob_user_id', userId);
        
        // ⭐ استرجاع التقييمات المحفوظة
        const allRatings = JSON.parse(localStorage.getItem(`raylob_all_ratings_${book.id}`) || '{}');
        const ratingsCount = Object.keys(allRatings).length;
        const ratingsValues = Object.values(allRatings);
        const avgRating = ratingsCount > 0 
            ? (ratingsValues.reduce((sum, r) => sum + r, 0) / ratingsCount)
            : 0;
        
        // ⭐ تقييمي الشخصي من localStorage
        let myRating = parseFloat(localStorage.getItem(`raylob_my_rating_${book.id}`)) || allRatings[userId] || 0;
        let tempRating = myRating;
        
        function updateStars(rating, isMyRating = false) {
            stars.forEach((star, index) => {
                const starValue = index + 1;
                star.classList.remove('full', 'half', 'my-rating');
                if (rating >= starValue) {
                    star.classList.add('full');
                    if (isMyRating) star.classList.add('my-rating');
                } else if (rating >= starValue - 0.5) {
                    star.classList.add('half');
                    if (isMyRating) star.classList.add('my-rating');
                }
            });
        }
        
        // ⭐ إظهار تقييمي أولاً إذا وجد
        if (myRating > 0) {
            updateStars(myRating, true);
        } else if (ratingsCount > 0) {
            updateStars(avgRating);
        }
        
        // ⭐ تحديث النصوص
        ratingText.textContent = ratingsCount > 0 ? avgRating.toFixed(1) + ' / 5' : 'لم يقيم بعد';
        ratingCountEl.textContent = ratingsCount > 0 ? `(${ratingsCount} تقييم)` : '(0 تقييم)';
        
        // ⭐ إظهار تقييمي
        const myLabel = document.getElementById(`myRatingLabel-${book.id}`) || document.createElement('div');
        myLabel.id = `myRatingLabel-${book.id}`;
        myLabel.style.cssText = 'color:#ff4da6;font-size:0.8rem;margin-top:4px;font-weight:600;';
        if (!myLabel.parentNode && ratingCountEl.parentNode) {
            ratingCountEl.after(myLabel);
        }
        myLabel.textContent = myRating > 0 ? '✨ تقييمك: ' + myRating.toFixed(1) + ' ⭐' : '';
        
                // عند الضغط على نجمة
        stars.forEach((star, index) => {
            const starValue = index + 1;
            star.addEventListener('click', function(e) {
                if (!canRate(book.id)) {
    
    return;
}
                const rect = this.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const starWidth = rect.width;
                tempRating = clickX < starWidth / 2 ? starValue - 0.5 : starValue;
                updateStars(tempRating);
                ratingText.textContent = 'تقييمك: ' + tempRating.toFixed(1) + ' / 5';
                if (actionsDiv) actionsDiv.style.display = 'flex';
            });
            star.addEventListener('mouseenter', function() { updateStars(starValue); });
            star.addEventListener('mouseleave', function() {
                if (actionsDiv && actionsDiv.style.display === 'flex') updateStars(tempRating);
                else if (myRating > 0) updateStars(myRating, true);
                else updateStars(avgRating);
            });
        });
        
        // زر التأكيد ✅
        if (confirmBtn) {
            confirmBtn.onclick = function() {
                // ⭐ حفظ تقييمي
                localStorage.setItem(`raylob_my_rating_${book.id}`, tempRating);
                
                // ⭐ تحديث كل التقييمات
                allRatings[userId] = tempRating;
                localStorage.setItem(`raylob_all_ratings_${book.id}`, JSON.stringify(allRatings));
                
                // ⭐ تحديث المتغيرات
                myRating = tempRating;
                const newValues = Object.values(allRatings);
                const newAvg = newValues.reduce((sum, r) => sum + r, 0) / newValues.length;
                const newCount = newValues.length;
                
                // ⭐ تحديث قاعدة البيانات
                const bookInDB = booksDatabase.find(b => b.id == book.id);
                if (bookInDB) bookInDB.rating = parseFloat(newAvg.toFixed(1));
                
                // ⭐ تحديث العرض
                updateStars(myRating, true);
                   // ✨ أنيميشن تأكيد التقييم
                stars.forEach(s => {
                    s.classList.add('confirmed');
                    setTimeout(() => s.classList.remove('confirmed'), 800);
                });
                ratingText.textContent = newAvg.toFixed(1) + ' / 5';
                ratingCountEl.textContent = `(${newCount} تقييم)`;
                myLabel.textContent = '✨ تقييمك: ' + myRating.toFixed(1) + ' ⭐';
                
                if (actionsDiv) actionsDiv.style.display = 'none';
                showToast('✅ تم تقييم الكتاب: ' + myRating.toFixed(1) + ' / 5', 'success', 1500);
                                // ⭐ تحديث كل الصفحات
                updateAllRatingsDisplay(book.id, newAvg);
            };
        }
        
        // زر الإلغاء ✕
        if (cancelBtn) {
            cancelBtn.onclick = function() {
                tempRating = myRating;
                if (myRating > 0) updateStars(myRating, true);
                else updateStars(avgRating);
                ratingText.textContent = ratingsCount > 0 ? avgRating.toFixed(1) + ' / 5' : 'لم يقيم بعد';
                if (actionsDiv) actionsDiv.style.display = 'none';
            };
        }
    }, 150);
        // ⭐ ربط أزرار التفاصيل
        const bookId = book.id;
                setTimeout(() => {
            const favBtn = document.getElementById(`favoriteBtn-${bookId}`);
            if (favBtn) {
                favBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let favs = JSON.parse(localStorage.getItem('raylob_favorites')||'[]');
                    if (favs.includes(bookId.toString())) {
                        favs = favs.filter(id => id !== bookId.toString());
                        this.classList.remove('active'); 
                        this.innerHTML = '<i class="fas fa-heart"></i> إضافة للمفضلة';
                        showToast('💔 تمت الإزالة من المفضلة', 'warning', 1000);
                    } else {
                        favs.push(bookId.toString());
                        this.classList.add('active'); 
                        this.innerHTML = '<i class="fas fa-heart"></i> المفضلة';
                        showToast('❤️ تمت الإضافة إلى المفضلة', 'success', 1000);
                    }
                    localStorage.setItem('raylob_favorites', JSON.stringify(favs));
                    return false;
                };
            }
            
            document.getElementById(`readOnlineBtn-${bookId}`)?.addEventListener('click', () => { closeBookDetails(); openReader(book); });
            document.getElementById(`readBtn-${bookId}`)?.addEventListener('click', () => { closeBookDetails(); openReader(book); });
            
            document.getElementById(`downloadBtn-${bookId}`)?.addEventListener('click', function() {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);';
    
    var dialog = document.createElement('div');
    dialog.style.cssText = 'background:var(--bg-primary);border:2px solid var(--neon-color);border-radius:28px;padding:2rem;text-align:center;width:85%;max-width:360px;box-shadow:0 25px 70px rgba(0,0,0,0.5),var(--neon-glow);direction:rtl;';
    
    dialog.innerHTML = `
        <div style="margin-bottom:1.2rem; display:flex; justify-content:center;">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 8M12 16L9 13M12 16L15 13" stroke="var(--neon-color)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 16.7428C21.2215 15.7349 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7H16.302C15.2994 5.25652 13.4957 4 11.386 4C8.31183 4 5.7854 6.29859 5.42631 9.33908C3.44118 10.0226 2 11.8869 2 14.0967C2 16.8544 4.23858 19.0967 7 19.0967H8" stroke="var(--neon-color-secondary)" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="17.5" cy="17.5" r="4.5" stroke="var(--neon-color)" stroke-width="1.5"/>
                <path d="M17.5 15.5V19.5M19.5 17.5H15.5" stroke="var(--neon-color)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </div>
        <h3 style="color:var(--neon-color);margin-bottom:0.5rem;font-size:1.3rem;font-weight:800;text-shadow:var(--neon-text-shadow);">تأكيد التحميل</h3>
        <p style="color:var(--text-primary);margin-bottom:0.3rem;font-size:1rem;font-weight:600;">${book.title}</p>
        <p style="color:var(--text-muted);margin-bottom:1.8rem;font-size:0.85rem;display:flex;align-items:center;justify-content:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16v12H4z"></path>
                <line x1="8" y1="10" x2="16" y2="10"></line>
            </svg>
            الحجم: ${book.fileSize || 'غير معروف'}
        </p>
        <div style="display:flex;gap:12px;justify-content:center;">
            <button id="cancelDownload-${bookId}" style="background:transparent;border:2px solid #ff4d4d;color:#ff4d4d;padding:12px 28px;border-radius:40px;cursor:pointer;font-weight:700;font-size:0.95rem;transition:all 0.3s;display:flex;align-items:center;gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                إلغاء
            </button>
            <button id="confirmDownload-${bookId}" style="background:var(--neon-color);border:none;color:var(--bg-primary);padding:12px 28px;border-radius:40px;cursor:pointer;font-weight:800;font-size:0.95rem;box-shadow:0 0 20px var(--neon-color);transition:all 0.3s;display:flex;align-items:center;gap:8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                تحميل
            </button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    const closeDialog = () => overlay.remove();
    document.getElementById('cancelDownload-' + bookId).onclick = closeDialog;
    overlay.onclick = (e) => { if (e.target === overlay) closeDialog(); };
    
    document.getElementById('confirmDownload-' + bookId).onclick = async function() {
        closeDialog();
        
        const progressDiv = document.getElementById(`progress-${bookId}`);
        const readOnlineBtn = document.getElementById(`readOnlineBtn-${bookId}`);
        const downloadBtn = document.getElementById(`downloadBtn-${bookId}`);
        
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (readOnlineBtn) readOnlineBtn.style.display = 'none';
        if (progressDiv) progressDiv.style.display = 'block';
        
        const fileName = book.fileUrl.split('/').pop() || `${book.title}.pdf`;
        
        try {
            await downloadFile(book.fileUrl, fileName, book.id, book);
            showToast(`✅ تم تحميل: ${book.title}`, 'success', 3000);
            closeBookDetails();
            updateHomePage();
            setTimeout(() => openBookDetails(book), 100);
        } catch (error) {
            showToast(`❌ فشل التحميل: ${error.message}`, 'error', 3000);
            if (downloadBtn) downloadBtn.style.display = 'flex';
            if (readOnlineBtn) readOnlineBtn.style.display = 'flex';
            if (progressDiv) progressDiv.style.display = 'none';
        }
    };
});
        }, 100);
        // إظهار النافذة
    bookDetailsPage.classList.add('active');
    bookDetailsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log("✅ تم فتح نافذة التفاصيل");
     
    }

    

   


    // =============================================
// ⭐ 15. صفحة التصنيف وعرض الكتب
// =============================================
const categoryPage = document.getElementById('categoryPage');
const categoryOverlay = document.getElementById('categoryOverlay');
const categoryBackBtn = document.getElementById('categoryBackBtn');
const categoryTitle = document.getElementById('categoryTitle')?.querySelector('span');
const categoryBooksList = document.getElementById('categoryBooksList');
const categoryBookCount = document.getElementById('categoryBookCount');
const noCategoryBooksMessage = document.getElementById('noCategoryBooksMessage');

function closeCategoryPage() {
    if (!categoryPage || !categoryOverlay) return;
    categoryPage.classList.remove('active');
    categoryOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
if (categoryBackBtn) categoryBackBtn.addEventListener('click', closeCategoryPage);
if (categoryOverlay) categoryOverlay.addEventListener('click', closeCategoryPage);

function renderBooks(books) {
    if (!categoryBooksList) return;
    categoryBooksList.innerHTML = '';
    categoryBooksList.className = appViewMode === 'grid' ? 'category-books-grid' : 'category-books-list';
    if (books.length === 0) {
        if (noCategoryBooksMessage) noCategoryBooksMessage.style.display = 'block';
        if (categoryBookCount) categoryBookCount.textContent = '0 كتب';
        return;
    }
    if (noCategoryBooksMessage) noCategoryBooksMessage.style.display = 'none';
    if (categoryBookCount) categoryBookCount.textContent = books.length + ' كتاب';
    const isGridView = appViewMode === 'grid';
    books.forEach(book => {
        const card = document.createElement('div');
        if (isGridView) {
            card.className = 'book-grid-card';
            card.setAttribute('data-book-id', book.id);
            card.innerHTML = `<div class="book-grid-cover">${book.cover.startsWith('http')?`<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;">`:`<span>${book.cover}</span>`}</div><div class="book-grid-info"><div class="book-grid-title">${book.title}</div><div class="book-grid-author">${book.author}</div><div class="book-grid-rating"><i class="fas fa-star" style="color:#ffd700;"></i><span class="rating-value">${getRealRating(book)}</span></div><div class="book-grid-stats"><span class="stat-item"><i class="fas fa-eye" style="color:#ff4da6;"></i>${(book.downloads/1000).toFixed(1)}K</span><span class="stat-item"><i class="fas fa-download" style="color:#00ffc3;"></i>${book.downloads.toLocaleString()}</span></div></div>`;
        } else {
            card.className = 'category-book-card';
            card.setAttribute('data-book-id', book.id);
            card.innerHTML = `<div class="category-book-cover">${book.cover.startsWith('http')?`<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`:`<span>${book.cover}</span>`}</div><div class="category-book-info"><h4>${book.title}</h4><p class="category-book-author">${book.author}</p><div class="category-book-meta"><span class="book-rating"><i class="fas fa-star" style="color:#ffd700;"></i>${getRealRating(book)}</span><span class="book-downloads"><i class="fas fa-download" style="color:#00ffc3;"></i>${book.downloads.toLocaleString()}</span><span class="book-views"><i class="fas fa-eye" style="color:#ff4da6;"></i>${(book.downloads/1000).toFixed(1)}K</span></div></div>`;
        }
        card.addEventListener('click', () => openBookDetails(book));
        categoryBooksList.appendChild(card);
    });
}

function renderDownloadedBooks(books) {
    if (!categoryBooksList) return;
    categoryBooksList.innerHTML = '';
    categoryBooksList.className = 'category-books-list';
    if (books.length === 0) {
        if (noCategoryBooksMessage) noCategoryBooksMessage.style.display = 'block';
        if (categoryBookCount) categoryBookCount.textContent = '0 كتب';
        return;
    }
    if (noCategoryBooksMessage) noCategoryBooksMessage.style.display = 'none';
    if (categoryBookCount) categoryBookCount.textContent = books.length + ' كتاب';
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'category-book-card';
        card.setAttribute('data-book-id', book.id);
        card.innerHTML = `
            <div class="category-book-cover">${book.cover && book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<span>${book.cover || '📖'}</span>`}</div>
            <div class="category-book-info">
                <h4>${book.title}</h4>
                <p class="category-book-author">${book.author}</p>
                <div class="category-book-meta">
                    <span class="book-rating"><i class="fas fa-star" style="color:#ffd700;"></i> ${getRealRating(book)}</span>
                    <span class="book-downloads"><i class="fas fa-download" style="color:#00ffc3;"></i> ${book.downloads.toLocaleString()}</span>
                </div>
            </div>
            <div class="category-book-actions">
                <button class="delete-download-btn-big" data-book-id="${book.id}" style="background:#ff4d4d;color:#fff;border:none;width:38px;height:38px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(255,77,77,0.4);">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                        <path d="M4.5 6.5h15l-1.4 11.8a1.5 1.5 0 0 1-1.5 1.2H7.4a1.5 1.5 0 0 1-1.5-1.2L4.5 6.5z" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
                        <line x1="8" y1="9.5" x2="8" y2="17" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
                        <line x1="12" y1="9.5" x2="12" y2="17" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
                        <line x1="16" y1="9.5" x2="16" y2="17" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
                        <path d="M3.5 6.5h17" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                        <path d="M7.5 4.2l1-1.7h7l1 1.7" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        card.addEventListener('click', () => openBookDetails(book));
        categoryBooksList.appendChild(card);
    });
    
    document.querySelectorAll('.delete-download-btn-big').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookId = this.dataset.bookId;
            if (confirm('⚠️ هل أنت متأكد من حذف هذا الكتاب من التحميلات؟')) {
                let downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
                downloaded = downloaded.filter(id => id !== bookId);
                localStorage.setItem('raylob_downloaded', JSON.stringify(downloaded));
                showToast('🗑️ تم حذف الكتاب من التحميلات', 'warning', 1500);
                const updatedBooks = booksDatabase.filter(b => downloaded.includes(b.id.toString()));
                renderDownloadedBooks(updatedBooks);
                updateHomePage();
            }
        });
    });
}

function openCategoryPage(categoryName) {
    if (!categoryPage || !categoryOverlay) return;
    if (categoryTitle) categoryTitle.textContent = categoryName;
        
    // ⭐ إخفاء الفلتر في المفضلة والمحملة
    const filterBar = document.getElementById('filterBar');
    const filterBtn = document.getElementById('openFilterModalBtn');
    const viewOptions = document.querySelector('.category-view-options');
    const showFilter = (categoryName !== 'المحملة' && categoryName !== 'المفضلة');
    if (filterBar) filterBar.style.display = showFilter ? 'flex' : 'none';
    if (filterBtn) filterBtn.style.display = showFilter ? 'flex' : 'none';
    if (viewOptions) viewOptions.style.display = showFilter ? 'flex' : 'none';
    
    let filteredBooks;
    if (categoryName === 'كل الكتب') filteredBooks = [...booksDatabase];
    else if (categoryName === 'المحملة') {
        const downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
        filteredBooks = booksDatabase.filter(b => downloaded.includes(b.id.toString()));
    } else if (categoryName === 'المفضلة') {
        const favorites = JSON.parse(localStorage.getItem('raylob_favorites')||'[]');
        filteredBooks = booksDatabase.filter(b => favorites.includes(b.id.toString()));
    } else filteredBooks = booksDatabase.filter(b => {
    const cats = b.categories || [b.category];
    return cats.includes(categoryName);
});
    
    appViewMode = 'list';
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');
    if (viewGridBtn) viewGridBtn.classList.remove('active');
    if (viewListBtn) viewListBtn.classList.add('active');
    
    if (categoryName === 'المحملة') {
        renderDownloadedBooks(filteredBooks);
    } else {
        renderBooks(filteredBooks);
    }
    
    categoryPage.classList.add('active');
    categoryOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}


    // =============================================
    // ⭐ 16. ربط القائمة الجانبية
    // =============================================
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const linkText = this.querySelector('span')?.textContent.trim();
            const actions = {
                'الرئيسية': () => { closeSidebar(); document.querySelector('.tab-btn[data-tab="home"]')?.click(); showToast('🏠 الرئيسية', 'success'); },
                'كل الكتب': () => { closeSidebar(); openCategoryPage('كل الكتب'); },
                'المحملة': () => { closeSidebar(); openCategoryPage('المحملة'); },
                'المفضلة': () => { closeSidebar(); openCategoryPage('المفضلة'); },
                'الإعدادات': () => { closeSidebar(); openSettings(); },
                'عن المكتبة المتوهجة': () => { closeSidebar(); showToast('📱 المكتبة المتوهجة v1.0.0', 'success', 3000); },
                'قيم التطبيق': () => { closeSidebar(); showToast('⭐ شكراً لدعمك!', 'success'); }
            };
            if (actions[linkText]) actions[linkText]();
            const categories = ['روايات','فلسفة','تاريخ','علوم','دينية','نفسي'];
            if (categories.includes(linkText)) { closeSidebar(); openCategoryPage(linkText); }
        });
    });

    // =============================================
// ⭐ 17. الإعدادات والسمات (مع الحفظ التلقائي)
// =============================================
const settingsModal = document.getElementById('settingsModal');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsToggle = document.getElementById('settingsToggle');
const settingsClose = document.getElementById('settingsClose');
function openSettings() { if (settingsModal) settingsModal.classList.add('active'); if (settingsOverlay) settingsOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeSettings() { if (settingsModal) settingsModal.classList.remove('active'); if (settingsOverlay) settingsOverlay.classList.remove('active'); document.body.style.overflow = ''; }
if (settingsToggle) settingsToggle.addEventListener('click', openSettings);
if (settingsClose) settingsClose.addEventListener('click', closeSettings);
if (settingsOverlay) settingsOverlay.addEventListener('click', closeSettings);

// أزرار السمات - مع الحفظ التلقائي
document.querySelectorAll('.theme-btn').forEach(btn => btn.addEventListener('click', function() {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const theme = this.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('raylob_theme', theme); // ⭐ حفظ تلقائي
    showToast('🎨 تم تغيير السمة', 'success', 1000);
}));

// أزرار الألوان - مع الحفظ التلقائي
document.querySelectorAll('.color-btn').forEach(btn => btn.addEventListener('click', function() {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const colorMap = {'cyan':'#00ffc3','pink':'#ff4da6','purple':'#b84dff','gold':'#ffd700','blue':'#4da6ff','green':'#4dff88','orange':'#ffa64d','red':'#ff4d4d'};
    const color = this.dataset.color;
    document.documentElement.style.setProperty('--neon-color', colorMap[color] || '#00ffc3');
    localStorage.setItem('raylob_neon_color', color); // ⭐ حفظ تلقائي
    showToast('✨ تم تغيير لون النيون', 'success', 1000);
}));

// منزلق السطوع - مع الحفظ التلقائي
const brightnessSliderEl = document.getElementById('neonBrightnessSlider');
if (brightnessSliderEl) brightnessSliderEl.addEventListener('input', function() {
    const level = this.value;
    const labels = ['مطفأ','منخفض','متوسط','عالٍ'];
    document.getElementById('neonBrightnessValue').textContent = labels[level];
    const intensity = level === '0' ? 0 : parseInt(level) * 0.4;
    if (intensity === 0) {
        document.documentElement.style.setProperty('--neon-glow','none');
        document.documentElement.style.setProperty('--neon-text-shadow','none');
    } else {
        document.documentElement.style.setProperty('--neon-glow',`0 0 ${15*intensity}px var(--neon-color)`);
        document.documentElement.style.setProperty('--neon-text-shadow',`0 0 ${5*intensity}px var(--neon-color)`);
    }
    localStorage.setItem('raylob_neon_brightness', level); // ⭐ حفظ تلقائي
});

// زر حفظ الإعدادات
document.getElementById('saveSettings')?.addEventListener('click', () => {
    
// ⭐ زر مسح جميع التحميلات
document.getElementById('clearDownloads')?.addEventListener('click', function() {
    if (confirm('⚠️ مسح جميع الكتب المحملة؟')) {
        localStorage.removeItem('raylob_downloaded');
        showToast('🗑️ تم مسح جميع التحميلات', 'warning', 2000);
        updateHomePage();
    }
});
    showToast('✓ تم حفظ جميع الإعدادات', 'success');
    closeSettings();
});

// زر إعادة التعيين
document.getElementById('resetSettings')?.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme','neon-dark');
    document.documentElement.style.setProperty('--neon-color','#00ffc3');
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.theme-btn[data-theme="neon-dark"]')?.classList.add('active');
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.color-btn[data-color="cyan"]')?.classList.add('active');
    if (brightnessSliderEl) brightnessSliderEl.value = '3';
    document.getElementById('neonBrightnessValue').textContent = 'عالٍ';
    // إعادة ضبط localStorage
    localStorage.setItem('raylob_theme', 'neon-dark');
    localStorage.setItem('raylob_neon_color', 'cyan');
    localStorage.setItem('raylob_neon_brightness', '3');
    showToast('🔄 تم إعادة الإعدادات', 'success');
});

// =============================================
// ⭐ تحميل الإعدادات المحفوظة عند بدء التطبيق
// =============================================
setTimeout(() => {
    const savedTheme = localStorage.getItem('raylob_theme') || 'neon-dark';
    const savedColor = localStorage.getItem('raylob_neon_color') || 'cyan';
    const savedBrightness = localStorage.getItem('raylob_neon_brightness') || '3';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    });
    
    const colorMap = {'cyan':'#00ffc3','pink':'#ff4da6','purple':'#b84dff','gold':'#ffd700','blue':'#4da6ff','green':'#4dff88','orange':'#ffa64d','red':'#ff4d4d'};
    document.documentElement.style.setProperty('--neon-color', colorMap[savedColor] || '#00ffc3');
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === savedColor);
    });
    
    if (brightnessSliderEl) brightnessSliderEl.value = savedBrightness;
    const labels = ['مطفأ','منخفض','متوسط','عالٍ'];
    document.getElementById('neonBrightnessValue').textContent = labels[savedBrightness];
}, 150);
    // =============================================
    // ⭐ 18. أزرار Grid/List والفلتر
    // =============================================
    const viewGridBtn = document.getElementById('viewGridBtn');
    const viewListBtn = document.getElementById('viewListBtn');
    if (viewGridBtn) viewGridBtn.addEventListener('click', () => { appViewMode='grid'; viewGridBtn.classList.add('active'); viewListBtn.classList.remove('active'); const cat=categoryTitle?.textContent||'كل الكتب'; renderBooks(cat==='كل الكتب'?[...booksDatabase]:booksDatabase.filter(b=>b.category===cat)); showToast('🔲 عرض شبكي','success',800); });
    if (viewListBtn) viewListBtn.addEventListener('click', () => { appViewMode='list'; viewListBtn.classList.add('active'); viewGridBtn.classList.remove('active'); const cat=categoryTitle?.textContent||'كل الكتب'; renderBooks(cat==='كل الكتب'?[...booksDatabase]:booksDatabase.filter(b=>b.category===cat)); showToast('📋 عرض قائمة','success',800); });

    document.querySelectorAll('.filter-bar .filter-btn').forEach(btn => btn.addEventListener('click', function() { document.querySelectorAll('.filter-bar .filter-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active'); const filter=this.dataset.filter; const cat=categoryTitle?.textContent||'كل الكتب'; let filtered=cat==='كل الكتب'?[...booksDatabase]:booksDatabase.filter(b=>b.category===cat); if(filter==='popular') filtered.sort((a,b)=>b.downloads-a.downloads); else filtered.sort((a,b)=>b.id-a.id); renderBooks(filtered); showToast(filter==='popular'?'📊 ترتيب: الأكثر قراءة':'🕐 ترتيب: المضافة مؤخراً','success',1000); }));
    document.getElementById('openFilterModalBtn')?.addEventListener('click', () => showToast('🔍 ميزة الفلتر المتقدم قادمة قريباً','success',1500));

    // =============================================
    // ⭐ 19. ربط أزرار البروفايل
    // =============================================
    document.querySelectorAll('.profile-section .see-all-link').forEach(link => link.addEventListener('click', function(e) { e.preventDefault(); const title=this.closest('.section-header')?.querySelector('.profile-section-title')?.textContent||''; if(title.includes('المفضلة')){ closeProfile(); openCategoryPage('المفضلة'); } else if(title.includes('واصل القراءة')){ closeProfile(); showToast('📖 ميزة واصل القراءة قادمة قريباً','success'); } }));

// =============================================
// ⭐ 20. تحديث الصفحة الرئيسية
// =============================================
function updateHomePage() {
    const downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
    
    const recentContainer = document.getElementById('recentBooks');
    if (recentContainer) { 
        const recent = [...booksDatabase].sort((a,b) => b.id - a.id).slice(0, 6); 
        recentContainer.innerHTML = recent.length ? recent.map(book => `
            <div class="book-card-horizontal" data-book-id="${book.id}">
                <div class="book-cover"><div class="cover-placeholder">${book.cover && book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<span>${book.cover || '📖'}</span>`}</div></div>
                <div class="book-info-horizontal"><h3>${book.title}</h3><p class="book-meta">${book.author}</p></div>
                ${downloaded.includes(book.id.toString()) ? '<div style="position:absolute;top:5px;right:5px;background:#00ffc3;color:#0b0c10;padding:2px 7px;border-radius:8px;font-size:0.65rem;font-weight:bold;z-index:2;">✓ محمل</div>' : ''}
            </div>
        `).join('') : '<p style="color:var(--text-secondary);padding:1rem;">لا توجد كتب مضافة حديثاً</p>'; 
    }
    
    const popularContainer = document.getElementById('popularBooks');
    if (popularContainer) { 
        const popular = [...booksDatabase].sort((a,b) => b.downloads - a.downloads).slice(0, 6); 
        popularContainer.innerHTML = popular.length ? popular.map((book, i) => `
            <div class="book-card-horizontal popular" data-book-id="${book.id}">
                <div class="rank-badge">#${i+1}</div>
                <div class="book-cover"><div class="cover-placeholder">${book.cover && book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<span>${book.cover || '📖'}</span>`}</div></div>
                <div class="book-info-horizontal"><h3>${book.title}</h3><p class="book-meta">${book.author}</p></div>
                ${downloaded.includes(book.id.toString()) ? '<div style="position:absolute;top:5px;right:5px;background:#ff4da6;color:#fff;padding:2px 7px;border-radius:8px;font-size:0.65rem;font-weight:bold;z-index:2;">✓ محمل</div>' : ''}
            </div>
        `).join('') : '<p style="color:var(--text-secondary);padding:1rem;">لا توجد كتب</p>'; 
    }
    
    // تحديث قسم المحملة أيضاً
    updateDownloadedSection();
}

// تحديث قسم المحملة
function updateDownloadedSection() {
    const downloadedBooks = document.getElementById('downloadedBooks');
    if (!downloadedBooks) return;
    
    const downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
    const downloadedBooksData = booksDatabase.filter(b => downloaded.includes(b.id.toString()));
    
    if (downloadedBooksData.length === 0) {
        downloadedBooks.innerHTML = '<p style="color:var(--text-secondary);padding:2rem;text-align:center;">📭 لا توجد كتب محملة</p>';
    } else {
        downloadedBooks.innerHTML = downloadedBooksData.map(book => `
            <div class="book-card-horizontal" data-book-id="${book.id}" style="position:relative;">
                <div class="book-cover">
                    <div class="cover-placeholder">
                        ${book.cover && book.cover.startsWith('http') ? `<img src="${book.cover}" alt="${book.title}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` : `<span>${book.cover || '📖'}</span>`}
                    </div>
                </div>
                <div class="book-info-horizontal">
                    <h3>${book.title}</h3>
                    <p class="book-meta">${book.author}</p>
                </div>
                <button class="delete-download-btn" data-book-id="${book.id}" style="position:absolute;top:5px;left:5px;background:#ff4d4d;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(255,77,77,0.5);">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none">
        <path d="M4.5 6.5h15l-1.4 11.8a1.5 1.5 0 0 1-1.5 1.2H7.4a1.5 1.5 0 0 1-1.5-1.2L4.5 6.5z" fill="none" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="8" y1="9.5" x2="8" y2="17" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
        <line x1="12" y1="9.5" x2="12" y2="17" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
        <line x1="16" y1="9.5" x2="16" y2="17" stroke="white" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
        <path d="M3.5 6.5h17" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M7.5 4.2l1-1.7h7l1 1.7" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>
            </div>
        `).join('');
        
        // ربط أزرار الحذف
        document.querySelectorAll('.delete-download-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookId = this.dataset.bookId;
                let downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
                downloaded = downloaded.filter(id => id !== bookId);
                localStorage.setItem('raylob_downloaded', JSON.stringify(downloaded));
                showToast('🗑️ تم حذف الكتاب من المحملة', 'warning', 1500);
                updateHomePage();
            });
        });
    }
}
setTimeout(updateHomePage, 100);
    // =============================================
    // ⭐ 21. ربط الضغط على البطاقات
    // =============================================
    document.addEventListener('click', e => { const card=e.target.closest('.category-book-card, .book-grid-card, .book-card-horizontal'); if(card){ const book=booksDatabase.find(b=>b.id==card.dataset.bookId); if(book) openBookDetails(book); } });

    // =============================================
// ⭐ 22. أنماط شاشة البداية (5 أنماط)
// =============================================
let currentSplashStyle = localStorage.getItem('splashStyle') || '1';
function hideAllSplashScreens() { 
    for (let i = 1; i <= 5; i++) {  // ⭐ 5 بدل 4
        const screen = document.getElementById('splashScreen' + i);
        if (screen) screen.style.display = 'none';
    }
}
function showSplashScreen(style) { 
    hideAllSplashScreens(); 
    const screen = document.getElementById('splashScreen' + style); 
    if (screen) { 
        screen.style.display = 'flex'; 
        document.body.style.overflow = 'hidden'; 
        document.body.classList.add('splash-active'); 
        setTimeout(() => { 
            screen.style.display = 'none'; 
            document.body.style.overflow = ''; 
            document.body.classList.remove('splash-active'); 
        }, 3000); 
    } 
}
showSplashScreen(currentSplashStyle);
document.querySelectorAll('.splash-style-btn').forEach(btn => btn.addEventListener('click', function() { 
    document.querySelectorAll('.splash-style-btn').forEach(b => b.classList.remove('active')); 
    this.classList.add('active'); 
    currentSplashStyle = this.dataset.splash; 
    localStorage.setItem('splashStyle', currentSplashStyle); // ⭐ حفظ فوري
}));
setTimeout(() => { 
    const saved = localStorage.getItem('splashStyle') || '1'; 
    document.querySelectorAll('.splash-style-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.splash === saved)); 
    currentSplashStyle = saved; 
}, 200);
    // =============================================
    // ⭐ 23. نظام المفضلة
    // =============================================
    function addFavoriteButtons() { document.querySelectorAll('.book-card').forEach(book=>{ const bookId=book.dataset.bookId; if(!bookId) return; const actionsDiv=book.querySelector('.book-actions'); if(!actionsDiv||actionsDiv.querySelector('.favorite-btn')) return; const favBtn=document.createElement('button'); favBtn.className='favorite-btn'; favBtn.innerHTML='<i class="fas fa-heart"></i>'; favBtn.style.cssText='background:transparent;border:1.5px solid #ff4da6;color:#ff4da6;padding:0.6rem 1rem;border-radius:40px;cursor:pointer;transition:all 0.3s;margin-right:5px;'; const favorites=JSON.parse(localStorage.getItem('raylob_favorites')||'[]'); if(favorites.includes(bookId)){ favBtn.classList.add('favorited'); favBtn.style.background='#ff4da6'; favBtn.style.color='#0b0c10'; } favBtn.addEventListener('click', function(e){ e.stopPropagation(); let favorites=JSON.parse(localStorage.getItem('raylob_favorites')||'[]'); if(favorites.includes(bookId)){ favorites=favorites.filter(id=>id!==bookId); this.classList.remove('favorited'); this.style.background='transparent'; this.style.color='#ff4da6'; showToast('💔 تمت الإزالة من المفضلة','warning',1000); } else { favorites.push(bookId); this.classList.add('favorited'); this.style.background='#ff4da6'; this.style.color='#0b0c10'; showToast('❤️ تمت الإضافة إلى المفضلة','success',1000); } localStorage.setItem('raylob_favorites', JSON.stringify(favorites)); }); const downloadBtn=actionsDiv.querySelector('.download-btn'); if(downloadBtn) actionsDiv.insertBefore(favBtn, downloadBtn); else actionsDiv.appendChild(favBtn); }); }
    setTimeout(addFavoriteButtons, 300);

    // =============================================
    // ⭐ 24. زر Escape
    // =============================================
    document.addEventListener('keydown', e => { if(e.key==='Escape'){ if(searchBar?.classList.contains('active')){ searchBar.classList.remove('active'); if(searchInput) searchInput.value=''; } closeSidebar(); closeProfile(); closeEditModal(); closeSettings(); closeCategoryPage(); closeBookDetails(); } });

    console.log('%c🌟 المكتبة المتوهجة | جاهز!', 'color: #00ffc3; font-size: 16px; font-weight: bold;');

    // =============================================
// ⭐ حفظ وعرض شاشة البداية عند الحفظ
// =============================================
const saveBtn = document.getElementById('saveSettings');
if (saveBtn) {
    const originalSaveClick = saveBtn.onclick;
    saveBtn.addEventListener('click', function() {
        const style = localStorage.getItem('splashStyle') || '1';
        
        // إخفاء جميع الشاشات
        document.querySelectorAll('.splash-screen').forEach(s => s.style.display = 'none');
        
        // إظهار الشاشة المختارة
        const targetScreen = document.getElementById('splashScreen' + style);
        if (targetScreen) {
            targetScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('splash-active');
            
            setTimeout(() => {
                targetScreen.style.display = 'none';
                document.body.style.overflow = '';
                document.body.classList.remove('splash-active');
            }, 3000);
        }
    });
}

// =============================================
// ⭐ إصلاح المحملة من القائمة الجانبية
// =============================================
document.querySelector('.sidebar-link[data-page="downloaded"]')?.addEventListener('click', function(e) {
    e.preventDefault();
    closeSidebar();
    
    // ⭐ حفظ التبويب الحالي قبل الانتقال
    const activeTab = document.querySelector('.tab-btn.active');
    const wasOnHome = activeTab && activeTab.dataset.tab === 'home';
    
    // فتح صفحة المحملة
    openCategoryPage('المحملة');
    
    // ⭐ عند إغلاق صفحة المحملة، نرجع للتبويب السابق
    const categoryBackBtn = document.getElementById('categoryBackBtn');
    const categoryOverlay = document.getElementById('categoryOverlay');
    
    const restoreTab = function() {
        if (wasOnHome) {
            // إعادة تبويب الرئيسية
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            const homeTab = document.querySelector('.tab-btn[data-tab="home"]');
            if (homeTab) {
                homeTab.classList.add('active');
                homeTab.click();
            }
        }
        // إزالة المستمع لتجنب التكرار
        if (categoryBackBtn) categoryBackBtn.removeEventListener('click', restoreTab);
        if (categoryOverlay) categoryOverlay.removeEventListener('click', restoreTab);
    };
    
    if (categoryBackBtn) categoryBackBtn.addEventListener('click', restoreTab, { once: true });
    if (categoryOverlay) categoryOverlay.addEventListener('click', restoreTab, { once: true });
});

// =============================================
// ⭐ تحديث عرض التقييمات في كل الصفحات
// =============================================
function updateAllRatingsDisplay(bookId, newRating) {
    // تحديث كل البطاقات التي تعرض هذا الكتاب
    document.querySelectorAll(`[data-book-id="${bookId}"]`).forEach(card => {
        // تحديث النجوم في البطاقات الأفقية
        const ratingSpan = card.querySelector('.book-rating, [style*="color:#ffd700"]');
        if (ratingSpan) {
            const icon = ratingSpan.querySelector('i');
            if (icon) {
                ratingSpan.innerHTML = `<i class="fas fa-star" style="color:#ffd700;"></i> ${newRating.toFixed(1)}`;
            }
        }
        
        // تحديث النجوم في بطاقات التصنيف
        const metaRating = card.querySelector('.book-rating');
        if (metaRating) {
            const icon = metaRating.querySelector('i');
            if (icon) {
                metaRating.innerHTML = `<i class="fas fa-star" style="color:#ffd700;"></i> ${newRating.toFixed(1)}`;
            }
        }
    });
    
    // تحديث صفحة التصنيف إذا كانت مفتوحة
    const categoryBooksList = document.getElementById('categoryBooksList');
    if (categoryBooksList) {
        categoryBooksList.querySelectorAll(`[data-book-id="${bookId}"]`).forEach(card => {
            const ratingEl = card.querySelector('.book-rating, .category-book-meta .book-rating');
            if (ratingEl) {
                const icon = ratingEl.querySelector('i');
                if (icon) {
                    ratingEl.innerHTML = `<i class="fas fa-star" style="color:#ffd700;"></i> ${newRating.toFixed(1)}`;
                }
            }
        });
    }
}
// =============================================
// ⭐ تحديث دوري لكل التقييمات (كل 60 ثانية)
// =============================================
function startAutoRefreshRatings() {
    setInterval(() => {
        // تحديث البطاقات في الصفحة الرئيسية
        document.querySelectorAll('.book-card-horizontal[data-book-id]').forEach(card => {
            const bookId = card.getAttribute('data-book-id');
            if (!bookId) return;
            const book = booksDatabase.find(b => b.id == bookId);
            if (!book) return;
            
            const ratingSpan = card.querySelector('.book-rating, [style*="color:#ffd700"]');
            if (ratingSpan) {
                const icon = ratingSpan.querySelector('i');
                if (icon && icon.classList.contains('fa-star')) {
                    ratingSpan.innerHTML = `<i class="fas fa-star" style="color:#ffd700;"></i> ${book.rating.toFixed(1)}`;
                }
                
            }
            
        });
        
        
        // تحديث صفحة التصنيف إذا كانت مفتوحة
        const categoryBooksList = document.getElementById('categoryBooksList');
        if (categoryBooksList) {
            categoryBooksList.querySelectorAll('[data-book-id]').forEach(card => {
                const bookId = card.getAttribute('data-book-id');
                if (!bookId) return;
                const book = booksDatabase.find(b => b.id == bookId);
                if (!book) return;
                
                const ratingEl = card.querySelector('.book-rating');
                if (ratingEl) {
                    ratingEl.innerHTML = `<i class="fas fa-star" style="color:#ffd700;"></i> ${book.rating.toFixed(1)}`;
                }
            });
        }
    }, 60000); // كل 60 ثانية
}

// =============================================
// ⭐ زر إدارة التحميلات
// =============================================
// =============================================
// ⭐ نظام تحميل حقيقي مع شريط تقدم
// =============================================

let activeDownloads = {};

function downloadFile(url, filename, bookId, book) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        
        xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                const progressFill = document.getElementById(`progressFill-${bookId}`);
                const progressText = document.getElementById(`progressText-${bookId}`);
                if (progressFill) progressFill.style.width = percentComplete + '%';
                if (progressText) progressText.textContent = percentComplete + '%';
            }
        };
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = xhr.response;
                const link = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);
                
                let downloaded = JSON.parse(localStorage.getItem('raylob_downloaded') || '[]');
                if (!downloaded.includes(bookId.toString())) {
                    downloaded.push(bookId.toString());
                    localStorage.setItem('raylob_downloaded', JSON.stringify(downloaded));
                }
                
                const bookInDB = booksDatabase.find(b => b.id == bookId);
                if (bookInDB) {
                    bookInDB.downloads = (bookInDB.downloads || 0) + 1;
                }
                
                resolve();
            } else {
                reject(new Error('فشل التحميل'));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('حدث خطأ في الشبكة'));
        };
        
        xhr.send();
        activeDownloads[bookId] = xhr;
    });
}

function cancelDownload(bookId) {
    if (activeDownloads[bookId]) {
        activeDownloads[bookId].abort();
        delete activeDownloads[bookId];
        showToast('❌ تم إلغاء التحميل', 'warning', 2000);
        
        const progressDiv = document.getElementById(`progress-${bookId}`);
        if (progressDiv) progressDiv.style.display = 'none';
        
        const downloadBtn = document.getElementById(`downloadBtn-${bookId}`);
        const readOnlineBtn = document.getElementById(`readOnlineBtn-${bookId}`);
        if (downloadBtn) downloadBtn.style.display = 'flex';
        if (readOnlineBtn) readOnlineBtn.style.display = 'flex';
    }
}
document.getElementById('manageDownloadsBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    // فتح صفحة المحملة الكاملة
    openCategoryPage('المحملة');
    showToast('📥 إدارة التحميلات', 'success', 1000);
});



});

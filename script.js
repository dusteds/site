/* ==========================================================================
   1. Header Menu & Audio Effects
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.getElementById('sm-toggle-btn');
    var menuOverlay = document.getElementById('sm-menu');
    var menuLinks = document.querySelectorAll('.sm-menu-item');

    // Создаем базовый объект аудио для предзагрузки
    var baseAudio = new Audio('https://files.catbox.moe/l92p5m.mp3');
    baseAudio.preload = 'auto';

    function toggleMenu() {
        if (!menuOverlay || !toggleBtn) return;
        var isOpen = menuOverlay.classList.contains('is-open');
        if (isOpen) {
            menuOverlay.classList.remove('is-open');
            toggleBtn.classList.remove('is-active');
            document.body.style.overflow = '';
            toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            menuOverlay.classList.add('is-open');
            toggleBtn.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }
    menuLinks.forEach(function (link) {
        link.addEventListener('click', toggleMenu);
    });

    // Исправленная функция звука: клонируем аудио при каждом наведении
    var playHoverSound = function () {
        var soundClone = baseAudio.cloneNode();
        soundClone.volume = 0.5;
        soundClone.play().catch(function (e) {
            console.log("Audio blocked by browser autoplay policy");
        });
    };

    var logoLink = document.querySelector('.sm-logo-link');
    if (logoLink) {
        logoLink.addEventListener('mouseenter', playHoverSound);
    }

    menuLinks.forEach(function (link) {
        link.addEventListener('mouseenter', playHoverSound);
    });
});

/* ==========================================================================
   2. Dynamic Posts from Tilda RSS Feed
   ========================================================================== */
// ИСПРАВЛЕНИЕ ЗВУКА (клонирование для полифонии)
var basePostSound = new Audio('https://files.catbox.moe/p9pqjx.mp3');
basePostSound.preload = 'auto';

function playPostSound() {
    var soundClone = basePostSound.cloneNode();
    soundClone.volume = 0.4;
    soundClone.play().catch(function () { });
}

function loadTildaPosts() {
    var RSS_URL = '/rss-feed-274103449361.xml';

    fetch(RSS_URL)
        .then(function (response) { return response.text(); })
        .then(function (data) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(data, "text/xml");
            var items = xml.querySelectorAll("item");
            var container = document.getElementById('posts-container');

            if (!items.length || !container) return;

            // ОПТИМИЗАЦИЯ: Собираем весь HTML в переменную
            var allCardsHtml = '';

            for (var i = 0; i < Math.min(items.length, 3); i++) {
                var item = items[i];
                var title = item.querySelector("title") ? item.querySelector("title").textContent : "";
                var link = item.querySelector("link") ? item.querySelector("link").textContent : "#";

                var img = item.querySelector("enclosure") ? item.querySelector("enclosure").getAttribute('url') : "";
                if (!img) {
                    var content = item.querySelector("description") ? item.querySelector("description").textContent : "";
                    var imgMatch = content.match(/src="([^"]+)"/);
                    img = imgMatch ? imgMatch[1] : '';
                }

                var rawDesc = item.querySelector("description") ? item.querySelector("description").textContent : "";
                var desc = rawDesc.replace(/<[^>]*>/g, '').substring(0, 100).trim() + '...';

                var pubDate = item.querySelector("pubDate") ? item.querySelector("pubDate").textContent : "";
                var date = pubDate ? new Date(pubDate).toLocaleDateString('ru-RU') : "";

                allCardsHtml += '<a href="' + link + '" class="sm-card" onmouseenter="playPostSound()">' +
                    '<img src="' + img + '" alt="' + title + '">' +
                    '<div class="sm-card-content">' +
                    '<h2 class="sm-card-title">' + title + '</h2>' +
                    '<p class="sm-card-desc">' + desc + '</p>' +
                    '<span class="sm-card-date">' + date + '</span>' +
                    '</div>' +
                    '</a>';
            }

            // Вставляем всё разом (работает быстрее и не нагружает браузер)
            container.innerHTML = allCardsHtml;
        })
        .catch(function (err) { console.log("RSS Error:", err); });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTildaPosts);
} else {
    loadTildaPosts();
}

/* ==========================================================================
   3. Custom Footer & Newsletter Subscription
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

    const hoverSound = new Audio('https://files.catbox.moe/l92p5m.mp3');
    // Убрали иконки из списка "озвучиваемых" элементов
    const clickableElements = document.querySelectorAll('.t123 .subscribe-form button');

    clickableElements.forEach(function (element) {
        element.addEventListener('mouseenter', function () {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => { });
        });
    });

    // --- ИЗМЕНЕНИЕ 5: МЕНЯЕМ ТЕКСТ-ЗАГЛУШКУ НА МОБИЛЬНЫХ ---
    const customInput = document.querySelector('.t123 .custom-email-input');

    function updatePlaceholder() {
        if (!customInput) return;
        if (window.innerWidth <= 767) {
            customInput.placeholder = 'YOUR E-MAIL FOR UPDATES';
        } else {
            customInput.placeholder = 'YOUR E-MAIL FOR NEWSLETTER';
        }
    }

    // Вызываем функцию при загрузке и при изменении размера окна
    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);

    // Код для связки форм (без изменений)
    const customButton = document.querySelector('.t123 .custom-submit-button');
    const realFormWrapper = document.querySelector('.uc-hidden-form-wrapp');
    if (customButton && realFormWrapper) {
        const realInput = realFormWrapper.querySelector('input[name="Email"]');
        const realButton = realFormWrapper.querySelector('.t-submit');
        customButton.addEventListener('click', function () {
            if (realInput && realButton) {
                realInput.value = customInput ? customInput.value : '';
                realButton.click();
                if (customInput) {
                    customInput.placeholder = 'THANK YOU!';
                    customInput.value = '';
                }
            }
        });
    }
    /* ====================================================
   POSTS FEED & RSS LOADER
   ==================================================== */
    var basePostSound = new Audio('https://files.catbox.moe/p9pqjx.mp3');
    basePostSound.preload = 'auto';

    function playPostSound() {
        var soundClone = basePostSound.cloneNode();
        soundClone.volume = 0.4;
        soundClone.play().catch(function () { });
    }

    function loadTildaPosts() {
        var RSS_URL = '/rss-feed-274103449361.xml';

        fetch(RSS_URL)
            .then(function (response) { return response.text(); })
            .then(function (data) {
                var parser = new DOMParser();
                var xml = parser.parseFromString(data, "text/xml");
                var items = xml.querySelectorAll("item");
                var container = document.getElementById('posts-container');

                if (!container || !items.length) return;

                var allCardsHtml = '';

                for (var i = 0; i < Math.min(items.length, 3); i++) {
                    var item = items[i];
                    var title = item.querySelector("title") ? item.querySelector("title").textContent : "";
                    var link = item.querySelector("link") ? item.querySelector("link").textContent : "#";

                    var img = item.querySelector("enclosure") ? item.querySelector("enclosure").getAttribute('url') : "";
                    if (!img) {
                        var content = item.querySelector("description") ? item.querySelector("description").textContent : "";
                        var imgMatch = content.match(/src="([^"]+)"/);
                        img = imgMatch ? imgMatch[1] : '';
                    }

                    var rawDesc = item.querySelector("description") ? item.querySelector("description").textContent : "";
                    var desc = rawDesc.replace(/<[^>]*>/g, '').substring(0, 100).trim() + '...';

                    var pubDate = item.querySelector("pubDate") ? item.querySelector("pubDate").textContent : "";
                    var date = pubDate ? new Date(pubDate).toLocaleDateString('ru-RU') : "";

                    allCardsHtml += '<a href="' + link + '" class="sm-card" onmouseenter="playPostSound()">' +
                        '<img src="' + img + '" alt="' + title + '">' +
                        '<div class="sm-card-content">' +
                        '<h2 class="sm-card-title">' + title + '</h2>' +
                        '<p class="sm-card-desc">' + desc + '</p>' +
                        '<span class="sm-card-date">' + date + '</span>' +
                        '</div>' +
                        '</a>';
                }

                container.innerHTML = allCardsHtml;
            })
            .catch(function (err) { console.log("RSS Error:", err); });
    }

    // Запуск загрузки постов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTildaPosts);
    } else {
        loadTildaPosts();
    }
});
/* ====================================================
   FOOTER & EMAIL FORM PROXY
   ==================================================== */
function initFooter() {
    var hoverSound = new Audio('https://files.catbox.moe/l92p5m.mp3');
    var clickableElements = document.querySelectorAll('.t123 .subscribe-form button');

    clickableElements.forEach(function (element) {
        element.addEventListener('mouseenter', function () {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(function (e) { });
        });
    });

    var customInput = document.querySelector('.t123 .custom-email-input');
    if (customInput) {
        function updatePlaceholder() {
            if (window.innerWidth <= 767) {
                customInput.placeholder = 'YOUR E-MAIL FOR UPDATES';
            } else {
                customInput.placeholder = 'YOUR E-MAIL FOR NEWSLETTER';
            }
        }
        updatePlaceholder();
        window.addEventListener('resize', updatePlaceholder);
    }

    var customButton = document.querySelector('.t123 .custom-submit-button');
    var realFormWrapper = document.querySelector('.uc-hidden-form-wrapp');
    if (customButton && realFormWrapper && customInput) {
        var realInput = realFormWrapper.querySelector('input[name="Email"]');
        var realButton = realFormWrapper.querySelector('.t-submit');
        customButton.addEventListener('click', function () {
            if (realInput && realButton) {
                realInput.value = customInput.value;
                realButton.click();
                customInput.placeholder = 'THANK YOU!';
                customInput.value = '';
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}

function initBgVideo() {
    var video = document.querySelector('.sm-bg-video');
    if (video) {
        video.muted = true;
        video.playsInline = true;
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                document.addEventListener('click', function() { video.play(); }, { once: true });
            });
        }
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBgVideo);
} else {
    initBgVideo();
}

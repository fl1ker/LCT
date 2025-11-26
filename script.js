
document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-scroll");
        const target = document.getElementById(targetId);

        if (!target) return;

        // Учитываем высоту хедера (если он фиксированный)
        const headerHeight = document.querySelector("header").offsetHeight;

        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});



// ===== LANGUAGE SWITCH =====

async function loadLanguage(lang) {
    try {
        const res = await fetch(`./lang/${lang}.json`);
        const dict = await res.json();

        // text: <p data-i18n="key">
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (dict[key]) el.textContent = dict[key];
        });

        // placeholders: <input data-i18n-placeholder="key">
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (dict[key]) el.placeholder = dict[key];
        });

        // save language
        localStorage.setItem("lang", lang);

    } catch (e) {
        console.error("Language load error:", e);
    }
}

// Change language
const langSwitch = document.getElementById("lang-switch");
langSwitch.addEventListener("change", (e) => {
    loadLanguage(e.target.value);
});

// Load saved language or default RU
const savedLang = localStorage.getItem("lang") || "ru";
langSwitch.value = savedLang;
loadLanguage(savedLang);


// ========== EMAILJS FORM SUBMIT ==========
const form = document.getElementById("contactForm");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");

// Устанавливаем текущий язык в скрытое поле
document.getElementById("form_language").value = localStorage.getItem("lang") || "ru";

form.addEventListener("submit", function(event) {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    emailjs.sendForm(
        "service_fuzfvyf",
        "template_7x75zvd",
        form
    )
        .then(() => {
            result.style.color = "lightgreen";
            result.textContent = "Заявка успешно отправлена!";

            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = "Оставить заявку";
        })
        .catch((error) => {
            console.error("EmailJS error:", error);

            result.style.color = "red";
            result.textContent = "Ошибка отправки. Попробуйте позже.";

            submitBtn.disabled = false;
            submitBtn.textContent = "Оставить заявку";
        });
});

langSwitch.addEventListener("change", (e) => {
    loadLanguage(e.target.value);
    document.getElementById("form_language").value = e.target.value;
});

document.getElementById("footer-year").textContent = new Date().getFullYear();


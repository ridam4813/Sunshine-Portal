/* =========================================================
   SUNSHINE FACILITY MANAGEMENT SERVICES — MAIN SCRIPT
   Handles: mobile menu, booking modal, FAQ accordion,
   service search, WhatsApp form submission, scroll-to-top
========================================================= */

// ---------- CONFIG ----------
// Change this to your real WhatsApp business number (with country code, no + or spaces)
const WHATSAPP_NUMBER = "919993022184";

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       1) MOBILE MENU TOGGLE
    ========================================================= */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            nav.classList.toggle("nav-open");
            menuToggle.classList.toggle("active");
        });

        // Close mobile menu when a link is clicked
        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("nav-open");
                menuToggle.classList.remove("active");
            });
        });
    }

    // Dropdown toggle on mobile (tap to open submenu)
    document.querySelectorAll(".dropdown > a").forEach(function (dropdownLink) {
        dropdownLink.addEventListener("click", function (e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                this.parentElement.classList.toggle("dropdown-open");
            }
        });
    });


    /* =========================================================
       2) BOOKING MODAL — OPEN / CLOSE
    ========================================================= */
    const bookingModal = document.getElementById("bookingModal");
    const bookingClose = document.getElementById("bookingClose");
    const bookServiceSelect = document.getElementById("bookService");

    function openBookingModal(serviceName) {
        if (!bookingModal) return;
        bookingModal.classList.add("active");
        document.body.style.overflow = "hidden";

        if (serviceName && bookServiceSelect) {
            // Pre-select the service if it matches an existing option
            const options = Array.from(bookServiceSelect.options).map(o => o.value);
            if (options.includes(serviceName)) {
                bookServiceSelect.value = serviceName;
            }
        }
    }

    function closeBookingModal() {
        if (!bookingModal) return;
        bookingModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Any element with class "js-open-booking" opens the modal
    document.querySelectorAll(".js-open-booking").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const service = this.getAttribute("data-service") || "";
            openBookingModal(service);
        });
    });

    if (bookingClose) {
        bookingClose.addEventListener("click", closeBookingModal);
    }

    // Close modal when clicking outside the box
    if (bookingModal) {
        bookingModal.addEventListener("click", function (e) {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeBookingModal();
    });


    /* =========================================================
       3) BOOKING FORM -> SEND TO WHATSAPP
    ========================================================= */
    const bookingForm = document.getElementById("bookingWhatsappForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("bookName").value.trim();
            const phone = document.getElementById("bookPhone").value.trim();
            const service = document.getElementById("bookService").value;
            const date = document.getElementById("bookDate").value;
            const time = document.getElementById("bookTime").value;
            const rooms = document.getElementById("bookRooms").value.trim();
            const address = document.getElementById("bookAddress").value.trim();
            const message = document.getElementById("bookMessage").value.trim();

            // Basic validation
            if (!name || !phone || !service || !date || !time || !address) {
                showFormAlert(bookingForm, "Please fill all required fields marked with *");
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                showFormAlert(bookingForm, "Please enter a valid 10 digit mobile number");
                return;
            }

            // Build a clean WhatsApp message
            let text = "*New Booking Request*%0A";
            text += "------------------------------%0A";
            text += "*Name:* " + encodeURIComponent(name) + "%0A";
            text += "*Phone:* " + encodeURIComponent(phone) + "%0A";
            text += "*Service:* " + encodeURIComponent(service) + "%0A";
            text += "*Date:* " + encodeURIComponent(date) + "%0A";
            text += "*Time Slot:* " + encodeURIComponent(time) + "%0A";
            if (rooms) text += "*Rooms:* " + encodeURIComponent(rooms) + "%0A";
            text += "*Address:* " + encodeURIComponent(address) + "%0A";
            if (message) text += "*Note:* " + encodeURIComponent(message) + "%0A";

            const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;

            window.open(waUrl, "_blank");

            showFormAlert(bookingForm, "Booking sent! Opening WhatsApp...", true);

            setTimeout(function () {
                bookingForm.reset();
                closeBookingModal();
            }, 1200);
        });
    }


    /* =========================================================
       4) HOMEPAGE "FIND SERVICE" SEARCH -> OPENS BOOKING MODAL
       (pre-fills the service + adds city into the address field)
    ========================================================= */
    const searchForm = document.querySelector(".service-search form");

    if (searchForm) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const select = searchForm.querySelector("select");
            const cityInput = searchForm.querySelector('input[type="text"]');

            const service = select ? select.value : "";
            const city = cityInput ? cityInput.value.trim() : "";

            if (!service || service === "Select Service") {
                showFormAlert(searchForm, "Please select a service first");
                return;
            }

            openBookingModal(service);

            // Prefill city into the address box, if provided
            const addressField = document.getElementById("bookAddress");
            if (addressField && city) {
                addressField.value = city;
            }
        });
    }


    /* =========================================================
       5) CONTACT PAGE FORM -> SEND TO WHATSAPP
    ========================================================= */
    const contactForm = document.querySelector(".contact-form form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputs = contactForm.querySelectorAll("input, textarea");
            const fullName = inputs[0] ? inputs[0].value.trim() : "";
            const email = inputs[1] ? inputs[1].value.trim() : "";
            const phone = inputs[2] ? inputs[2].value.trim() : "";
            const msg = inputs[3] ? inputs[3].value.trim() : "";

            if (!fullName || !email || !phone) {
                showFormAlert(contactForm, "Please fill all required fields");
                return;
            }

            let text = "*New Contact Enquiry*%0A";
            text += "------------------------------%0A";
            text += "*Name:* " + encodeURIComponent(fullName) + "%0A";
            text += "*Email:* " + encodeURIComponent(email) + "%0A";
            text += "*Phone:* " + encodeURIComponent(phone) + "%0A";
            if (msg) text += "*Message:* " + encodeURIComponent(msg) + "%0A";

            const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text;
            window.open(waUrl, "_blank");

            showFormAlert(contactForm, "Message sent! Opening WhatsApp...", true);
            setTimeout(function () { contactForm.reset(); }, 1200);
        });
    }


    /* =========================================================
       6) FAQ ACCORDION
    ========================================================= */
    document.querySelectorAll(".faq-question").forEach(function (question) {
        question.addEventListener("click", function () {
            const item = this.parentElement;
            const isOpen = item.classList.contains("active");

            // Close all
            document.querySelectorAll(".faq-item").forEach(function (el) {
                el.classList.remove("active");
            });

            // Open clicked one (if it wasn't already open)
            if (!isOpen) {
                item.classList.add("active");
            }
        });
    });


    /* =========================================================
       7) SCROLL TO TOP BUTTON
    ========================================================= */
    const scrollTopBtn = document.querySelector(".scroll-top");

    if (scrollTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        });

        scrollTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =========================================================
       8) HEADER SHADOW ON SCROLL
    ========================================================= */
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

});


/* =========================================================
   HELPER: Small inline alert shown above a form
========================================================= */
function showFormAlert(formEl, msg, success) {
    let alertBox = formEl.querySelector(".form-alert");

    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.className = "form-alert";
        formEl.prepend(alertBox);
    }

    alertBox.textContent = msg;
    alertBox.classList.toggle("success", !!success);
    alertBox.classList.add("show");

    setTimeout(function () {
        alertBox.classList.remove("show");
    }, 3500);
}

const supabaseClient = window.supabase.createClient(
  window.CAREWELL_SUPABASE_CONFIG.url,
  window.CAREWELL_SUPABASE_CONFIG.publishableKey
);

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navLinks = document.querySelectorAll(".navigation a");
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");
const year = document.querySelector("#current-year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });
}

// This front-end demo opens the visitor's email app; it does not submit to a server.

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    const formData = new FormData(contactForm);

    const fullName = String(
      formData.get("fullName") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const subject = String(
      formData.get("subject") || ""
    ).trim();

    const message = String(
      formData.get("message") || ""
    ).trim();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry...";
    }

    if (formMessage) {
      formMessage.textContent = "Submitting your enquiry...";
    }

    try {
      const { error } = await supabaseClient
        .from("contact_enquiries")
        .insert([
          {
            full_name: fullName,
            email: email,
            subject: subject,
            message: message
          }
        ]);

      if (error) {
        throw error;
      }

      if (formMessage) {
        formMessage.textContent =
          "Thank you! Your enquiry was submitted successfully.";
      }

      contactForm.reset();

    } catch (error) {
      console.error("Enquiry submission failed:", error);

      if (formMessage) {
        formMessage.textContent =
          "Sorry, we could not submit your enquiry. Please try again.";
      }

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML =
          'Send enquiry <span aria-hidden="true">→</span>';
      }
    }
  });
}




document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const pageLinks = document.querySelectorAll("[data-page]");
  const navLinks = document.querySelectorAll(".nav-link");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navLinks");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const validPages = ["home", "cv", "projects", "contact"];

  // Change the visible page
  function showPage(pageName, updateHistory = true) {
    if (!validPages.includes(pageName)) {
      pageName = "home";
    }

    pages.forEach((page) => {
      page.classList.toggle("active", page.id === pageName);
    });

    navLinks.forEach((link) => {
      const isActive = link.dataset.page === pageName;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Close the mobile menu after navigation
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";

    // Support browser back/forward navigation
    if (updateHistory) {
      const newHash = "#" + pageName;

      if (window.location.hash !== newHash) {
        history.pushState({ page: pageName }, "", newHash);
      }
    }

    // Start each page at the top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Handle all navigation cards, buttons and links
  pageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Browser back and forward buttons
  window.addEventListener("popstate", () => {
    const pageName = window.location.hash.slice(1) || "home";
    showPage(pageName, false);
  });

  // Also handle direct hash changes
  window.addEventListener("hashchange", () => {
    const pageName = window.location.hash.slice(1) || "home";

    if (validPages.includes(pageName)) {
      showPage(pageName, false);
    } else {
      showPage("home", false);
    }
  });

  // Open the correct page when a visitor uses a direct URL
  const initialPage = window.location.hash.slice(1);
  showPage(validPages.includes(initialPage) ? initialPage : "home", false);

  // Update the copyright year automatically
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // Contact form: prepare an email using the visitor's email app
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const name = document.getElementById("senderName").value.trim();
    const email = document.getElementById("senderEmail").value.trim();
    const project = document.getElementById("projectType").value;
    const message = document.getElementById("message").value.trim();

    const recipient = "gyawaliabhiral179@gmail.com";
    const subject = `Project Inquiry: ${project}`;

    const body = [
      "Hello Abhiral,",
      "",
      "I would like to discuss a project with you.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Project Type: ${project}`,
      "",
      "Project Details:",
      message,
      "",
      "Sent through your Nexus Developer Portfolio."
    ].join("\n");

    const mailtoLink =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    formStatus.textContent =
      "Opening your email application. Please review and send the prepared message.";

    // This does not send email automatically.
    window.location.href = mailtoLink;
  });
});

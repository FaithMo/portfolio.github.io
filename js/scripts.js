const projectData = {
  "digital-vault": {
    tag: "Featured product work",
    title: "Digital Vault",
    description:
      "A banking service experience designed to help customers secure and maintain their trading and investment accounts.",
    details: [
      "Responsive product presentation",
      "Multi-screen workflow gallery",
      "Client product: Investec Bank"
    ],
    images: [
      "assets/img/portfolio/investec/Capture.PNG",
      "assets/img/portfolio/investec/Capture1.PNG",
      "assets/img/portfolio/investec/Capture2.PNG",
      "assets/img/portfolio/investec/Capture3.PNG",
      "assets/img/portfolio/investec/Capture4.PNG",
      "assets/img/portfolio/investec/Capture5.PNG"
    ],
    links: [
      {
        href: "https://www.investec.com/en_za.html",
        label: "Visit Investec",
        secondary: true
      }
    ]
  },
  "covid-dashboard": {
    tag: "Data storytelling",
    title: "Covid-19 Dashboard",
    description:
      "A dashboard built to visualize the spread of Covid-19 globally and in South Africa from the beginning of the pandemic onward.",
    details: [
      "Data visualization",
      "Global and regional trends",
      "Google Data Studio delivery"
    ],
    images: ["assets/img/dashboard.PNG"],
    links: [
      {
        href: "https://datastudio.google.com/u/0/reporting/1Yfvf2t6pwWwKK-9fptoI6W_T3MV8DcqQ/page/wLeKB",
        label: "Open dashboard"
      },
      {
        href: "https://github.com/Snap-Dashboard-Product-Covid19/covid-19_snap-dash",
        label: "View source",
        secondary: true
      }
    ]
  },
  "memory-game": {
    tag: "Interactive frontend",
    title: "Tile Matching Game",
    description:
      "A memory game built around tile manipulation, matching logic, and visible feedback for player progress.",
    details: [
      "Game interaction logic",
      "Frontend state handling",
      "Playable web deployment"
    ],
    images: ["assets/img/memory-game.PNG"],
    links: [
      {
        href: "https://faithmo.github.io/memory-game.github.io/",
        label: "Play project"
      },
      {
        href: "https://github.com/FaithMo/memory-game.github.io",
        label: "View source",
        secondary: true
      }
    ]
  },
  chatbot: {
    tag: "Conversational UX",
    title: "Chatbot",
    description:
      "A mock Umuzi.org bot designed to help potential recruits ask and answer application-related questions.",
    details: [
      "Conversational interface",
      "Recruitment information flow",
      "Prototype implementation"
    ],
    images: ["assets/img/bot.PNG"],
    links: [
      {
        href: "https://github.com/FaithMo/the-bot",
        label: "View source"
      }
    ]
  }
};

const body = document.body;
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const dialog = document.getElementById("project-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogTag = document.getElementById("dialog-tag");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogDetails = document.getElementById("dialog-details");
const dialogLinks = document.getElementById("dialog-links");
const galleryControls = document.getElementById("dialog-gallery-controls");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const yearTarget = document.getElementById("current-year");

let activeProject = null;
let activeImageIndex = 0;

function setScrolledState() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
}

function toggleMenu(forceOpen) {
  if (!navToggle || !navMenu) {
    return;
  }

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
  navMenu.classList.toggle("is-open", shouldOpen);
  body.classList.toggle("menu-open", shouldOpen);
}

function renderDialogImage() {
  if (!activeProject) {
    return;
  }

  const currentImage = activeProject.images[activeImageIndex];
  dialogImage.src = currentImage;
  dialogImage.alt = `${activeProject.title} screenshot ${activeImageIndex + 1}`;
}

function populateDialog(projectKey) {
  const project = projectData[projectKey];

  if (!project) {
    return;
  }

  activeProject = project;
  activeImageIndex = 0;

  dialogTag.textContent = project.tag;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;

  dialogDetails.innerHTML = "";
  project.details.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    dialogDetails.appendChild(item);
  });

  dialogLinks.innerHTML = "";
  project.links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;

    if (link.secondary) {
      anchor.classList.add("link-secondary");
    }

    dialogLinks.appendChild(anchor);
  });

  galleryControls.hidden = project.images.length < 2;
  renderDialogImage();
}

function showProject(projectKey) {
  if (!dialog) {
    return;
  }

  populateDialog(projectKey);
  dialog.showModal();
}

function cycleGallery(direction) {
  if (!activeProject || activeProject.images.length < 2) {
    return;
  }

  activeImageIndex = (activeImageIndex + direction + activeProject.images.length) % activeProject.images.length;
  renderDialogImage();
}

function setupRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  reveals.forEach((element) => observer.observe(element));
}

navToggle?.addEventListener("click", () => toggleMenu());

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => toggleMenu(false));
});

window.addEventListener("scroll", setScrolledState, { passive: true });

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    showProject(button.getAttribute("data-project"));
  });
});

galleryPrev?.addEventListener("click", () => cycleGallery(-1));
galleryNext?.addEventListener("click", () => cycleGallery(1));

dialog?.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    dialog.close();
  }
});

yearTarget.textContent = new Date().getFullYear();
setScrolledState();
setupRevealAnimations();

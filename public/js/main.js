// Main JavaScript file for BlogSite

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeNavigation()
  initializeAnimations()
  initializeTooltips()
  initializeModals()
  initializeFormValidation()
  initializeSearchFunctionality()

  // Auto-hide alerts after 5 seconds
  autoHideAlerts()

  // Initialize smooth scrolling
  initializeSmoothScrolling()

  // Initialize lazy loading for images
  initializeLazyLoading()
})

// Navigation functionality
function initializeNavigation() {
  const navbar = document.querySelector(".navbar")

  // Add scroll effect to navbar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled")
    } else {
      navbar.classList.remove("navbar-scrolled")
    }
  })

  // Mobile menu toggle
  const navbarToggler = document.querySelector(".navbar-toggler")
  const navbarCollapse = document.querySelector(".navbar-collapse")

  if (navbarToggler) {
    navbarToggler.addEventListener("click", () => {
      navbarCollapse.classList.toggle("show")
    })
  }
}

// Animation functionality
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".blog-card, .category-card, .stats-card").forEach((el) => {
    observer.observe(el)
  })
}

// Initialize tooltips
function initializeTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.map((tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl))
}

// Initialize modals
function initializeModals() {
  // Auto-focus on modal inputs when opened
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("shown.bs.modal", () => {
      const firstInput = modal.querySelector("input, textarea")
      if (firstInput) {
        firstInput.focus()
      }
    })
  })
}

// Form validation
function initializeFormValidation() {
  const forms = document.querySelectorAll("form[novalidate]")

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add("was-validated")
    })

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateField(input)
      })

      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) {
          validateField(input)
        }
      })
    })
  })
}

// Validate individual field
function validateField(field) {
  const isValid = field.checkValidity()

  if (isValid) {
    field.classList.remove("is-invalid")
    field.classList.add("is-valid")
  } else {
    field.classList.remove("is-valid")
    field.classList.add("is-invalid")
  }

  return isValid
}

// Search functionality
function initializeSearchFunctionality() {
  const searchInputs = document.querySelectorAll('input[type="search"], #searchInput')

  searchInputs.forEach((input) => {
    let searchTimeout

    input.addEventListener("input", () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        performSearch(input.value)
      }, 300)
    })
  })
}

// Perform search
function performSearch(query) {
  if (query.length < 2) return

  // Simulate search functionality
  console.log("Searching for:", query)

  // In a real application, this would make an API call
  // For demo purposes, we'll just log the search term
}

// Auto-hide alerts
function autoHideAlerts() {
  const alerts = document.querySelectorAll(".alert:not(.alert-permanent)")

  alerts.forEach((alert) => {
    setTimeout(() => {
      const bsAlert = new window.bootstrap.Alert(alert)
      bsAlert.close()
    }, 5000)
  })
}

// Smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Lazy loading for images
function initializeLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

// Utility functions
function showToast(message, type = "info") {
  const toastContainer = document.querySelector(".toast-container")
  if (!toastContainer) return

  const toastHtml = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-info-circle text-${type} me-2"></i>
                <strong class="me-auto">BlogSite</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `

  toastContainer.insertAdjacentHTML("beforeend", toastHtml)
  const toast = toastContainer.lastElementChild
  const bsToast = new window.bootstrap.Toast(toast)
  bsToast.show()

  // Remove toast element after it's hidden
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove()
  })
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export functions for use in other files
window.BlogSite = {
  showToast,
  formatDate,
  truncateText,
  debounce,
  validateField,
  performSearch,
}

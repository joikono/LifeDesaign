function openOverlay(contentId) {
    scrollPosition = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
    document.getElementById(contentId).style.display = "block";
}

function closeOverlay(contentId) {
    document.getElementById(contentId).style.display = "none";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition); 
}

window.addEventListener("click", function (event) {
    const overlays = document.querySelectorAll(".overlay");
    overlays.forEach((overlay) => {
      if (event.target === overlay) {
        closeOverlay(overlay.id);
      }
    });
});

// Function to load the overlay HTML content
function loadPrivacyOverlay() {
  fetch('privacy-overlay.html')
    .then(response => response.text())
    .then(data => {
      // Insert the loaded overlay content into the body
      const body = document.body;
      const overlayContainer = document.createElement('div');
      overlayContainer.innerHTML = data;
      body.appendChild(overlayContainer);
    })
    .catch(error => {
      console.error('Error loading overlay:', error);
    });
}

function loadContactOverlay() {
    fetch('contact-overlay.html')
      .then(response => response.text())
      .then(data => {
        // Insert the loaded overlay content into the body
        const body = document.body;
        const overlayContainer = document.createElement('div');
        overlayContainer.innerHTML = data;
        body.appendChild(overlayContainer);
      })
      .catch(error => {
        console.error('Error loading overlay:', error);
      });
  }

// Combine both functions in a single window.onload handler
window.onload = function() {
  loadPrivacyOverlay();  // Load privacy overlay
  loadContactOverlay();  // Load contact overlay
};

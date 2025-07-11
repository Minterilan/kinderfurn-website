document.querySelector(".icon-menu").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Product Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleries = document.querySelectorAll('.product-item__gallery');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.product-gallery__main img');
        const thumbnails = gallery.querySelectorAll('.product-gallery__thumbnail');
        
        if (thumbnails.length > 0) {
            // Set first thumbnail as active
            thumbnails[0].classList.add('active');
            
            thumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', function() {
                    // Remove active class from all thumbnails
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));
                    
                    // Add active class to clicked thumbnail
                    this.classList.add('active');
                    
                    // Change main image source
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                });
            });
        }
    });
});

// Image Modal Functionality with Touch/Swipe Support
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.querySelector('.image-modal__image');
    const modalCaption = document.querySelector('.image-modal__caption');
    const closeBtn = document.querySelector('.image-modal__close');
    const prevBtn = document.querySelector('.image-modal__prev');
    const nextBtn = document.querySelector('.image-modal__next');
    
    let currentGallery = null;
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Touch/Swipe variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    // Add click handlers to all gallery images
    const allGalleryImages = document.querySelectorAll('.product-gallery__main img, .product-gallery__thumbnail');
    
    allGalleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Find the current gallery (product)
            currentGallery = this.closest('.product-item__gallery');
            
            // Get all images in this specific gallery
            const allImages = Array.from(currentGallery.querySelectorAll('.product-gallery__main img, .product-gallery__thumbnail'));
            
            // Remove duplicates by creating a unique array based on src
            const uniqueImages = [];
            const seenSources = new Set();
            
            allImages.forEach(image => {
                if (!seenSources.has(image.src)) {
                    seenSources.add(image.src);
                    uniqueImages.push(image);
                }
            });
            
            galleryImages = uniqueImages;
            
            // Find current image index
            currentImageIndex = galleryImages.findIndex(galleryImg => galleryImg.src === this.src);
            
            openModal();
        });
    });
    
    function openModal() {
        const currentImg = galleryImages[currentImageIndex];
        modal.style.display = 'block';
        modalImg.src = currentImg.src;
        modalImg.alt = currentImg.alt;
        modalCaption.textContent = currentImg.alt;
        
        // Update navigation buttons visibility
        updateNavigationButtons();
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
    
    function updateNavigationButtons() {
        // Hide/show navigation buttons based on current position
        prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
    }
    
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const currentImg = galleryImages[currentImageIndex];
            modalImg.src = currentImg.src;
            modalImg.alt = currentImg.alt;
            modalCaption.textContent = currentImg.alt;
            updateNavigationButtons();
        }
    }
    
    function showNextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            const currentImg = galleryImages[currentImageIndex];
            modalImg.src = currentImg.src;
            modalImg.alt = currentImg.alt;
            modalCaption.textContent = currentImg.alt;
            updateNavigationButtons();
        }
    }
    
    // Navigation button event listeners
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (modal.style.display === 'block') {
            switch(event.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Touch/Swipe functionality for mobile
    if (modalImg) {
        modalImg.addEventListener('touchstart', function(event) {
            if (modal.style.display === 'block') {
                touchStartX = event.changedTouches[0].clientX;
                touchStartY = event.changedTouches[0].clientY;
                isSwiping = true;
                
                // Add visual feedback
                this.style.transform = 'scale(0.98)';
                this.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });
        
        modalImg.addEventListener('touchmove', function(event) {
            if (!isSwiping || modal.style.display !== 'block') return;
            
            event.preventDefault(); // Prevent page scroll during swipe
            
            const currentX = event.changedTouches[0].clientX;
            const deltaX = currentX - touchStartX;
            
            // Visual feedback during swipe
            const maxTransform = 50;
            const transform = Math.max(-maxTransform, Math.min(maxTransform, deltaX * 0.3));
            this.style.transform = `translateX(${transform}px) scale(0.98)`;
            
            // Change opacity based on swipe distance
            const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 300);
            this.style.opacity = opacity;
        }, { passive: false });
        
        modalImg.addEventListener('touchend', function(event) {
            if (!isSwiping || modal.style.display !== 'block') return;
            
            touchEndX = event.changedTouches[0].clientX;
            touchEndY = event.changedTouches[0].clientY;
            
            // Reset visual feedback
            this.style.transform = 'translateX(0) scale(1)';
            this.style.opacity = '1';
            this.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            
            // Calculate swipe distance and direction
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            // Minimum swipe distance (in pixels)
            const minSwipeDistance = 50;
            
            // Ensure horizontal swipe is more significant than vertical
            if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
                if (deltaX > 0) {
                    // Swipe right - show previous image
                    showPreviousImage();
                    
                    // Add swipe animation feedback
                    this.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        this.style.transform = 'translateX(0)';
                    }, 200);
                } else {
                    // Swipe left - show next image
                    showNextImage();
                    
                    // Add swipe animation feedback
                    this.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        this.style.transform = 'translateX(0)';
                    }, 200);
                }
            }
            
            // Reset swipe tracking
            isSwiping = false;
            touchStartX = 0;
            touchStartY = 0;
            touchEndX = 0;
            touchEndY = 0;
            
            // Remove transition after animation
            setTimeout(() => {
                this.style.transition = '';
            }, 300);
        }, { passive: true });
        
        // Prevent context menu on long press for better mobile experience
        modalImg.addEventListener('contextmenu', function(event) {
            if (modal.style.display === 'block') {
                event.preventDefault();
            }
        });
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentGallery = null;
        galleryImages = [];
        currentImageIndex = 0;
        
        // Reset any lingering styles
        if (modalImg) {
            modalImg.style.transform = '';
            modalImg.style.opacity = '';
            modalImg.style.transition = '';
        }
    }
});

// Projects Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('projectsPrev');
    const nextBtn = document.getElementById('projectsNext');
    const projectsTrack = document.querySelector('.projects__track');
    const projectItems = document.querySelectorAll('.projects__item');
    
    let currentIndex = 0;
    const totalProjects = projectItems.length;
    const itemWidth = 33.333; // Each item takes 33.333% width
    
    function updateSlider() {
        // Calculate the transform value to show 3 items starting from currentIndex
        const translateX = -(currentIndex * itemWidth);
        projectsTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update navigation buttons
        updateProjectNavigation();
    }
    
    function updateProjectNavigation() {
        // Show/hide navigation buttons based on current position
        prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.5';
        nextBtn.style.opacity = currentIndex < totalProjects - 3 ? '1' : '0.5';
        
        prevBtn.style.cursor = currentIndex > 0 ? 'pointer' : 'not-allowed';
        nextBtn.style.cursor = currentIndex < totalProjects - 3 ? 'pointer' : 'not-allowed';
    }
    
    function showPreviousProject() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    function showNextProject() {
        if (currentIndex < totalProjects - 3) {
            currentIndex++;
            updateSlider();
        }
    }
    
    // Event listeners
    if (prevBtn && nextBtn && projectsTrack) {
        prevBtn.addEventListener('click', showPreviousProject);
        nextBtn.addEventListener('click', showNextProject);
        
        // Initialize
        updateProjectNavigation();
    }
});

// Ripple Effect for Buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button, .main__button, .item-services__button, .actions-header__button, .outro__button, .about__button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    function createRipple(event, button) {
        // Remove any existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Get button dimensions and position
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // Set ripple styles
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Add ripple to button
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Enhanced Product Cards Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Product card hover effects are handled by CSS
    
    // Thumbnail hover functionality for product galleries
    const productGalleries = document.querySelectorAll('.product-item__gallery');
    
    productGalleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.product-gallery__main img');
        const thumbnails = gallery.querySelectorAll('.product-gallery__thumbnail');
        
        if (mainImage && thumbnails.length > 0) {
            // Store original main image src
            const originalSrc = mainImage.src;
            
            thumbnails.forEach((thumbnail, index) => {
                // Add hover effect for thumbnail to main image swap
                thumbnail.addEventListener('mouseenter', function() {
                    // Remove active class from all thumbnails
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));
                    
                    // Add active class to current thumbnail
                    this.classList.add('active');
                    
                    // Change main image with smooth transition
                    mainImage.style.opacity = '0.7';
                    
                    setTimeout(() => {
                        mainImage.src = this.src;
                        mainImage.style.opacity = '1';
                    }, 150);
                });
                
                // Click to select thumbnail permanently
                thumbnail.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all thumbnails
                    thumbnails.forEach(thumb => thumb.classList.remove('active'));
                    
                    // Add active class to clicked thumbnail
                    this.classList.add('active');
                    
                    // Update main image
                    mainImage.src = this.src;
                });
            });
            
            // Reset to first thumbnail on gallery hover leave
            gallery.addEventListener('mouseleave', function() {
                if (!gallery.querySelector('.product-gallery__thumbnail.active')) {
                    mainImage.style.opacity = '0.7';
                    setTimeout(() => {
                        mainImage.src = originalSrc;
                        mainImage.style.opacity = '1';
                    }, 150);
                }
            });
        }
    });
    
    // Enhanced product card animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                entry.target.classList.add('product-item--visible');
            }
        });
    }, observerOptions);
    
    // Observe all product items
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        observer.observe(item);
    });
});

// Custom Furniture Design Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Interactive Process Steps
    const processSteps = document.querySelectorAll('.interactive-step');
    const progressBar = document.querySelector('.process-progress-bar');
    
    if (processSteps.length > 0 && progressBar) {
        processSteps.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.dataset.step);
                
                // Remove active class from all steps
                processSteps.forEach(s => {
                    s.classList.remove('active');
                    const number = s.querySelector('.custom-step__number');
                    const title = s.querySelector('h4');
                    const detail = s.querySelector('.step-detail');
                    
                    if (number) number.style.background = 'var(--neutral-medium)';
                    if (number) number.style.boxShadow = 'none';
                    if (title) title.style.color = 'var(--neutral-medium)';
                    if (detail) {
                        detail.style.opacity = '0';
                        detail.style.maxHeight = '0';
                    }
                });
                
                // Add active class to clicked step
                this.classList.add('active');
                const number = this.querySelector('.custom-step__number');
                const title = this.querySelector('h4');
                const detail = this.querySelector('.step-detail');
                
                if (number) {
                    number.style.background = 'var(--primary-dark)';
                    number.style.boxShadow = '0 4px 15px rgba(139, 115, 85, 0.3)';
                }
                if (title) title.style.color = 'var(--primary-dark)';
                if (detail) {
                    detail.style.opacity = '1';
                    detail.style.maxHeight = '200px';
                }
                
                // Update progress bar
                const progressWidth = (stepNumber / 4) * 100;
                progressBar.style.width = progressWidth + '%';
            });
        });
    }
    
    // Interactive Feature Cards
    const featureCards = document.querySelectorAll('.interactive-feature-card');
    
    featureCards.forEach(card => {
        const icon = card.querySelector('.interactive-icon');
        const detail = card.querySelector('.feature-detail');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(10deg)';
                icon.style.background = 'var(--accent-warm)';
            }
            if (detail) {
                detail.style.top = '0';
                detail.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.08)';
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
                icon.style.background = 'var(--primary-light)';
            }
            if (detail) {
                detail.style.top = '100%';
                detail.style.opacity = '0';
            }
        });
    });
    

});

// Mobile Viewport Height Fix for iOS Safari and other mobile browsers
function setVHProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the property on load
setVHProperty();

// Update the property when the viewport changes
window.addEventListener('resize', setVHProperty);
window.addEventListener('orientationchange', function() {
    // Delay to ensure the viewport has settled after orientation change
    setTimeout(setVHProperty, 100);
});

// Additional fix for mobile browsers
document.addEventListener('DOMContentLoaded', function() {
    // Force recalculation after DOM is loaded
    setTimeout(setVHProperty, 100);
    
    // Additional mobile viewport adjustments
    if (window.innerWidth <= 768) {
        const outroSection = document.querySelector('.outro_home');
        if (outroSection) {
            // Ensure full height on mobile
            outroSection.style.minHeight = '100vh';
            outroSection.style.height = '100vh';
            
            // iOS Safari specific fix
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                outroSection.style.minHeight = '-webkit-fill-available';
            }
        }
    }
});

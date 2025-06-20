import FullReload from 'vite-plugin-full-reload';
import { defineConfig } from 'vite';
// Global variables
let selectedFile = null;

// DOM elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadContent = document.getElementById('uploadContent');
const previewContent = document.getElementById('previewContent');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const predictButton = document.getElementById('predictButton');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultsModal = document.getElementById('resultsModal');

// File upload handling
if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
}

if (uploadArea) {
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showError('Please select a valid image file (JPEG, PNG, GIF, BMP, WEBP)');
        return;
    }
    
    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB');
        return;
    }
    
    selectedFile = file;
    hideError();
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        fileName.textContent = `Selected: ${file.name}`;
        
        // Show preview, hide upload content
        uploadContent.style.display = 'none';
        previewContent.style.display = 'block';
        
        // Enable predict button
        predictButton.disabled = false;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    selectedFile = null;
    fileInput.value = '';
    
    // Show upload content, hide preview
    uploadContent.style.display = 'block';
    previewContent.style.display = 'none';
    
    // Disable predict button
    predictButton.disabled = true;
    hideError();
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function predictImage() {
    if (!selectedFile) {
        showError('Please select an image first');
        return;
    }
    
    // Show loading state
    const buttonText = document.getElementById('buttonText');
    const loadingIcon = document.getElementById('loadingIcon');
    
    buttonText.textContent = 'Processing...';
    loadingIcon.style.display = 'inline-block';
    predictButton.disabled = true;
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Send request to Flask backend
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showResults(data);
        } else {
            showError(data.error || 'Classification failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Network error. Please try again.');
    })
    .finally(() => {
        // Reset button state
        buttonText.textContent = 'PREDICT';
        loadingIcon.style.display = 'none';
        predictButton.disabled = false;
    });
}

function showResults(data) {
    const { prediction, filename, image_data } = data;
    
    // Set result image
    const resultImage = document.getElementById('resultImage');
    const resultFileName = document.getElementById('resultFileName');
    resultImage.src = `data:image/jpeg;base64,${image_data}`;
    resultFileName.textContent = filename;
    
    // Set category information
    const categoryInfo = getCategoryInfo(prediction);
    const resultCategory = document.getElementById('resultCategory');
    const categoryIcon = document.getElementById('categoryIcon');
    const categoryText = document.getElementById('categoryText');
    const categoryDescription = document.getElementById('categoryDescription');
    const actionsList = document.getElementById('actionsList');
    
    // Update category display
    resultCategory.className = `result-category ${categoryInfo.className}`;
    categoryIcon.className = categoryInfo.icon;
    categoryText.textContent = prediction;
    categoryDescription.textContent = categoryInfo.description;
    
    // Update actions list
    actionsList.innerHTML = '';
    categoryInfo.actions.forEach(action => {
        const actionItem = document.createElement('div');
        actionItem.className = 'action-item';
        actionItem.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${action}</span>
        `;
        actionsList.appendChild(actionItem);
    });
    
    // Show modal
    resultsModal.style.display = 'block';
}

function getCategoryInfo(category) {
    switch (category) {
        case 'Biodegradable':
            return {
                className: 'biodegradable',
                icon: 'fas fa-leaf',
                description: 'This item is biodegradable and can naturally decompose. Consider composting or organic waste disposal.',
                actions: [
                    'Add to compost bin',
                    'Dispose in organic waste collection',
                    'Use for garden composting if applicable'
                ]
            };
        case 'Recyclable':
            return {
                className: 'recyclable',
                icon: 'fas fa-recycle',
                description: 'This item can be recycled. Please clean it and place it in the appropriate recycling bin.',
                actions: [
                    'Clean the item thoroughly',
                    'Place in recycling bin',
                    'Check local recycling guidelines'
                ]
            };
        case 'Trash':
            return {
                className: 'trash',
                icon: 'fas fa-trash',
                description: 'This item should be disposed of as regular trash. It cannot be recycled or composted.',
                actions: [
                    'Place in general waste bin',
                    'Dispose according to local regulations',
                    'Consider alternatives for future purchases'
                ]
            };
        default:
            return {
                className: 'trash',
                icon: 'fas fa-question-circle',
                description: 'Classification result not available.',
                actions: ['Please try uploading the image again']
            };
    }
}

function closeModal() {
    resultsModal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === resultsModal) {
        closeModal();
    }
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(event) {
    event.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
    }, 1000);
}

function resetForm() {
    contactForm.style.display = 'block';
    successMessage.style.display = 'none';
    contactForm.reset();
}

// Navigation active state
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.color = '#059669';
            link.style.backgroundColor = '#ecfdf5';
        }
    });
});
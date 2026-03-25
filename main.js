// MediConnect Main JavaScript Module
// Shared functionality across all pages

class MediConnect {
    constructor() {
        this.currentUser = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.loadUserPreferences();
        this.initializeAnimations();
    }

    // Global Event Listeners
    setupGlobalEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-navigate]')) {
                const url = e.target.getAttribute('data-navigate');
                this.navigateTo(url);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.mediconnect-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });

        // Handle loading states
        document.addEventListener('DOMContentLoaded', () => {
            this.hideGlobalLoader();
        });

        // Handle responsive navigation
        this.setupMobileNavigation();
    }

    // Navigation
    navigateTo(url) {
        if (url.startsWith('#')) {
            // Handle anchor links
            const element = document.querySelector(url);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Handle page navigation
            window.location.href = url;
        }
    }

    // User Preferences
    loadUserPreferences() {
        const preferences = localStorage.getItem('mediconnect_preferences');
        if (preferences) {
            this.userPreferences = JSON.parse(preferences);
        } else {
            this.userPreferences = {
                theme: 'light',
                notifications: true,
                location: null,
                preferredSpecialties: []
            };
        }
    }

    saveUserPreferences() {
        localStorage.setItem('mediconnect_preferences', JSON.stringify(this.userPreferences));
    }

    // Form Handling
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());

        // Basic validation
        if (this.validateForm(form, formObject)) {
            this.submitFormData(formObject, form.getAttribute('data-endpoint') || 'default');
        }
    }

    validateForm(form, data) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!data[field.name] || data[field.name].trim() === '') {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        return isValid;
    }

    submitFormData(data, endpoint) {
        this.showGlobalLoader();

        // Simulate API call
        setTimeout(() => {
            this.hideGlobalLoader();
            this.showToast('Form submitted successfully!', 'success');
        }, 1500);
    }

    // Field Validation
    showFieldError(field, message) {
        this.clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-600 text-sm mt-1 field-error';
        errorDiv.textContent = message;

        field.parentNode.appendChild(errorDiv);
        field.classList.add('border-red-500');
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('border-red-500');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = this.createToast(message, type);
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="flex items-center">
                ${icon}
                <span>${message}</span>
            </div>
        `;

        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
            error: '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
            warning: '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
            info: '<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
        };

        return icons[type] || icons.info;
    }

    // Loading States
    showGlobalLoader() {
        if (this.isLoading) return;

        this.isLoading = true;
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
                <span class="text-gray-700">Loading...</span>
            </div>
        `;

        document.body.appendChild(loader);
    }

    hideGlobalLoader() {
        this.isLoading = false;
        const loader = document.getElementById('global-loader');
        if (loader) {
            document.body.removeChild(loader);
        }
    }

    // Mobile Navigation
    setupMobileNavigation() {
        // Handle mobile menu toggle
        const mobileMenuBtn = document.querySelector('[data-mobile-menu]');
        const mobileMenu = document.querySelector('[data-mobile-menu-content]');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Animations
    initializeAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('[data-animate], [data-animate-group]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const groupType = element.getAttribute('data-animate-group');
        if (groupType) {
            this.animateGroup(element, groupType);
            return;
        }

        const animationType = element.getAttribute('data-animate');

        switch (animationType) {
            case 'fade-up':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                break;
            case 'fade-in':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'easeOutQuart'
                });
                break;
            case 'scale':
                anime({
                    targets: element,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 600,
                    easing: 'easeOutBack'
                });
                break;
        }
    }

    animateGroup(container, groupType) {
        const items = Array.from(container.children).filter(child => child.nodeType === 1);
        if (!items.length) return;

        const base = {
            targets: items,
            opacity: [0, 1],
            translateY: [12, 0],
            delay: anime.stagger(80),
            duration: 600,
            easing: 'easeOutQuart'
        };

        switch (groupType) {
            case 'fade-up':
                anime(base);
                break;
            case 'scale':
                anime({
                    ...base,
                    scale: [0.96, 1]
                });
                break;
            default:
                anime(base);
        }
    }

    // Data Management
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    }

    // Utility Functions
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const locale = typeof getCurrentLocale === 'function' ? getCurrentLocale() : 'en-US';
        return new Date(date).toLocaleDateString(locale, { ...defaultOptions, ...options });
    }

    formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;

        return `${displayHour}:${minutes} ${ampm}`;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error Handling
    handleError(error, context = '') {
        console.error(`MediConnect Error ${context}:`, error);
        this.showToast('An error occurred. Please try again.', 'error');
    }

    // API Simulation
    async simulateApiCall(data, delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: data,
                    message: 'Operation completed successfully'
                });
            }, delay);
        });
    }
}

class MediLabAI {
    constructor() {
        this.endpoint = 'https://api.deepseek.com/v1/chat/completions';
        this.model = 'deepseek-chat';
        this.keyStorageKey = 'medilab_api_key';
        this.initPanels();
        this.init3DModule();
    }

    initPanels() {
        const panels = document.querySelectorAll('[data-medilab-panel]');
        if (!panels.length) return;

        panels.forEach(panel => {
            const form = panel.querySelector('form');
            const input = panel.querySelector('[data-medilab-input]');
            const output = panel.querySelector('[data-medilab-output]');
            const keyInput = panel.querySelector('[data-medilab-key]');
            const saveKeyBtn = panel.querySelector('[data-medilab-save-key]');
            const keyEntry = panel.querySelector('[data-medilab-key-entry]');
            const applyBtn = panel.querySelector('[data-medilab-apply]');
            const sampleButtons = panel.querySelectorAll('[data-medilab-sample]');

            this.updateKeyStatus(panel);
            if (keyEntry) {
                keyEntry.classList.toggle('hidden', Boolean(this.getApiKey()));
            }

            if (sampleButtons.length && input) {
                sampleButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        input.value = button.getAttribute('data-medilab-sample') || '';
                        input.focus();
                    });
                });
            }

            if (saveKeyBtn && keyInput) {
                saveKeyBtn.addEventListener('click', () => {
                    const value = keyInput.value.trim();
                    if (!value) return;
                    this.saveApiKey(value);
                    keyInput.value = '';
                    this.updateAllKeyStatus();
                    if (keyEntry) {
                        keyEntry.classList.add('hidden');
                    }
                    if (window.mediconnect) {
                        window.mediconnect.showToast('MediLab AI key saved.', 'success');
                    }
                });
            }

            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    const filters = panel.dataset.medilabFilters;
                    if (!filters) return;
                    this.applyFilters(JSON.parse(filters));
                });
            }

            if (form && input && output) {
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const userInput = input.value.trim();
                    if (!userInput) return;

                    output.innerHTML = '<p class="text-gray-500 text-sm">Thinking...</p>';

                    const intent = panel.dataset.medilabIntent || 'general';
                    const context = this.parseContext(panel.dataset.medilabContext);
                    const prompt = this.buildPrompt(intent, userInput, context);
                    const response = await this.requestCompletion(prompt, intent);

                    const formatted = this.formatResponse(intent, response);
                    output.innerHTML = formatted.html;
                    if (formatted.filters) {
                        panel.dataset.medilabFilters = JSON.stringify(formatted.filters);
                    }
                });
            }
        });
    }

    parseContext(contextString) {
        if (!contextString) return null;
        try {
            return JSON.parse(contextString);
        } catch (error) {
            return null;
        }
    }

    getApiKey() {
        const stored = localStorage.getItem(this.keyStorageKey);
        if (stored) return stored;
        if (window.__MEDILAB_ENV__ && window.__MEDILAB_ENV__.deepseek_api_key) {
            return window.__MEDILAB_ENV__.deepseek_api_key;
        }
        if (window.MEDILAB_API_KEY) return window.MEDILAB_API_KEY;
        return '';
    }

    saveApiKey(key) {
        localStorage.setItem(this.keyStorageKey, key);
    }

    updateKeyStatus(panel) {
        const status = panel.querySelector('[data-medilab-key-status]');
        if (!status) return;
        status.textContent = this.getApiKey() ? 'MediLab AI active' : 'MediLab AI inactive';
    }

    updateAllKeyStatus() {
        document.querySelectorAll('[data-medilab-panel]').forEach(panel => {
            this.updateKeyStatus(panel);
            const keyEntry = panel.querySelector('[data-medilab-key-entry]');
            if (keyEntry) {
                keyEntry.classList.toggle('hidden', Boolean(this.getApiKey()));
            }
        });
    }

    buildPrompt(intent, userInput, context) {
        const base = `You are MediLab AI, a healthcare experience assistant. Provide concise, supportive guidance and avoid diagnosing.`;
        const contextLine = context ? `Context: ${JSON.stringify(context)}.` : '';

        switch (intent) {
            case 'triage':
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: summary, urgency, specialty, next_steps (array), red_flags (array).`;
            case 'match':
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: summary, specialty, rating_min, availability, location, reasoning.`;
            case 'profile':
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: summary, questions (array), preparation (array).`;
            case 'prep':
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: checklist (array), documents (array), questions (array).`;
            case 'ops':
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: highlights (array), risks (array), recommendations (array).`;
            default:
                return `${base} ${contextLine} User input: "${userInput}". Return JSON with keys: summary, actions (array).`;
        }
    }

    async requestCompletion(prompt, intent) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            return this.fallbackResponse(intent);
        }

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: 'You are MediLab AI.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.4
                })
            });

            if (!response.ok) {
                return this.fallbackResponse(intent);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            return this.safeJsonParse(content) || this.fallbackResponse(intent);
        } catch (error) {
            return this.fallbackResponse(intent);
        }
    }

    safeJsonParse(value) {
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch (error) {
            const match = value.match(/\{[\s\S]*\}/);
            if (!match) return null;
            try {
                return JSON.parse(match[0]);
            } catch (innerError) {
                return null;
            }
        }
    }

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    formatResponse(intent, response) {
        if (!response || typeof response !== 'object') {
            return { html: '<p class="text-gray-500 text-sm">No response available.</p>' };
        }

        switch (intent) {
            case 'triage':
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <p class="font-semibold text-gray-900">${this.escapeHtml(response.summary || 'Summary unavailable.')}</p>
                            <p><span class="font-semibold">Urgency:</span> ${this.escapeHtml(response.urgency || 'Standard')}</p>
                            <p><span class="font-semibold">Suggested Specialty:</span> ${this.escapeHtml(response.specialty || 'General Care')}</p>
                            <div>
                                <p class="font-semibold">Next Steps</p>
                                <ul class="list-disc pl-5">
                                    ${(response.next_steps || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold text-red-600">Red Flags</p>
                                <ul class="list-disc pl-5 text-red-600">
                                    ${(response.red_flags || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `
                };
            case 'match':
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <p class="font-semibold text-gray-900">${this.escapeHtml(response.summary || 'Recommendations ready.')}</p>
                            <p><span class="font-semibold">Specialty:</span> ${this.escapeHtml(response.specialty || 'General Care')}</p>
                            <p><span class="font-semibold">Minimum Rating:</span> ${this.escapeHtml(String(response.rating_min || '4.0'))}</p>
                            <p><span class="font-semibold">Availability:</span> ${this.escapeHtml(response.availability || 'Any Time')}</p>
                            <p><span class="font-semibold">Location:</span> ${this.escapeHtml(response.location || 'Nearby')}</p>
                            <p class="text-gray-500">${this.escapeHtml(response.reasoning || '')}</p>
                        </div>
                    `,
                    filters: {
                        specialty: response.specialty,
                        rating: response.rating_min,
                        availability: response.availability,
                        location: response.location
                    }
                };
            case 'profile':
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <p class="font-semibold text-gray-900">${this.escapeHtml(response.summary || 'Summary ready.')}</p>
                            <div>
                                <p class="font-semibold">Suggested Questions</p>
                                <ul class="list-disc pl-5">
                                    ${(response.questions || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold">Preparation Tips</p>
                                <ul class="list-disc pl-5">
                                    ${(response.preparation || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `
                };
            case 'prep':
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <div>
                                <p class="font-semibold">Checklist</p>
                                <ul class="list-disc pl-5">
                                    ${(response.checklist || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold">Documents</p>
                                <ul class="list-disc pl-5">
                                    ${(response.documents || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold">Questions to Ask</p>
                                <ul class="list-disc pl-5">
                                    ${(response.questions || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `
                };
            case 'ops':
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <div>
                                <p class="font-semibold">Highlights</p>
                                <ul class="list-disc pl-5">
                                    ${(response.highlights || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold text-red-600">Risks</p>
                                <ul class="list-disc pl-5 text-red-600">
                                    ${(response.risks || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <p class="font-semibold">Recommendations</p>
                                <ul class="list-disc pl-5">
                                    ${(response.recommendations || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `
                };
            default:
                return {
                    html: `
                        <div class="space-y-3 text-sm text-gray-700">
                            <p class="font-semibold text-gray-900">${this.escapeHtml(response.summary || 'Summary ready.')}</p>
                            <ul class="list-disc pl-5">
                                ${(response.actions || []).map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                            </ul>
                        </div>
                    `
                };
        }
    }

    applyFilters(filters) {
        if (!filters) return;
        if (filters.specialty) {
            const checkbox = document.querySelector(`input[value="${filters.specialty}"]`);
            if (checkbox) checkbox.checked = true;
        }
        if (filters.rating) {
            const ratingSelect = document.getElementById('rating-filter');
            if (ratingSelect) ratingSelect.value = String(filters.rating);
        }
        if (filters.availability) {
            const availabilitySelect = document.getElementById('availability-filter');
            if (availabilitySelect) availabilitySelect.value = filters.availability;
        }
        if (filters.location) {
            const locationInput = document.getElementById('location-filter');
            if (locationInput) locationInput.value = filters.location;
        }
        if (typeof window.applyFilters === 'function') {
            window.applyFilters();
        }
    }

    fallbackResponse(intent) {
        switch (intent) {
            case 'triage':
                return {
                    summary: 'Based on your description, consider a same-week appointment for assessment.',
                    urgency: 'Routine, unless symptoms worsen',
                    specialty: 'Internal Medicine',
                    next_steps: ['Monitor symptoms', 'Prepare a timeline of symptom onset', 'Bring current medications list'],
                    red_flags: ['Severe chest pain', 'Sudden shortness of breath', 'Loss of consciousness']
                };
            case 'match':
                return {
                    summary: 'You are best matched with a high-rated specialist near your area.',
                    specialty: 'Cardiology',
                    rating_min: '4.5',
                    availability: 'week',
                    location: 'Downtown',
                    reasoning: 'Symptoms suggest a specialist with recent availability.'
                };
            case 'profile':
                return {
                    summary: 'This doctor focuses on evidence-based care with a patient-first approach.',
                    questions: ['What diagnostic tests are recommended?', 'What are treatment options?', 'What lifestyle changes help?'],
                    preparation: ['Bring past reports', 'List current medications', 'Note key symptoms']
                };
            case 'prep':
                return {
                    checklist: ['Write down top 3 concerns', 'Bring insurance details', 'Arrive 10 minutes early'],
                    documents: ['Previous lab results', 'Imaging reports', 'Medication list'],
                    questions: ['What is the likely cause?', 'How soon can I expect relief?', 'Are there alternatives?']
                };
            case 'ops':
                return {
                    highlights: ['Demand peaks midweek', 'Cardiology utilization up 8%'],
                    risks: ['Weekend coverage low', 'Wait time spikes after 3 PM'],
                    recommendations: ['Shift two slots to late afternoon', 'Add nurse triage for walk-ins']
                };
            default:
                return {
                    summary: 'Summary ready.',
                    actions: ['Review insights', 'Confirm next step', 'Notify relevant teams']
                };
        }
    }

    init3DModule() {
        const stage = document.querySelector('[data-medilab-3d]');
        if (!stage || !window.THREE) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 4.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        stage.appendChild(renderer.domElement);

        const texture = this.createPulseTexture();
        const coreGeometry = new THREE.IcosahedronGeometry(1.2, 2);
        const coreMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.4,
            metalness: 0.1,
            emissive: new THREE.Color(0x007bff),
            emissiveIntensity: 0.25
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(coreMesh);

        const ringGeometry = new THREE.TorusGeometry(1.65, 0.06, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x28a745,
            roughness: 0.3,
            metalness: 0.2
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        scene.add(ringMesh);

        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 0.7);
        directional.position.set(2, 2, 4);
        scene.add(directional);
        const pointLight = new THREE.PointLight(0x007bff, 0.8, 10);
        pointLight.position.set(-2, -1, 3);
        scene.add(pointLight);

        let targetRotation = { x: 0, y: 0 };
        let isDragging = false;
        let lastPos = { x: 0, y: 0 };

        stage.addEventListener('pointerdown', (event) => {
            isDragging = true;
            lastPos = { x: event.clientX, y: event.clientY };
        });

        stage.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            const deltaX = (event.clientX - lastPos.x) * 0.01;
            const deltaY = (event.clientY - lastPos.y) * 0.01;
            targetRotation.y += deltaX;
            targetRotation.x += deltaY;
            lastPos = { x: event.clientX, y: event.clientY };
        });

        window.addEventListener('pointerup', () => {
            isDragging = false;
        });

        const controls = document.querySelectorAll('[data-medilab-control]');
        controls.forEach(control => {
            const action = control.getAttribute('data-medilab-control');
            if (action === 'rotate-left') {
                control.addEventListener('click', () => {
                    targetRotation.y -= 0.3;
                });
            }
            if (action === 'rotate-right') {
                control.addEventListener('click', () => {
                    targetRotation.y += 0.3;
                });
            }
            if (action === 'zoom-in') {
                control.addEventListener('click', () => {
                    camera.position.z = Math.max(2.6, camera.position.z - 0.4);
                });
            }
            if (action === 'zoom-out') {
                control.addEventListener('click', () => {
                    camera.position.z = Math.min(6, camera.position.z + 0.4);
                });
            }
            if (action === 'glow' && control.type === 'range') {
                control.addEventListener('input', () => {
                    const value = Number(control.value) / 100;
                    coreMaterial.emissiveIntensity = 0.2 + value * 0.6;
                    ringMaterial.emissive = new THREE.Color(0x28a745);
                    ringMaterial.emissiveIntensity = 0.1 + value * 0.4;
                });
            }
        });

        const animate = () => {
            coreMesh.rotation.x += (targetRotation.x - coreMesh.rotation.x) * 0.08;
            coreMesh.rotation.y += (targetRotation.y - coreMesh.rotation.y) * 0.08;
            ringMesh.rotation.z += 0.002;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            if (!stage.clientWidth || !stage.clientHeight) return;
            camera.aspect = stage.clientWidth / stage.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(stage.clientWidth, stage.clientHeight);
        });
    }

    createPulseTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(0,123,255,0.9)');
        gradient.addColorStop(0.5, 'rgba(40,167,69,0.55)');
        gradient.addColorStop(1, 'rgba(255,255,255,0.1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(128, 128, 84, 0, Math.PI * 2);
        ctx.stroke();

        return new THREE.CanvasTexture(canvas);
    }
}

const i18nDictionary = {
    en: {
        nav_home: 'Home',
        nav_find: 'Find Doctors',
        nav_admin: 'Admin',
        nav_book_now: 'Book Now',
        label_language: 'Language',
        theme_dark: 'Dark Mode',
        theme_light: 'Light Mode',
        toast_language_updated: 'Language updated.',
        toast_theme_switched: 'Theme updated.',
        index_book_appointment: 'Book Appointment',
        index_learn_more: 'Learn More',
        index_find_doctor: 'Find a Doctor',
        index_hero_body: 'Connect with trusted healthcare professionals in your area. Book appointments instantly, manage your health records, and get the care you deserve.',
        index_stats_patients: 'Happy Patients',
        index_stats_doctors: 'Expert Doctors',
        index_stats_centers: 'Medical Centers',
        index_stats_rating: 'Average Rating',
        index_features_title: 'Why Choose MediConnect?',
        index_features_subtitle: 'We make healthcare accessible, convenient, and trustworthy for everyone.',
        index_cta_title: 'Ready to Take Control of Your Health?',
        index_cta_body: 'Join thousands of patients who trust MediConnect for their healthcare needs.',
        index_cta_button: 'Find Your Doctor Today',
        footer_tagline: 'Making healthcare accessible and convenient for everyone.',
        footer_patients_title: 'For Patients',
        footer_patients_find: 'Find Doctors',
        footer_patients_book: 'Book Appointment',
        footer_patients_records: 'Health Records',
        footer_providers_title: 'For Providers',
        footer_providers_admin: 'Admin Dashboard',
        footer_providers_schedule: 'Manage Schedule',
        footer_providers_management: 'Patient Management',
        footer_support_title: 'Support',
        footer_support_help: 'Help Center',
        footer_support_contact: 'Contact Us',
        footer_support_privacy: 'Privacy Policy',
        mobile_home: 'Home',
        mobile_search: 'Search',
        mobile_admin: 'Admin',
        mobile_profile: 'Profile',
        specialty_cardiology: 'Cardiology',
        specialty_dermatology: 'Dermatology',
        specialty_pediatrics: 'Pediatrics',
        specialty_orthopedics: 'Orthopedics',
        specialty_neurology: 'Neurology',
        specialty_internal: 'Internal Medicine',
        search_rating_any: 'Any Rating',
        search_rating_45: '4.5+ Stars',
        search_rating_40: '4.0+ Stars',
        search_rating_35: '3.5+ Stars',
        search_availability_any: 'Any Time',
        search_availability_today: 'Available Today',
        search_availability_week: 'This Week',
        search_availability_weekend: 'Weekend Available',
        label_specialty: 'Specialty',
        placeholder_specialty: 'Select specialty',
        label_location: 'Location',
        placeholder_location: 'Enter city or zip code',
        label_preferred_date: 'Preferred Date',
        index_search_doctors: 'Search Doctors',
        index_typed_strings: ['Your Health, Our Priority', 'Healthcare Made Simple', 'Connect with Trusted Doctors'],
        search_title: 'Find Doctors',
        search_subtitle: 'Discover trusted healthcare professionals in your area',
        booking_title: 'Book Your Appointment',
        booking_subtitle: 'Please provide your details to complete the booking.',
        booking_summary_title: 'Appointment Summary',
        booking_summary_doctor: 'Doctor',
        booking_summary_specialty: 'Specialty',
        booking_summary_date: 'Date',
        booking_summary_time: 'Time',
        booking_summary_fee: 'Consultation Fee:',
        booking_step_details: 'Details',
        booking_step_confirm: 'Confirm',
        booking_step_done: 'Done',
        booking_back: 'Back',
        booking_confirm: 'Confirm Booking',
        booking_terms_prefix: 'I agree to the',
        booking_terms_terms: 'Terms of Service',
        booking_terms_and: 'and',
        booking_terms_privacy: 'Privacy Policy',
        booking_terms_suffix: 'I understand that I can cancel or reschedule my appointment up to 24 hours in advance.',
        booking_confirmed_title: 'Booking Confirmed!',
        booking_confirmed_body: 'Your appointment has been successfully scheduled.',
        booking_details_title: 'Appointment Details',
        booking_details_id: 'Appointment ID:',
        booking_details_doctor: 'Doctor:',
        booking_details_datetime: 'Date & Time:',
        booking_details_patient: 'Patient:',
        booking_details_fee: 'Consultation Fee:',
        booking_next_title: 'What happens next?',
        booking_next_email: 'You will receive a confirmation email with appointment details',
        booking_next_contact: 'The clinic will contact you 24 hours before your appointment',
        booking_next_bring: 'Bring a valid ID and insurance card to your appointment',
        booking_download: 'Download Confirmation',
        booking_home: 'Back to Home',
        booking_download_toast: 'Confirmation PDF downloaded',
        booking_calendar: 'Add to Calendar',
        booking_calendar_toast: 'Calendar event downloaded',
        form_first_name: 'First Name *',
        form_last_name: 'Last Name *',
        form_email: 'Email Address *',
        form_phone: 'Phone Number *',
        form_dob: 'Date of Birth',
        form_reason: 'Reason for Visit *',
        form_notes: 'Additional Notes (Optional)',
        placeholder_reason: 'Please describe your symptoms or reason for consultation',
        placeholder_notes: 'Any additional information you would like the doctor to know',
        doctor_about: 'About Dr.',
        doctor_availability: 'Availability',
        doctor_reviews: 'Patient Reviews',
        doctor_book_title: 'Book Appointment',
        doctor_select_date: 'Select Date',
        doctor_available_times: 'Available Times',
        doctor_select_prompt: 'Select a date to see available times',
        doctor_button_default: 'Select Date & Time',
        doctor_button_book: 'Book Appointment',
        doctor_button_reviews: 'View Reviews',
        doctor_education: 'Education',
        doctor_languages: 'Languages',
        doctor_legend_available: 'Available',
        doctor_legend_selected: 'Selected',
        doctor_no_times: 'No available times for this date',
        search_filters_title: 'Filters',
        search_results_found: 'doctors found',
        search_label_rating: 'Minimum Rating',
        search_label_availability: 'Availability',
        search_clear_all: 'Clear All Filters',
        search_filters_button: 'Filters',
        search_sort_rating: 'Sort by Rating',
        search_sort_experience: 'Sort by Experience',
        search_sort_name: 'Sort by Name',
        search_sort_fee: 'Sort by Consultation Fee',
        search_view_profile: 'View Profile',
        search_book_now: 'Book Now',
        search_per_consultation: '/ consultation',
        search_save_filters: 'Save Filters',
        search_load_filters: 'Load Saved',
        search_saved_toast: 'Filters saved.',
        search_no_saved_toast: 'No saved filters yet.',
        search_load_more: 'Load More Doctors',
        search_loading: 'Loading...',
        search_no_results_title: 'No doctors found',
        search_no_results_body: 'Try adjusting your search criteria or filters.',
        search_clear_filters: 'Clear Filters',
        settings_language_title: 'Language & Accessibility',
        settings_language_desc: 'Select a preferred language for patient-facing screens.',
        admin_report_download: 'Download Report',
        admin_report_toast: 'Dashboard report downloaded.'
    },
    es: {
        nav_home: 'Inicio',
        nav_find: 'Buscar Medicos',
        nav_admin: 'Administracion',
        nav_book_now: 'Reservar Ahora',
        label_language: 'Idioma',
        theme_dark: 'Modo Oscuro',
        theme_light: 'Modo Claro',
        toast_language_updated: 'Idioma actualizado.',
        toast_theme_switched: 'Tema actualizado.',
        index_book_appointment: 'Reservar Cita',
        index_learn_more: 'Saber Mas',
        index_find_doctor: 'Encuentra un Medico',
        index_hero_body: 'Conecta con profesionales de salud confiables en tu area. Reserva citas al instante, administra tus registros y recibe la atencion que mereces.',
        index_stats_patients: 'Pacientes Felices',
        index_stats_doctors: 'Medicos Expertos',
        index_stats_centers: 'Centros Medicos',
        index_stats_rating: 'Calificacion Promedio',
        index_features_title: 'Por que elegir MediConnect?',
        index_features_subtitle: 'Hacemos la salud accesible, conveniente y confiable para todos.',
        index_cta_title: 'Listo para cuidar tu salud?',
        index_cta_body: 'Unete a miles de pacientes que confian en MediConnect.',
        index_cta_button: 'Encuentra tu medico hoy',
        footer_tagline: 'Hacemos la salud accesible y conveniente para todos.',
        footer_patients_title: 'Para Pacientes',
        footer_patients_find: 'Buscar Medicos',
        footer_patients_book: 'Reservar Cita',
        footer_patients_records: 'Historial Medico',
        footer_providers_title: 'Para Proveedores',
        footer_providers_admin: 'Panel Admin',
        footer_providers_schedule: 'Gestionar Horario',
        footer_providers_management: 'Gestion de Pacientes',
        footer_support_title: 'Soporte',
        footer_support_help: 'Centro de Ayuda',
        footer_support_contact: 'Contactanos',
        footer_support_privacy: 'Privacidad',
        mobile_home: 'Inicio',
        mobile_search: 'Buscar',
        mobile_admin: 'Admin',
        mobile_profile: 'Perfil',
        specialty_cardiology: 'Cardiologia',
        specialty_dermatology: 'Dermatologia',
        specialty_pediatrics: 'Pediatria',
        specialty_orthopedics: 'Ortopedia',
        specialty_neurology: 'Neurologia',
        specialty_internal: 'Medicina Interna',
        search_rating_any: 'Cualquier calificacion',
        search_rating_45: '4.5+ Estrellas',
        search_rating_40: '4.0+ Estrellas',
        search_rating_35: '3.5+ Estrellas',
        search_availability_any: 'Cualquier horario',
        search_availability_today: 'Disponible hoy',
        search_availability_week: 'Esta semana',
        search_availability_weekend: 'Fin de semana',
        label_specialty: 'Especialidad',
        placeholder_specialty: 'Selecciona especialidad',
        label_location: 'Ubicacion',
        placeholder_location: 'Ingresa ciudad o codigo postal',
        label_preferred_date: 'Fecha Preferida',
        index_search_doctors: 'Buscar Medicos',
        index_typed_strings: ['Tu Salud, Nuestra Prioridad', 'Salud Hecha Simple', 'Conecta con Medicos Confiables'],
        search_title: 'Buscar Medicos',
        search_subtitle: 'Descubre profesionales de salud confiables en tu area',
        booking_title: 'Reserva tu cita',
        booking_subtitle: 'Por favor completa tus datos para finalizar la reserva.',
        booking_summary_title: 'Resumen de la cita',
        booking_summary_doctor: 'Medico',
        booking_summary_specialty: 'Especialidad',
        booking_summary_date: 'Fecha',
        booking_summary_time: 'Hora',
        booking_summary_fee: 'Tarifa de consulta:',
        booking_step_details: 'Detalles',
        booking_step_confirm: 'Confirmar',
        booking_step_done: 'Listo',
        booking_back: 'Atras',
        booking_confirm: 'Confirmar reserva',
        booking_terms_prefix: 'Estoy de acuerdo con los',
        booking_terms_terms: 'Terminos de Servicio',
        booking_terms_and: 'y',
        booking_terms_privacy: 'Politica de Privacidad',
        booking_terms_suffix: 'Entiendo que puedo cancelar o reprogramar mi cita hasta 24 horas antes.',
        booking_confirmed_title: 'Reserva confirmada!',
        booking_confirmed_body: 'Tu cita ha sido programada con exito.',
        booking_details_title: 'Detalles de la cita',
        booking_details_id: 'ID de la cita:',
        booking_details_doctor: 'Medico:',
        booking_details_datetime: 'Fecha y hora:',
        booking_details_patient: 'Paciente:',
        booking_details_fee: 'Tarifa de consulta:',
        booking_next_title: 'Que sucede despues?',
        booking_next_email: 'Recibiras un correo de confirmacion con los detalles',
        booking_next_contact: 'La clinica te contactara 24 horas antes de tu cita',
        booking_next_bring: 'Trae un documento de identidad y tarjeta de seguro',
        booking_download: 'Descargar confirmacion',
        booking_home: 'Volver al inicio',
        booking_download_toast: 'Confirmacion descargada',
        booking_calendar: 'Agregar al calendario',
        booking_calendar_toast: 'Evento de calendario descargado',
        form_first_name: 'Nombre *',
        form_last_name: 'Apellido *',
        form_email: 'Correo electronico *',
        form_phone: 'Telefono *',
        form_dob: 'Fecha de nacimiento',
        form_reason: 'Motivo de la visita *',
        form_notes: 'Notas adicionales (Opcional)',
        placeholder_reason: 'Describe tus sintomas o el motivo de la consulta',
        placeholder_notes: 'Informacion adicional para el doctor',
        doctor_about: 'Sobre el Dr.',
        doctor_availability: 'Disponibilidad',
        doctor_reviews: 'Resenas de pacientes',
        doctor_book_title: 'Reservar cita',
        doctor_select_date: 'Seleccionar fecha',
        doctor_available_times: 'Horarios disponibles',
        doctor_select_prompt: 'Selecciona una fecha para ver horarios',
        doctor_button_default: 'Selecciona fecha y hora',
        doctor_button_book: 'Reservar cita',
        doctor_button_reviews: 'Ver resenas',
        doctor_education: 'Educacion',
        doctor_languages: 'Idiomas',
        doctor_legend_available: 'Disponible',
        doctor_legend_selected: 'Seleccionado',
        doctor_no_times: 'No hay horarios disponibles para esta fecha',
        search_filters_title: 'Filtros',
        search_results_found: 'medicos encontrados',
        search_label_rating: 'Calificacion minima',
        search_label_availability: 'Disponibilidad',
        search_clear_all: 'Limpiar todos los filtros',
        search_filters_button: 'Filtros',
        search_sort_rating: 'Ordenar por calificacion',
        search_sort_experience: 'Ordenar por experiencia',
        search_sort_name: 'Ordenar por nombre',
        search_sort_fee: 'Ordenar por tarifa',
        search_view_profile: 'Ver perfil',
        search_book_now: 'Reservar ahora',
        search_per_consultation: '/ consulta',
        search_save_filters: 'Guardar filtros',
        search_load_filters: 'Cargar guardado',
        search_saved_toast: 'Filtros guardados.',
        search_no_saved_toast: 'No hay filtros guardados.',
        search_load_more: 'Cargar mas medicos',
        search_loading: 'Cargando...',
        search_no_results_title: 'No se encontraron medicos',
        search_no_results_body: 'Ajusta los filtros o criterios de busqueda.',
        search_clear_filters: 'Limpiar filtros',
        settings_language_title: 'Idioma y Accesibilidad',
        settings_language_desc: 'Selecciona un idioma preferido para pantallas de pacientes.',
        admin_report_download: 'Descargar reporte',
        admin_report_toast: 'Reporte descargado.'
    },
    fr: {
        nav_home: 'Accueil',
        nav_find: 'Trouver des Medecins',
        nav_admin: 'Administration',
        nav_book_now: 'Reserver',
        label_language: 'Langue',
        theme_dark: 'Mode Sombre',
        theme_light: 'Mode Clair',
        toast_language_updated: 'Langue mise a jour.',
        toast_theme_switched: 'Theme mis a jour.',
        index_book_appointment: 'Reserver un Rendez-vous',
        index_learn_more: 'En savoir plus',
        index_find_doctor: 'Trouver un Medecin',
        index_hero_body: 'Connectez-vous avec des professionnels de sante fiables pres de chez vous. Reservez instantanement, gerez vos dossiers et obtenez les soins dont vous avez besoin.',
        index_stats_patients: 'Patients Satisfaits',
        index_stats_doctors: 'Medecins Experts',
        index_stats_centers: 'Centres Medicaux',
        index_stats_rating: 'Note Moyenne',
        index_features_title: 'Pourquoi choisir MediConnect?',
        index_features_subtitle: 'Nous rendons la sante accessible, pratique et fiable pour tous.',
        index_cta_title: 'Pret a prendre soin de votre sante?',
        index_cta_body: 'Rejoignez des milliers de patients qui font confiance a MediConnect.',
        index_cta_button: 'Trouver votre medecin',
        footer_tagline: 'Rendre la sante accessible et pratique pour tous.',
        footer_patients_title: 'Pour les patients',
        footer_patients_find: 'Trouver des medecins',
        footer_patients_book: 'Reserver un rendez-vous',
        footer_patients_records: 'Dossiers medicaux',
        footer_providers_title: 'Pour les professionnels',
        footer_providers_admin: 'Tableau de bord',
        footer_providers_schedule: 'Gerer le planning',
        footer_providers_management: 'Gestion des patients',
        footer_support_title: 'Support',
        footer_support_help: 'Centre d aide',
        footer_support_contact: 'Contact',
        footer_support_privacy: 'Confidentialite',
        mobile_home: 'Accueil',
        mobile_search: 'Recherche',
        mobile_admin: 'Admin',
        mobile_profile: 'Profil',
        specialty_cardiology: 'Cardiologie',
        specialty_dermatology: 'Dermatologie',
        specialty_pediatrics: 'Pediatrie',
        specialty_orthopedics: 'Orthopedie',
        specialty_neurology: 'Neurologie',
        specialty_internal: 'Medecine interne',
        search_rating_any: 'Toute note',
        search_rating_45: '4,5+ etoiles',
        search_rating_40: '4,0+ etoiles',
        search_rating_35: '3,5+ etoiles',
        search_availability_any: 'A tout moment',
        search_availability_today: 'Disponible aujourd hui',
        search_availability_week: 'Cette semaine',
        search_availability_weekend: 'Week-end disponible',
        label_specialty: 'Specialite',
        placeholder_specialty: 'Selectionner une specialite',
        label_location: 'Lieu',
        placeholder_location: 'Entrez la ville ou le code postal',
        label_preferred_date: 'Date preferee',
        index_search_doctors: 'Rechercher des medecins',
        index_typed_strings: ['Votre Sante, Notre Priorite', 'La sante simplifiee', 'Connectez-vous a des medecins fiables'],
        search_title: 'Trouver des Medecins',
        search_subtitle: 'Decouvrez des professionnels de sante fiables pres de chez vous',
        booking_title: 'Reserver votre rendez-vous',
        booking_subtitle: 'Veuillez fournir vos informations pour confirmer.',
        booking_summary_title: 'Resume du rendez-vous',
        booking_summary_doctor: 'Medecin',
        booking_summary_specialty: 'Specialite',
        booking_summary_date: 'Date',
        booking_summary_time: 'Heure',
        booking_summary_fee: 'Frais de consultation:',
        booking_step_details: 'Details',
        booking_step_confirm: 'Confirmer',
        booking_step_done: 'Termine',
        booking_back: 'Retour',
        booking_confirm: 'Confirmer la reservation',
        booking_terms_prefix: 'J accepte les',
        booking_terms_terms: 'Conditions de service',
        booking_terms_and: 'et la',
        booking_terms_privacy: 'Politique de confidentialite',
        booking_terms_suffix: 'Je comprends que je peux annuler ou reprogrammer mon rendez-vous jusqu a 24 heures a l avance.',
        booking_confirmed_title: 'Reservation confirmee!',
        booking_confirmed_body: 'Votre rendez-vous a ete programme avec succes.',
        booking_details_title: 'Details du rendez-vous',
        booking_details_id: 'ID du rendez-vous:',
        booking_details_doctor: 'Medecin:',
        booking_details_datetime: 'Date et heure:',
        booking_details_patient: 'Patient:',
        booking_details_fee: 'Frais de consultation:',
        booking_next_title: 'Et ensuite?',
        booking_next_email: 'Vous recevrez un email de confirmation avec les details',
        booking_next_contact: 'La clinique vous contactera 24 heures avant votre rendez-vous',
        booking_next_bring: 'Apportez une piece d identite et votre assurance',
        booking_download: 'Telecharger la confirmation',
        booking_home: 'Retour a l accueil',
        booking_download_toast: 'Confirmation telechargee',
        booking_calendar: 'Ajouter au calendrier',
        booking_calendar_toast: 'Evenement telecharge',
        form_first_name: 'Prenom *',
        form_last_name: 'Nom *',
        form_email: 'Email *',
        form_phone: 'Telephone *',
        form_dob: 'Date de naissance',
        form_reason: 'Motif de la visite *',
        form_notes: 'Notes supplementaires (Optionnel)',
        placeholder_reason: 'Decrivez vos symptomes ou le motif de consultation',
        placeholder_notes: 'Informations supplementaires pour le medecin',
        doctor_about: 'A propos du Dr.',
        doctor_availability: 'Disponibilite',
        doctor_reviews: 'Avis des patients',
        doctor_book_title: 'Reserver un rendez-vous',
        doctor_select_date: 'Selectionner une date',
        doctor_available_times: 'Horaires disponibles',
        doctor_select_prompt: 'Selectionnez une date pour voir les horaires',
        doctor_button_default: 'Selectionnez date et heure',
        doctor_button_book: 'Reserver un rendez-vous',
        doctor_button_reviews: 'Voir les avis',
        doctor_education: 'Formation',
        doctor_languages: 'Langues',
        doctor_legend_available: 'Disponible',
        doctor_legend_selected: 'Selectionne',
        doctor_no_times: 'Aucun horaire disponible pour cette date',
        search_filters_title: 'Filtres',
        search_results_found: 'medecins trouves',
        search_label_rating: 'Note minimale',
        search_label_availability: 'Disponibilite',
        search_clear_all: 'Effacer tous les filtres',
        search_filters_button: 'Filtres',
        search_sort_rating: 'Trier par note',
        search_sort_experience: 'Trier par experience',
        search_sort_name: 'Trier par nom',
        search_sort_fee: 'Trier par tarif',
        search_view_profile: 'Voir le profil',
        search_book_now: 'Reserver',
        search_per_consultation: '/ consultation',
        search_save_filters: 'Enregistrer',
        search_load_filters: 'Charger',
        search_saved_toast: 'Filtres enregistres.',
        search_no_saved_toast: 'Aucun filtre enregistre.',
        search_load_more: 'Charger plus de medecins',
        search_loading: 'Chargement...',
        search_no_results_title: 'Aucun medecin trouve',
        search_no_results_body: 'Essayez de modifier les filtres.',
        search_clear_filters: 'Effacer les filtres',
        settings_language_title: 'Langue et Accessibilite',
        settings_language_desc: 'Selectionnez une langue preferee pour les ecrans patients.',
        admin_report_download: 'Telecharger le rapport',
        admin_report_toast: 'Rapport telecharge.'
    },
    ur: {
        nav_home: 'ہوم',
        nav_find: 'ڈاکٹر تلاش کریں',
        nav_admin: 'ایڈمن',
        nav_book_now: 'ابھی بک کریں',
        label_language: 'زبان',
        theme_dark: 'ڈارک موڈ',
        theme_light: 'لائٹ موڈ',
        toast_language_updated: 'زبان تبدیل ہوگئی ہے۔',
        toast_theme_switched: 'تھیم تبدیل ہوگئی ہے۔',
        index_book_appointment: 'اپائنٹمنٹ بک کریں',
        index_learn_more: 'مزید جانیں',
        index_find_doctor: 'ڈاکٹر تلاش کریں',
        index_hero_body: 'اپنے علاقے میں قابلِ اعتماد صحت کے ماہرین سے رابطہ کریں۔ فوری طور پر اپائنٹمنٹ بک کریں، اپنے ریکارڈز مینیج کریں، اور بہتر صحت حاصل کریں۔',
        index_stats_patients: 'خوش مریض',
        index_stats_doctors: 'ماہر ڈاکٹر',
        index_stats_centers: 'میڈیکل سینٹرز',
        index_stats_rating: 'اوسط ریٹنگ',
        index_features_title: 'MediConnect کیوں؟',
        index_features_subtitle: 'ہم صحت کو قابلِ رسائی، آسان اور قابلِ اعتماد بناتے ہیں۔',
        index_cta_title: 'اپنی صحت سنبھالنے کے لیے تیار ہیں؟',
        index_cta_body: 'ہزاروں مریض MediConnect پر اعتماد کرتے ہیں۔',
        index_cta_button: 'آج ہی ڈاکٹر تلاش کریں',
        footer_tagline: 'صحت کو قابلِ رسائی اور آسان بنانا ہمارا مقصد ہے۔',
        footer_patients_title: 'مریضوں کے لیے',
        footer_patients_find: 'ڈاکٹر تلاش کریں',
        footer_patients_book: 'اپائنٹمنٹ بک کریں',
        footer_patients_records: 'ہیلتھ ریکارڈز',
        footer_providers_title: 'فراہم کنندگان کے لیے',
        footer_providers_admin: 'ایڈمن ڈیش بورڈ',
        footer_providers_schedule: 'شیڈول مینیج کریں',
        footer_providers_management: 'مریض مینجمنٹ',
        footer_support_title: 'سپورٹ',
        footer_support_help: 'ہیلپ سینٹر',
        footer_support_contact: 'ہم سے رابطہ کریں',
        footer_support_privacy: 'پرائیویسی پالیسی',
        mobile_home: 'ہوم',
        mobile_search: 'تلاش',
        mobile_admin: 'ایڈمن',
        mobile_profile: 'پروفائل',
        specialty_cardiology: 'کارڈیالوجی',
        specialty_dermatology: 'ڈرماٹولوجی',
        specialty_pediatrics: 'پیڈیاٹرکس',
        specialty_orthopedics: 'آرتھوپیڈکس',
        specialty_neurology: 'نیورولوجی',
        specialty_internal: 'اندرونی طب',
        search_rating_any: 'کوئی ریٹنگ',
        search_rating_45: '4.5+ ستارے',
        search_rating_40: '4.0+ ستارے',
        search_rating_35: '3.5+ ستارے',
        search_availability_any: 'کسی بھی وقت',
        search_availability_today: 'آج دستیاب',
        search_availability_week: 'اس ہفتے',
        search_availability_weekend: 'ویک اینڈ دستیاب',
        label_specialty: 'ماہر شعبہ',
        placeholder_specialty: 'خصوصیت منتخب کریں',
        label_location: 'مقام',
        placeholder_location: 'شہر یا پوسٹل کوڈ درج کریں',
        label_preferred_date: 'پسندیدہ تاریخ',
        index_search_doctors: 'ڈاکٹر تلاش کریں',
        index_typed_strings: ['آپ کی صحت، ہماری ترجیح', 'ہیلتھ کیئر آسان', 'قابلِ اعتماد ڈاکٹرز سے رابطہ کریں'],
        search_title: 'ڈاکٹر تلاش کریں',
        search_subtitle: 'اپنے علاقے میں قابلِ اعتماد صحت کے ماہرین تلاش کریں',
        booking_title: 'اپائنٹمنٹ بک کریں',
        booking_subtitle: 'براہ کرم اپنی تفصیلات فراہم کریں۔',
        booking_summary_title: 'اپائنٹمنٹ خلاصہ',
        booking_summary_doctor: 'ڈاکٹر',
        booking_summary_specialty: 'خصوصیت',
        booking_summary_date: 'تاریخ',
        booking_summary_time: 'وقت',
        booking_summary_fee: 'فیس:',
        booking_step_details: 'تفصیلات',
        booking_step_confirm: 'تصدیق',
        booking_step_done: 'مکمل',
        booking_back: 'واپس',
        booking_confirm: 'اپائنٹمنٹ کنفرم کریں',
        booking_terms_prefix: 'میں',
        booking_terms_terms: 'شرائطِ سروس',
        booking_terms_and: 'اور',
        booking_terms_privacy: 'پرائیویسی پالیسی',
        booking_terms_suffix: 'سے اتفاق کرتا ہوں۔ میں سمجھتا ہوں کہ میں اپنی اپائنٹمنٹ 24 گھنٹے پہلے تک منسوخ یا ری شیڈول کر سکتا ہوں۔',
        booking_confirmed_title: 'اپائنٹمنٹ کنفرم ہوگئی!',
        booking_confirmed_body: 'آپ کی اپائنٹمنٹ کامیابی سے شیڈول ہو گئی ہے۔',
        booking_details_title: 'اپائنٹمنٹ کی تفصیل',
        booking_details_id: 'اپائنٹمنٹ آئی ڈی:',
        booking_details_doctor: 'ڈاکٹر:',
        booking_details_datetime: 'تاریخ اور وقت:',
        booking_details_patient: 'مریض:',
        booking_details_fee: 'فیس:',
        booking_next_title: 'اب کیا ہوگا؟',
        booking_next_email: 'آپ کو اپائنٹمنٹ کی تفصیل کے ساتھ تصدیقی ای میل ملے گی',
        booking_next_contact: 'کلینک اپائنٹمنٹ سے 24 گھنٹے پہلے رابطہ کرے گا',
        booking_next_bring: 'اپنی شناخت اور انشورنس کارڈ ساتھ لائیں',
        booking_download: 'کنفرمیشن ڈاؤن لوڈ کریں',
        booking_home: 'ہوم پر جائیں',
        booking_download_toast: 'کنفرمیشن ڈاؤن لوڈ ہوگئی',
        booking_calendar: 'کیلنڈر میں شامل کریں',
        booking_calendar_toast: 'کیلنڈر ایونٹ ڈاؤن لوڈ ہوگیا',
        form_first_name: 'پہلا نام *',
        form_last_name: 'آخری نام *',
        form_email: 'ای میل *',
        form_phone: 'فون نمبر *',
        form_dob: 'تاریخ پیدائش',
        form_reason: 'وزٹ کی وجہ *',
        form_notes: 'اضافی نوٹس (اختیاری)',
        placeholder_reason: 'اپنی علامات یا وجہ بیان کریں',
        placeholder_notes: 'ڈاکٹر کے لیے اضافی معلومات',
        doctor_about: 'ڈاکٹر کے بارے میں',
        doctor_availability: 'دستیابی',
        doctor_reviews: 'مریضوں کے تاثرات',
        doctor_book_title: 'اپائنٹمنٹ بک کریں',
        doctor_select_date: 'تاریخ منتخب کریں',
        doctor_available_times: 'دستیاب اوقات',
        doctor_select_prompt: 'اوقات دیکھنے کے لیے تاریخ منتخب کریں',
        doctor_button_default: 'تاریخ اور وقت منتخب کریں',
        doctor_button_book: 'اپائنٹمنٹ بک کریں',
        doctor_button_reviews: 'ریویوز دیکھیں',
        doctor_education: 'تعلیم',
        doctor_languages: 'زبانیں',
        doctor_legend_available: 'دستیاب',
        doctor_legend_selected: 'منتخب',
        doctor_no_times: 'اس تاریخ کے لیے کوئی وقت دستیاب نہیں',
        search_filters_title: 'فلٹرز',
        search_results_found: 'ڈاکٹرز ملے',
        search_label_rating: 'کم از کم ریٹنگ',
        search_label_availability: 'دستیابی',
        search_clear_all: 'تمام فلٹرز صاف کریں',
        search_filters_button: 'فلٹرز',
        search_sort_rating: 'ریٹنگ کے مطابق ترتیب',
        search_sort_experience: 'تجربے کے مطابق ترتیب',
        search_sort_name: 'نام کے مطابق ترتیب',
        search_sort_fee: 'فیس کے مطابق ترتیب',
        search_view_profile: 'پروفائل دیکھیں',
        search_book_now: 'ابھی بک کریں',
        search_per_consultation: '/ مشاورت',
        search_save_filters: 'فلٹرز محفوظ کریں',
        search_load_filters: 'محفوظ لوڈ کریں',
        search_saved_toast: 'فلٹرز محفوظ ہوگئے۔',
        search_no_saved_toast: 'کوئی محفوظ فلٹر نہیں ہے۔',
        search_load_more: 'مزید ڈاکٹر لوڈ کریں',
        search_loading: 'لوڈ ہو رہا ہے...',
        search_no_results_title: 'کوئی ڈاکٹر نہیں ملا',
        search_no_results_body: 'فلٹرز یا معیار بدل کر دیکھیں۔',
        search_clear_filters: 'فلٹرز صاف کریں',
        settings_language_title: 'زبان اور رسائی',
        settings_language_desc: 'مریضوں کی اسکرینز کے لیے پسندیدہ زبان منتخب کریں۔',
        admin_report_download: 'رپورٹ ڈاؤن لوڈ کریں',
        admin_report_toast: 'رپورٹ ڈاؤن لوڈ ہوگئی۔'
    }
};

function getCurrentLanguage() {
    return localStorage.getItem('mediconnect_language') || 'en';
}

function getCurrentLocale() {
    const language = getCurrentLanguage();
    const mapping = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        ur: 'ur-PK'
    };

    return mapping[language] || 'en-US';
}

function getDictionary(language) {
    return i18nDictionary[language] || i18nDictionary.en;
}

function getI18nValue(key, fallback) {
    const dictionary = getDictionary(getCurrentLanguage());
    return dictionary[key] || fallback;
}

function getI18nArray(key, fallback) {
    const dictionary = getDictionary(getCurrentLanguage());
    const value = dictionary[key];
    return Array.isArray(value) ? value : fallback;
}

function applyTranslations(language) {
    const dictionary = getDictionary(language);

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (dictionary[key]) {
            element.textContent = dictionary[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (dictionary[key]) {
            element.setAttribute('placeholder', dictionary[key]);
        }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
        const key = element.getAttribute('data-i18n-aria');
        if (dictionary[key]) {
            element.setAttribute('aria-label', dictionary[key]);
        }
    });

    document.documentElement.lang = language;
    applyTheme(localStorage.getItem('mediconnect_theme') || 'light');
    const languageEvent = new CustomEvent('mediconnect:language-change', { detail: { language } });
    document.dispatchEvent(languageEvent);
}

function initI18n() {
    const storedLanguage = getCurrentLanguage();
    applyTranslations(storedLanguage);

    document.querySelectorAll('[data-lang-select]').forEach((select) => {
        select.value = storedLanguage;
        select.addEventListener('change', (event) => {
            const language = event.target.value;
            localStorage.setItem('mediconnect_language', language);
            applyTranslations(language);
            if (window.mediconnect) {
                window.mediconnect.showToast(getI18nValue('toast_language_updated', 'Language updated.'), 'success');
            }
        });
    });
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('theme-dark', isDark);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.textContent = isDark ? getI18nValue('theme_light', 'Light Mode') : getI18nValue('theme_dark', 'Dark Mode');
        button.setAttribute('aria-pressed', String(isDark));
    });

    const themeEvent = new CustomEvent('mediconnect:theme-change', { detail: { theme } });
    document.dispatchEvent(themeEvent);
}

function initTheme() {
    const storedTheme = localStorage.getItem('mediconnect_theme') || 'light';
    document.documentElement.classList.add('theme-transition');
    applyTheme(storedTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = document.documentElement.classList.contains('theme-dark') ? 'light' : 'dark';
            localStorage.setItem('mediconnect_theme', nextTheme);
            applyTheme(nextTheme);
            if (window.mediconnect) {
                window.mediconnect.showToast(getI18nValue('toast_theme_switched', 'Theme updated.'), 'success');
            }
        });
    });
}

// Initialize MediConnect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mediconnect = new MediConnect();
    window.medilabAI = new MediLabAI();
    initI18n();
    initTheme();
    window.getI18nValue = getI18nValue;
    window.getI18nArray = getI18nArray;
    window.getCurrentLocale = getCurrentLocale;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediConnect;
}

// Add CSS for toast notifications
const toastStyles = `
    <style>
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            background: #10B981;
            color: white;
        }
        
        .toast-error {
            background: #EF4444;
            color: white;
        }
        
        .toast-warning {
            background: #F59E0B;
            color: white;
        }
        
        .toast-info {
            background: #3B82F6;
            color: white;
        }
        
        @media (max-width: 640px) {
            .toast {
                left: 20px;
                right: 20px;
                transform: translateY(-100px);
            }
            
            .toast.show {
                transform: translateY(0);
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', toastStyles);

const medilabStyles = `
    <style>
        .theme-transition * {
            transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .theme-dark {
            background-color: #0b1220;
            color: #e2e8f0;
        }

        .theme-dark body {
            background-color: #0b1220;
            color: #e2e8f0;
        }

        .theme-dark .bg-white {
            background-color: #101a2f !important;
        }

        .theme-dark .bg-gray-50 {
            background-color: #0f172a !important;
        }

        .theme-dark .bg-blue-50 {
            background-color: #0c2544 !important;
        }

        .theme-dark .text-blue-900 {
            color: #e0f2ff !important;
        }

        .theme-dark .text-blue-700 {
            color: #8bb2e3 !important;
        }

        .theme-dark .text-blue-800 {
            color: #a8c3ea !important;
        }

        .theme-dark .text-blue-600 {
            color: #7aa2d8 !important;
        }

        .theme-dark .text-green-700 {
            color: #6bc8a8 !important;
        }

        .theme-dark .text-green-800 {
            color: #7ad3b3 !important;
        }

        .theme-dark .bg-green-100 {
            background-color: #103029 !important;
        }

        .theme-dark .bg-green-50 {
            background-color: #0b2a22 !important;
        }

        .theme-dark .bg-red-50 {
            background-color: #2a1416 !important;
        }

        .theme-dark .text-red-600 {
            color: #f19a9a !important;
        }

        .theme-dark .text-green-600 {
            color: #4fbf95 !important;
        }

        .theme-dark .btn-primary {
            background: #1e4bbf;
            color: #f8fafc;
            box-shadow: none;
        }

        .theme-dark .btn-success {
            background: #1b6f44;
            color: #f8fafc;
            box-shadow: none;
        }

        .theme-dark .bg-blue-600 {
            background-color: #1d4ed8 !important;
        }

        .theme-dark .bg-green-600 {
            background-color: #15803d !important;
        }

        .theme-dark .bg-red-600 {
            background-color: #b91c1c !important;
        }

        .theme-dark .border-blue-600 {
            border-color: #60a5fa !important;
        }

        .theme-dark .border-green-600 {
            border-color: #34d399 !important;
        }

        .theme-dark .border-red-600 {
            border-color: #f87171 !important;
        }

        .theme-dark .border-blue-200 {
            border-color: rgba(125, 211, 252, 0.25) !important;
        }

        .theme-dark .text-gray-900 {
            color: #f1f5f9 !important;
        }

        .theme-dark .text-gray-700,
        .theme-dark .text-gray-600,
        .theme-dark .text-gray-500 {
            color: #cbd5f5 !important;
        }

        .theme-dark .border-gray-200,
        .theme-dark .border-gray-300 {
            border-color: rgba(148, 163, 184, 0.35) !important;
        }

        .theme-dark .mobile-nav {
            background: #0f172a;
            border-top-color: rgba(148, 163, 184, 0.25);
        }

        .theme-dark .mobile-nav-item {
            color: #94a3b8;
        }

        .theme-dark .mobile-nav-item.active {
            color: #60a5fa;
        }

        .theme-dark .nav-icon,
        .theme-dark .mobile-nav-icon {
            color: #93c5fd;
            filter: none;
        }

        .theme-dark svg {
            filter: none;
        }

        .theme-dark .nav-item {
            color: #cbd5f5;
        }

        .theme-dark .nav-item.active {
            color: #93c5fd;
        }

        .theme-dark .search-container {
            background: rgba(15, 23, 42, 0.92);
        }

        .theme-dark .stats-card {
            background: #0f172a;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.4);
        }

        .theme-dark .chart-container {
            background: #0f172a;
            border-color: rgba(148, 163, 184, 0.25);
        }

        .theme-dark .hero-bg {
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.12) 0%, rgba(40, 167, 69, 0.12) 100%);
        }

        .theme-dark .hero-bg::before {
            opacity: 0.18;
        }

        .theme-dark .medilab-panel {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(10, 35, 60, 0.9));
            border-color: rgba(96, 165, 250, 0.3);
        }

        .theme-dark .medilab-output,
        .theme-dark .medilab-input,
        .theme-dark .medilab-control-btn {
            background: #0f172a;
            color: #e2e8f0;
            border-color: rgba(148, 163, 184, 0.25);
        }

        .theme-dark .medilab-input::placeholder {
            color: #94a3b8;
        }

        .theme-dark .medilab-badge {
            background: rgba(96, 165, 250, 0.2);
            color: #bfdbfe;
        }

        .theme-dark .shadow-sm,
        .theme-dark .shadow-xl,
        .theme-dark .shadow-2xl {
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.4) !important;
        }

        .medilab-panel {
            background: linear-gradient(135deg, rgba(0,123,255,0.08), rgba(40,167,69,0.08));
            border: 1px solid rgba(0,123,255,0.15);
            border-radius: 20px;
            padding: 24px;
            position: relative;
            overflow: hidden;
            z-index: 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            backdrop-filter: blur(8px);
        }

        .medilab-panel::after {
            content: '';
            position: absolute;
            top: -60px;
            right: -80px;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle, rgba(0,123,255,0.18), transparent 70%);
            z-index: 0;
        }

        .medilab-panel > * {
            position: relative;
            z-index: 1;
        }

        .medilab-badge {
            animation: medilab-float 6s ease-in-out infinite;
        }

        .medilab-3d-stage {
            animation: medilab-breathe 8s ease-in-out infinite;
        }

        @keyframes medilab-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }

        @keyframes medilab-breathe {
            0%, 100% { filter: drop-shadow(0 8px 24px rgba(0, 123, 255, 0.12)); }
            50% { filter: drop-shadow(0 10px 30px rgba(40, 167, 69, 0.16)); }
        }

        .medilab-input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 12px;
            background: white;
            transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .medilab-input:focus {
            outline: none;
            border-color: rgba(0,123,255,0.6);
            box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
        }

        .medilab-output {
            background: white;
            border-radius: 16px;
            padding: 16px;
            border: 1px solid rgba(0,0,0,0.08);
            min-height: 120px;
        }

        .medilab-control-btn {
            border: 1px solid rgba(0,0,0,0.1);
            padding: 8px 12px;
            border-radius: 10px;
            background: white;
            font-size: 12px;
            font-weight: 600;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .medilab-control-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }

        .medilab-key-badge {
            font-size: 12px;
            color: #6C757D;
        }

        .theme-dark .sidebar,
        .theme-dark .filter-card,
        .theme-dark .appointment-card,
        .theme-dark .doctor-card,
        .theme-dark .stat-card,
        .theme-dark .booking-card,
        .theme-dark .review-card {
            background-color: #0f172a;
            border-color: rgba(148, 163, 184, 0.1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .theme-dark .calendar-day,
        .theme-dark .time-slot {
            background-color: #0f172a;
            color: #e2e8f0;
            border-color: rgba(148, 163, 184, 0.1);
        }

        /* Global Direct Form Elements Override */
        .theme-dark input:not([type="checkbox"]):not([type="radio"]),
        .theme-dark select,
        .theme-dark textarea {
            background-color: #1e293b !important;
            color: #e2e8f0 !important;
            border-color: #334155 !important;
        }

        .theme-dark input::placeholder,
        .theme-dark textarea::placeholder {
            color: #94a3b8 !important;
        }

        .theme-dark input:focus,
        .theme-dark select:focus,
        .theme-dark textarea:focus {
            border-color: #60a5fa !important;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
        }

        .theme-dark input[type="date"] {
            color-scheme: dark;
        }

        /* Diagnose Page Component Overrides */
        .theme-dark .medilab-panel,
        .theme-dark .medilab-3d-shell,
        .theme-dark .medilab-howto-card {
            background: #0f172a !important;
            border-color: rgba(148, 163, 184, 0.1) !important;
            color: #e2e8f0;
        }

        .theme-dark .medilab-3d-stage {
            filter: invert(1) hue-rotate(180deg);
            opacity: 0.9;
        }

        .theme-dark .medilab-3d-shell span[class*="bg-blue-50"] {
            background-color: rgba(30, 41, 59, 0.8) !important;
            color: #60a5fa !important;
            border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .theme-dark .medilab-3d-shell h3,
        .theme-dark .medilab-howto-card h3,
        .theme-dark .medilab-panel h2 {
            color: #f8fafc !important;
        }

        .theme-dark .medilab-3d-shell p,
        .theme-dark .medilab-howto-card p,
        .theme-dark .medilab-howto-card li,
        .theme-dark .medilab-panel p,
        .theme-dark #viral-summary {
            color: #cbd5e1 !important;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', medilabStyles);

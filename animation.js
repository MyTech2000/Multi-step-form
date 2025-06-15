// Form data storage
let formData = {
    name: '',
    email: '',
    phone: '',
    plan: '',
    billing: 'monthly',
    addons: []
};

let currentStep = 1;
const totalSteps = 4;

// Plan data
const plans = {
    arcade: { name: 'Arcade', monthly: 9, yearly: 90 },
    advanced: { name: 'Advanced', monthly: 12, yearly: 120 },
    pro: { name: 'Pro', monthly: 15, yearly: 150 }
};

// Addon data
const addons = {
    'online-service': { name: 'Online service', monthly: 1, yearly: 10 },
    'larger-storage': { name: 'Larger storage', monthly: 2, yearly: 20 },
    'customizable-profile': { name: 'Customizable Profile', monthly: 2, yearly: 20 }
};

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    updateNavigation();
});

function initializeForm() {
    // Set initial step
    showStep(1);
    
    // Initialize billing toggle
    document.querySelector('[data-billing="monthly"]').classList.add('active');
    
    // Update form header
    updateFormHeader();
}

function setupEventListeners() {
    // Billing toggle
    document.querySelectorAll('.billing-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const billing = this.dataset.billing;
            setBilling(billing);
        });
    });
    
    // Plan selection
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function() {
            const plan = this.dataset.plan;
            selectPlan(plan);
        });
    });
    
    // Addon selection
    document.querySelectorAll('.addon-card').forEach(card => {
        card.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            toggleAddon(checkbox.value, checkbox.checked);
        });
    });
    
    // Form inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            formData[this.name] = this.value;
            clearError(this.name);
        });
        
        input.addEventListener('blur', function() {
            validateField(this.name, this.value);
        });
    });
    
    // Prevent form submission
    document.getElementById('multi-step-form').addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update progress bar
    updateProgressBar(step);
    
    // Update form header
    updateFormHeader();
    
    // Update navigation
    updateNavigation();
    
    currentStep = step;
}

function updateProgressBar(step) {
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        const stepNumber = index + 1;
        
        stepEl.classList.remove('active', 'completed');
        
        if (stepNumber < step) {
            stepEl.classList.add('completed');
        } else if (stepNumber === step) {
            stepEl.classList.add('active');
        } 
    });
}

function updateFormHeader() {
    const titles = {
        1: 'Personal Info',
        2: 'Select your plan',
        3: 'Pick add-ons',
        4: 'Finishing up'
    };
    
    const descriptions = {
        1: 'Please provide your name, email address, and phone number.',
        2: 'You have the option of monthly or yearly billing.',
        3: 'Add-ons help enhance your gaming experience.',
        4: 'Double-check everything looks OK before confirming.'
    };
    
    document.getElementById('form-title').textContent = titles[currentStep];
    document.getElementById('form-description').textContent = descriptions[currentStep];
}
//my modification
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep === totalSteps) {
            submitForm();
            updateFormHeader();
            updateNavigation();
        } else {
            showStep(currentStep + 1);
            updateFormHeader();
            updateNavigation();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
        updateFormHeader();
        updateNavigation();
    }
}

function goToStep(step) {
    if (step >= 1 && step <= totalSteps) {
        showStep(step);
        updateFormHeader();
        updateNavigation();
    }
}

function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update previous button
    if (currentStep === 1) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }
    
    // Update next button
    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Confirm';
        nextBtn.innerHTML = 'Confirm';
    } else {
        nextBtn.innerHTML = 'Next Step';
    }
    
}


function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validatePersonalInfo();
        case 2:
            return validatePlanSelection();
        case 3:
            return true; // Add-ons are optional
        case 4:
            return true; // Summary step
        default:
            return true;
    }
}

function validatePersonalInfo() {
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
        showError('phone', 'Phone number is required');
        isValid = false;
    }
    
    return isValid;
}

function validatePlanSelection() {
    if (!formData.plan) {
        showError('plan', 'Please select a plan');
        return false;
    }
    return true;
}

function validateField(fieldName, value) {
    switch (fieldName) {
        case 'name':
            if (!value.trim()) {
                showError('name', 'Name is required');
                return false;
            }
            break;
        case 'email':
            if (!value.trim()) {
                showError('email', 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showError('email', 'Please enter a valid email address');
                return false;
            }
            break;
        case 'phone':
            if (!value.trim()) {
                showError('phone', 'Phone number is required');
                return false;
            }
            break;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function setBilling(billing) {
    formData.billing = billing;
    
    // Update billing buttons
    document.querySelectorAll('.billing-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-billing="${billing}"]`).classList.add('active');
    
    // Update plan prices
    updatePlanPrices();
    
    // Update addon prices
    updateAddonPrices();
    
    // Update summary if on step 4
    if (currentStep === 4) {
        updateSummary();
    }
}

function updatePlanPrices() {
    const isYearly = formData.billing === 'yearly';
    
    document.querySelectorAll('.plan-card').forEach(card => {
        const monthlyPrice = card.querySelector('.monthly-price');
        const yearlyPrice = card.querySelector('.yearly-price');
        const yearlyBonus = card.querySelector('.yearly-bonus');
        
        if (isYearly) {
            monthlyPrice.classList.add('hidden');
            yearlyPrice.classList.remove('hidden');
            yearlyBonus.classList.remove('hidden');
        } else {
            monthlyPrice.classList.remove('hidden');
            yearlyPrice.classList.add('hidden');
            yearlyBonus.classList.add('hidden');
        }
    });
}

function updateAddonPrices() {
    const isYearly = formData.billing === 'yearly';
    
    document.querySelectorAll('.addon-card').forEach(card => {
        const monthlyPrice = card.querySelector('.monthly-price');
        const yearlyPrice = card.querySelector('.yearly-price');
        
        if (isYearly) {
            monthlyPrice.classList.add('hidden');
            yearlyPrice.classList.remove('hidden');
        } else {
            monthlyPrice.classList.remove('hidden');
            yearlyPrice.classList.add('hidden');
        }
    });
}

function selectPlan(planId) {
    formData.plan = planId;
    
    // Update plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-plan="${planId}"]`).classList.add('selected');
    
    // Clear plan error
    clearError('plan');
}
// add addons to the summary (my work)
function toggleAddon(addonId, isSelected) {
    const addon = addons[addonId];
    const addonPrice = formData.billing === 'yearly' ? addon.yearly : addon.monthly;
    if (isSelected) {
        if (!formData.addons.includes(addonId)) {
            formData.addons.push(addonId);
    
            document.getElementById('next-btn').addEventListener('click', function () {
                const addonsContainer = document.getElementById('summary-addons');
                addonsContainer.innerHTML = ''; // Clear previous content
    
                formData.addons.forEach(id => {
                    const addon = addons[id];
                    const addonPrice = formData.billing === 'yearly' ? addon.yearly : addon.monthly;
    
                    const addonElement = document.createElement('div');
                    addonElement.className = 'addon-summary';
                    addonElement.innerHTML = `
                        <span>${addon.name}</span>
                        <span>+$${addonPrice}/${formData.billing === 'yearly' ? 'yr' : 'mo'}</span> `;
                    addonsContainer.appendChild(addonElement);
                });
            });
        }
    }
     else {
        formData.addons = formData.addons.filter(id => id !== addonId);
    }
    
    // Update addon card appearance
    const addonCard = document.querySelector(`[data-addon="${addonId}"]`);
    if (isSelected) {
        addonCard.classList.add('selected');
    } else {
        addonCard.classList.remove('selected');
    }
}

function updateSummary() {
    // Update selected plan
    const selectedPlan = plans[formData.plan];
    const planPrice = formData.billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
    const billingText = formData.billing === 'yearly' ? 'Yearly' : 'Monthly';
    
    
    // Update selected addons
    const addonsContainer = document.getElementById('summary-addons');
    addonsContainer.innerHTML = '';
    
    formData.addons.forEach(addonId => {
        const addon = addons[addonId];
        const addonPrice = formData.billing === 'yearly' ? addon.yearly : addon.monthly;
        
        const addonElement = document.createElement('div');
        addonElement.className = 'addon-summary';
        addonElement.innerHTML = `
            <span>${addon.name}</span>
            <span>+$${addonPrice}/${formData.billing === 'yearly' ? 'yr' : 'mo'}</span>
        `;
        addonsContainer.appendChild(addonElement);
    });
    
    
    // Update total
    const total = calculateTotal();
    document.getElementById('total-price').textContent = `$${total}/${formData.billing === 'yearly' ? 'yr' : 'mo'}`;
    document.getElementById('total-period').textContent = formData.billing === 'yearly' ? 'year' : 'month';
    //adding selected plan to summary (my work)
    document.getElementById('next-btn').addEventListener('click', function () {
        const selectedPlan = plans[formData.plan];
        const planPrice = formData.billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
        const billingText = formData.billing === 'yearly' ? 'Yearly' : 'Monthly';
    
        document.getElementById('summary-plan-name').innerHTML = `${selectedPlan.name} (${billingText})`;
        document.getElementById('summary-plan-price').innerHTML = `$${planPrice}/${formData.billing === 'yearly' ? 'yr' : 'mo'}`;
    });
}

document.getElementById('next-btn').addEventListener('click', function () {
    updateSummary();
    calculateTotal();
});  

function calculateTotal() {
    let total = 0;
    
    // Add plan price
    if (formData.plan) {
        const selectedPlan = plans[formData.plan];
        const planPrice = formData.billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
        const billingText = formData.billing === 'yearly' ? 'Yearly' : 'Monthly';
        total += formData.billing === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly;
        
    }
    
    // Add addon prices
    formData.addons.forEach(addonId => {
        const addon = addons[addonId];
        total += formData.billing === 'yearly' ? addon.yearly : addon.monthly;
    });
    console.log(total);
    return total;
}

function submitForm() {
    // Show success modal
    document.getElementById('success-modal').classList.add('show');
    
    // Log form data (in real app, this would be sent to server)
    console.log('Form submitted:', formData);
    const stepEl = document.querySelectorAll('.step')[3]; // 4th step
    stepEl.classList.add('completed');
}

function closeModal() {
    document.getElementById('success-modal').classList.remove('show');
    
    // Reset form (optional)
    // resetForm();
}

function resetForm() {
    formData = {
        name: '',
        email: '',
        phone: '',
        plan: '',
        billing: 'monthly',
        addons: []
    };
    
    // Reset form inputs
    document.getElementById('multi-step-form').reset();
    
    // Reset selections
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Go back to step 1
    showStep(1);
}
// Make functions available globally for onclick handlers
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.closeModal = closeModal;

 

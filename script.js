class BikeCalculator {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.calculate();
    }

    initElements() {
        // Input elements
        this.purchaseCostInput = document.getElementById('purchaseCost');
        this.lifespanInput = document.getElementById('lifespan');
        this.serviceCostInput = document.getElementById('serviceCost');
        this.interestRateInput = document.getElementById('interestRate');
        this.deductionInput = document.getElementById('deduction');

        // Result elements
        this.maxCostZeroBenefitEl = document.getElementById('maxCostZeroBenefit');
        this.totalBenefitTaxEl = document.getElementById('totalBenefitTax');
        this.yearlyBenefitTaxEl = document.getElementById('yearlyBenefitTax');
        this.monthlyBenefitTaxEl = document.getElementById('monthlyBenefitTax');

        // Tab elements
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.resetButton = document.getElementById('resetSettings');
    }

    bindEvents() {
        // Calculate on input change
        const inputs = [
            this.purchaseCostInput,
            this.lifespanInput,
            this.serviceCostInput,
            this.interestRateInput,
            this.deductionInput
        ];

        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
        });

        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Reset settings
        this.resetButton.addEventListener('click', () => this.resetToDefaults());
    }

    switchTab(tabName) {
        // Update buttons
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabName) {
                content.classList.add('active');
            }
        });
    }

    calculate() {
        // Get input values
        const purchaseCost = parseFloat(this.purchaseCostInput.value) || 0;
        const lifespan = parseFloat(this.lifespanInput.value) || 6;
        const serviceCost = parseFloat(this.serviceCostInput.value) || 500;
        const interestRate = parseFloat(this.interestRateInput.value) / 100 || 0.0196;
        const deduction = parseFloat(this.deductionInput.value) || 3000;

        // Calculate max cost for zero benefit
        // Formula from Excel: (100*lifespan*(deduction-serviceCost))/(100*lifespan*interestRate+lifespan+100)
        const maxCostZeroBenefit = (100 * lifespan * (deduction - serviceCost)) /
            (100 * lifespan * interestRate + lifespan + 100);

        // Calculate benefit taxation
        // Formula from Excel: purchaseCost/lifespan + serviceCost + (purchaseCost*(0.01+interestRate))
        const totalBenefitTax = purchaseCost / lifespan + serviceCost + (purchaseCost * (0.01 + interestRate));

        // Apply deduction
        const yearlyBenefitTax = Math.max(0, totalBenefitTax - deduction);
        const monthlyBenefitTax = yearlyBenefitTax / 12;

        // Update display
        this.updateDisplay(maxCostZeroBenefit, totalBenefitTax, yearlyBenefitTax, monthlyBenefitTax);
    }

    updateDisplay(maxCost, totalTax, yearlyTax, monthlyTax) {
        this.maxCostZeroBenefitEl.textContent = this.formatCurrency(maxCost);
        this.totalBenefitTaxEl.textContent = this.formatCurrency(totalTax);
        this.yearlyBenefitTaxEl.textContent = this.formatCurrency(yearlyTax);
        this.monthlyBenefitTaxEl.textContent = this.formatCurrency(monthlyTax);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    }

    resetToDefaults() {
        this.lifespanInput.value = 6;
        this.serviceCostInput.value = 500;
        this.interestRateInput.value = 1.96;
        this.deductionInput.value = 3000;
        this.calculate();

        // Show success feedback
        this.showResetFeedback();
    }

    showResetFeedback() {
        const button = this.resetButton;
        const originalText = button.textContent;
        button.textContent = 'Återställt! ✓';
        button.style.background = '#10b981';
        button.style.color = 'white';
        button.style.borderColor = '#059669';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BikeCalculator();
});

// Add smooth scrolling and responsive handling
window.addEventListener('resize', () => {
    // Handle responsive adjustments if needed
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Handle tab navigation
    }
});

/**
 * @typedef {(...args: any[]) => string|null} validator
 */

/**
 * @typedef control
 * @type {object}
 * @property {HTMLInputElement} input - input field
 * @property {validator[]} validators - array of validation functions
 * @property {string[]} errors - array of errors for validatiors
 * @property {HTMLElement} errorField - html element to show error
 * @property {string[]} updateOn
 */

/**
 * @typedef formControl
 * @type {object}
 * @property {HTMLFormElement} el - form element
 * @property {string[]} errors - array of errors
 * @property {HTMLElement} errorField - html element to show error
 */


/**
 * Creates a new FormControl
 * @class
 */
export class FormControl {
    /**
     * @constructor
     * @param {control[]} _controls - array of controls
     * @param {formControl} _form
     */
    constructor(_controls, _form, _defaults) {
        this.controls_ = _controls;
        this.form_ = _form;
        this.values_ = {};
        this.valid_ = false;
        this.defaults_ = _defaults || {error: 'Error'};

        this.registerEvents_();
    }

    /**
     * @returns {object}
     */
    get values() {
        Object.keys(this.controls_).forEach(key => {
            this.values_[key] = this.controls_[key].input.value;
        });

        return this.values_;
    }

    onSubmit() {}

    registerEvents_() {
        Object.keys(this.controls_).forEach(key => {
            const updateOn = this.controls_[key].updateOn || ['blur'];

            updateOn.forEach(eventName => {
                this.controls_[key].input.addEventListener(eventName, () => {
                    this.validateControl(this.controls_[key]);
                });
            });
        });

        this.form_.el.addEventListener('submit', (e) => {
            e.preventDefault();

            this.clearFormErrors();
            this.checkControls();
            this.onSubmit();
        });
    }

    /**
     * 
     * @param {string} controlName 
     * @param {string} error 
     */
    setControlError(controlName, error) {
        this.valid_ = false;
        this.controls_[controlName].errorField.innerHTML = this.controls_[controlName].errors[error] || this.defaults_.error;
    }

    /**
     * 
     * @param {string} error 
     */
    setFormError(error) {
        this.valid_ = false;
        this.form_.errorField.innerHTML = this.form_.errors[error] || error;
    }

    clearFormErrors() {
        Object.keys(this.controls_).forEach(key => {
            this.clearControlError(this.controls_[key]);
        });

        this.clearControlError(this.form_);
    }

    checkControls() {
        this.valid_ = true;

        Object.keys(this.controls_).forEach(key => {
            this.validateControl(this.controls_[key]);
        });

        return this.valid_;
    }

    /**
     * 
     * @param {control} control 
     */
    clearControlError(control) {
        control.errorField.textContent = '';
    }

    /**
     * 
     * @param {control} control 
     */
    validateControl(control) {
        this.clearControlError(control);

        const value = control.input.value;

        control.validators.some(validator => {
            const validationResult = validator(value);

            if (!validationResult) return false;

            this.valid_ = false;
            control.errorField.textContent = control.errors[validationResult] || this.defaults_.error;
            return true;
        })
    }
}
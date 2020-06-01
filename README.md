# form-control-js

This package created to validate form fields and form.

## Installation

Using npm:

```
$ npm install form-control-js
```

## Usage


Create **form** object:

```javascript
const form = {
    el: document.querySelector('.form'),
    errors: {
        failed: `Form not pass validation`
    },
    errorField: document.querySelector('.error__form')
}
```

Create array of **controls**:

```javascript
const controls = {
    email: {
        input: document.querySelector('.input__email'),
        validators: [required(), email(), maxlength(255)],
        errors: {
            required: 'Email required',
            email: 'You entered an incorrect email address.',
            maxlength: 'This email address is too long (limit is 255 symbols).'
        },
        errorField: document.querySelector('.error__email')
    },
    types: {
        input: document.querySelector('.select__types'),
        validators: [required()],
        errors: {
            required: 'Please select types.'
        },
        errorField: document.querySelector('.error__types'),
        updateOn: ['change']
    }
}
```

Create FormControl instance:
```javascript
const formControl = new FormControl(controls, form);
```

**validators** are functions that get values and check it. If value pass validation - retun null. If invalid - return string with name of error.
Example:

```javascript
const required = () => (value) => {
    if (value.trim().length === 0) return 'required';

    return null;
}

const email = () => (value) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.trim().match(emailRegex)) return 'email';

    return null;
}
```

**errors** are object which contain error messages to validators. Error **key** is name of error which return validator.
For example **validator** `require()` return name "required". So the key of error is "required".

To listen **submit** event, create method `onSubmit`.
```javascript
formControl.onSubmit = async () => {
    if (!formControl.valid) return; //check is form valid

    console.log('Valid')
}
```
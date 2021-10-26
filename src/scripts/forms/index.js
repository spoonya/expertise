import IMask from 'imask';

import { CLASSES } from '../constants';

class FormValidation {
  constructor(selector, isCatalog = false) {
    this.form = document.querySelector(selector);
    if (!this.form) return;

    this.isCatalog = isCatalog;

    this.classes = {
      error: 'error',
      errorEl: 'form__error',
      formControlEl: 'form__control',
      success: 'success'
    };

    this.formElements = {
      username: this.form.querySelector('[data-form-name]'),
      userPhone: this.form.querySelector('[data-form-phone]'),
      userEmail: this.form.querySelector('[data-form-email]'),
      userMsg: this.form.querySelector('[data-form-message]'),
      userAgreements: this.form.querySelectorAll('[data-form-agreement]'),
      userSelects: [...this.form.querySelectorAll('[data-form-select]')]
    };

    this.defaultConfig = {
      username: {
        isRequired: true,
        errors: {
          empty: 'Введите имя'
        }
      },
      userPhone: {
        isRequired: true,
        maskLength: 16,
        maskOptions: {
          mask: '+{7}(000)000-00-00'
        },
        errors: {
          empty: 'Введите номер',
          invalid: 'Введите корректный номер'
        }
      },
      userEmail: {
        isRequired: true,
        errors: {
          empty: 'Введите E-mail',
          invalid: 'Некорректный E-mail'
        }
      },
      userAgreement: {
        isRequired: true,
        errors: {
          unchecked: 'Поле должно быть отмечено'
        }
      },
      userSelect: {
        isRequired: true,
        errors: {
          unselected: 'Выберите значение'
        }
      },
      userMsg: {
        isRequired: true,
        maxLength: 250,
        minLength: 8,
        errors: {
          empty: 'Введите сообщение',
          getMaxLength(length) {
            return `Не более ${length} символов`;
          },
          getMinLength(length) {
            return `Не менее ${length} символов`;
          }
        }
      }
    };

    if (this.formElements.userPhone) {
      IMask(
        this.formElements.userPhone,
        this.defaultConfig.userPhone.maskOptions
      );
    }
  }

  _validateEmail(email) {
    const regex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    return regex.test(String(email).toLowerCase());
  }

  _selectFormControl(input) {
    return input.closest(`.${this.classes.formControlEl}`);
  }

  _setError(input, message) {
    const formControl = this._selectFormControl(input);
    const error = formControl.querySelector(`.${this.classes.errorEl}`);

    error.textContent = message;
    formControl.classList.remove(this.classes.success);
    formControl.classList.add(this.classes.error);
  }

  _setSuccess(input) {
    const formControl = this._selectFormControl(input);

    formControl.classList.remove(this.classes.error);
    formControl.classList.add(this.classes.success);
  }

  _checkUsername(username, usernameValue, config) {
    if (config.isRequired && !usernameValue) {
      this._setError(username, config.errors.empty);

      return false;
    }

    this._setSuccess(username);

    return true;
  }

  _checkUserPhone(userPhone, userPhoneValue, config) {
    if (config.isRequired && !userPhoneValue) {
      this._setError(userPhone, config.errors.empty);

      return false;
    }

    if (userPhoneValue && userPhoneValue.length !== config.maskLength) {
      this._setError(userPhone, config.errors.invalid);

      return false;
    }

    this._setSuccess(userPhone);

    return true;
  }

  _checkUserEmail(userEmail, userEmailValue, config) {
    if (config.isRequired && !userEmailValue) {
      this._setError(userEmail, config.errors.empty);

      return false;
    }

    if (userEmailValue && !this._validateEmail(userEmailValue)) {
      this._setError(userEmail, config.errors.invalid);

      return false;
    }

    this._setSuccess(userEmail);

    return true;
  }

  _checkUserMessage(userMessage, userMessageValue, config) {
    if (config.isRequired && !userMessageValue) {
      this._setError(userMessage, config.errors.empty);

      return false;
    }

    if (userMessageValue.length && userMessageValue.length > config.maxLength) {
      this._setError(userMessage, config.errors.getMaxLength(config.maxLength));

      return false;
    }

    if (userMessageValue.length && userMessageValue.length < config.minLength) {
      this._setError(userMessage, config.errors.getMinLength(config.minLength));

      return false;
    }

    this._setSuccess(userMessage);

    return true;
  }

  _checkUserSelects(selects, config) {
    let isValid = true;

    selects.forEach((select) => {
      if (select.selectedIndex === 0 && config.isRequired) {
        isValid = false;
        this._setError(select, config.errors.unselected);
      } else {
        this._setSuccess(select);
      }
    });

    return isValid;
  }

  _checkAgreements(checkboxes, config) {
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked && config.isRequired) {
        this._setError(checkbox, config.errors.unchecked);

        return false;
      }

      this._setSuccess(checkbox);

      return true;
    });
  }

  _showAlert(isSuccess = true) {
    const links = {
      catalog: 'success-catalog.html',
      callback: 'success-callback.html'
    };

    const url = this.isCatalog
      ? `${window.location.protocol}//${document.domain}/${links.catalog}`
      : `${window.location.protocol}//${document.domain}/${links.callback}`;

    if (isSuccess) {
      document.location.href = url;
    }
  }

  _clearInputs() {
    Object.values(this.formElements).forEach((input) => {
      if (!input) return;

      if (!Array.isArray(input)) {
        input.value = '';

        if (input.type === 'checkbox') {
          input.checked = false;
        }

        this._selectFormControl(input).classList.remove(
          this.classes.success,
          this.classes.error
        );
      } else {
        input.forEach((el) => {
          el.selectedIndex = 0;

          this._selectFormControl(el).classList.remove(
            this.classes.success,
            this.classes.error
          );
        });
      }
    });
  }

  async _send() {
    this.form.classList.add(CLASSES.loading);

    const formData = new FormData(this.form);
    formData.append('form-name', this.form.name);

    try {
      const res = await fetch(
        `${window.location.protocol}//${document.domain}/sendmail.php`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (res.ok) {
        this._clearInputs();

        this._showAlert();
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.form) this.form.classList.remove(CLASSES.loading);
    }
  }

  validateOnSubmit(userConfig = {}) {
    if (!this.form) return;

    const config = { ...this.defaultConfig, ...userConfig };

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = [];

      if (this.formElements.username) {
        isValid.push(
          this._checkUsername(
            this.formElements.username,
            this.formElements.username.value.trim(),
            config.username
          )
        );
      }

      if (this.formElements.userPhone) {
        isValid.push(
          this._checkUserPhone(
            this.formElements.userPhone,
            this.formElements.userPhone.value.trim(),
            config.userPhone
          )
        );
      }

      if (this.formElements.userEmail) {
        isValid.push(
          this._checkUserEmail(
            this.formElements.userEmail,
            this.formElements.userEmail.value.trim(),
            config.userEmail
          )
        );
      }

      if (this.formElements.userMsg)
        isValid.push(
          this._checkUserMessage(
            this.formElements.userMsg,
            this.formElements.userMsg.value.trim(),
            config.userMsg
          )
        );

      if (this.formElements.userSelects) {
        isValid.push(
          this._checkUserSelects(
            this.formElements.userSelects,
            config.userSelect
          )
        );
      }

      if (this.formElements.userAgreements) {
        isValid.push(
          this._checkAgreements(
            this.formElements.userAgreements,
            config.userAgreement
          )
        );
      }

      if (isValid.includes(false)) {
        return;
      }

      this._send();
    });
  }
}

export default FormValidation;

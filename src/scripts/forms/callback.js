import FormValidation from './index';

function validateFormCallback() {
  const formValidation = new FormValidation('#form-callback');

  formValidation.validateOnSubmit();
}

export default validateFormCallback;

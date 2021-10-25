import FormValidation from './index';

function validateFormCallback() {
  const formValidation = new FormValidation('#form-callback', true);

  formValidation.validateOnSubmit();
}

export default validateFormCallback;

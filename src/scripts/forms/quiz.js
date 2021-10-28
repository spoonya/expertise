import FormValidation from './index';

function validateFormQuiz() {
  const formValidation = new FormValidation('#form-quiz');

  formValidation.validateOnSubmit();
}

export default validateFormQuiz;

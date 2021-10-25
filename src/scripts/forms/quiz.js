import FormValidation from './index';

function validateFormQuiz() {
  const formValidation = new FormValidation('#form-quiz', true);

  formValidation.validateOnSubmit();
}

export default validateFormQuiz;

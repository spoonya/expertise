const CLASSES = {
  active: 'active',
  loading: 'loading',
  modal: 'modal',
  modalContent: 'modal__content',
  scrollHidden: 'scroll-hidden'
};

const DOM = {
  body: document.querySelector('body'),
  overlay: document.querySelector('#overlay')
};

const QUIZ = {
  notQuizSlidesCount: 2,
  questionsCount: 5
};

export { CLASSES, DOM, QUIZ };

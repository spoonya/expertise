class Quiz {
  constructor(selector) {
    this.quiz = document.querySelector(selector);
    if (!this.quiz) return;

    this.config = {
      questionsCount: 5
    };

    this.quizElements = {
      counterCurrent: this.quiz.querySelector('[data-quiz-counter-current]'),
      counterTotal: this.quiz.querySelector('[data-quiz-counter-total]'),
      progressBar: this.quiz.querySelector('[data-quiz-counter-current]'),
      controls: this.quiz.querySelector('[data-quiz-controls]'),
      buttonNext: this.quiz.querySelector('[data-quiz-button-next]'),
      buttonPrev: this.quiz.querySelector('[data-quiz-button-prev]')
    };

    this.swiperQuiz = new Swiper(`${selector} .swiper-container`, {
      slidesPerColumnFill: 'row',
      autoHeight: true,

      spaceBetween: 20,

      resizeObserver: true,
      observer: true,
      observeParents: true,

      allowTouchMove: false,

      on: {
        init: () => {
          this._onInit();
        }
      },

      navigation: {
        nextEl: '[data-quiz-button-next]',
        prevEl: '[data-quiz-button-prev]'
      }
    });

    this.swiperQuiz.on('slideChange', () => {
      this._controlButtonsDisplay();
      this._controlPrevButtonDisplay();
      this._updateCounter();
    });
  }

  _controlButtonsDisplay() {
    if (this.swiperQuiz.realIndex + 1 === this.config.questionsCount) {
      this.quizElements.controls.style.display = 'none';
    }
  }

  _controlPrevButtonDisplay() {
    if (this.swiperQuiz.realIndex + 1 !== 1) {
      this.quizElements.buttonPrev.style.display = 'block';
    } else {
      this.quizElements.buttonPrev.style.display = 'none';
    }
  }

  _updateCounter() {
    this.quizElements.counterCurrent.textContent =
      this.swiperQuiz.realIndex + 1;
  }

  _setCounterInitValues() {
    this.quizElements.counterCurrent.textContent = 1;
    this.quizElements.counterTotal.textContent = this.config.questionsCount;
  }

  _onInit() {
    this._setCounterInitValues();
  }
}

export default Quiz;

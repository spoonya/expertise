import noUiSlider from 'nouislider';
import IMask from 'imask';
import wNumb from 'wnumb';

import { CLASSES } from '../constants';

class Quiz {
  constructor(selector) {
    this.quiz = document.querySelector(selector);
    if (!this.quiz) return;

    this.config = {
      questionsCount: 5,
      numFormat: wNumb({
        thousand: ' ',
        decimals: 0
      }),
      sliders: {
        square: {
          mask: null,
          min: 100,
          max: 1000000
        },
        estimateCount: {
          mask: null,
          min: 3,
          max: 300
        }
      }
    };

    this.quizElements = {
      counter: this.quiz.querySelector('[data-quiz-counter]'),
      counterCurrent: this.quiz.querySelector('[data-quiz-counter-current]'),
      counterTotal: this.quiz.querySelector('[data-quiz-counter-total]'),
      progressBar: this.quiz.querySelector('[data-quiz-progress]'),
      progressBarSteps: null,
      sliders: this.quiz.querySelectorAll('[data-quiz-slider]'),
      controls: this.quiz.querySelector('[data-quiz-controls]'),
      buttonNext: this.quiz.querySelector('[data-quiz-button-next]'),
      buttonPrev: this.quiz.querySelector('[data-quiz-button-prev]'),
      branches: this.quiz.querySelectorAll('[data-quiz-branch]'),
      branchedQuestions: this.quiz.querySelectorAll('[data-quiz-branched]')
    };

    // eslint-disable-next-line no-undef
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
      this._updateProgresBar(this.swiperQuiz.realIndex + 1);

      if (this.swiperQuiz.realIndex + 1 > this.config.questionsCount) {
        this._changeCounterText();
        this.quiz.querySelector('.swiper-container').style.minHeight = '52rem';
      }
    });
  }

  _controlButtonsDisplay() {
    if (this.swiperQuiz.realIndex + 1 > this.config.questionsCount) {
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

  _setActiveBranch(quizBranch) {
    this.quizElements.branchedQuestions.forEach((slide) => {
      if (slide.id !== quizBranch) {
        slide.style.display = 'none';
      } else {
        slide.style.display = 'unset';
      }
    });
  }

  _controlBranches() {
    if (!this.quizElements.branches.length) return;

    this.quizElements.branches.forEach((input) => {
      if (input.checked) {
        const { quizBranch } = input.dataset;

        this._setActiveBranch(quizBranch);
      }
    });

    this.quizElements.branches.forEach((input) => {
      input.addEventListener('change', () => {
        const { quizBranch } = input.dataset;

        this._setActiveBranch(quizBranch);
      });
    });
  }

  _updateProgresBar(currentSlideIndex) {
    if (currentSlideIndex > this.config.questionsCount) return;

    this.quizElements.progressBarSteps.forEach((step, idx) => {
      if (idx > 0) step.classList.remove(CLASSES.active);
    });

    for (let i = 1; i < currentSlideIndex; i++) {
      this.quizElements.progressBarSteps[i].classList.add(CLASSES.active);
    }
  }

  _initProgressBar() {
    const progressStepTemplate =
      '<div class="quiz__progressbar-step" data-quiz-progress-step=""></div>';

    for (let i = 0; i < this.config.questionsCount; i++) {
      this.quizElements.progressBar.insertAdjacentHTML(
        'beforeend',
        progressStepTemplate
      );

      if (i === 0) {
        this.quizElements.progressBar
          .querySelector('[data-quiz-progress-step]')
          .classList.add(CLASSES.active);
      }
    }

    this.quizElements.progressBarSteps =
      this.quizElements.progressBar.querySelectorAll(
        '[data-quiz-progress-step]'
      );
  }

  _getSliderInput(slider) {
    return slider.closest('.form__control').querySelector('input');
  }

  _updateSliderInput(slider) {
    const input = this._getSliderInput(slider);
    input.value = slider.noUiSlider.get();
    this.config.sliders[slider.dataset.quizSlider].mask.updateValue(
      slider.noUiSlider.get()
    );
  }

  _updateSliderOnInput(input, slider) {
    input.addEventListener('change', () => {
      slider.noUiSlider.set(input.value);
    });
  }

  _setSliderMaxMinLabels(slider) {
    const lowerValue = slider
      .closest('.form__control')
      .querySelector('[data-quiz-slider-lower]');
    const upperValue = slider
      .closest('.form__control')
      .querySelector('[data-quiz-slider-upper]');

    lowerValue.textContent = this.config.numFormat.to(
      this.config.sliders[slider.dataset.quizSlider].min
    );
    upperValue.textContent = this.config.numFormat.to(
      this.config.sliders[slider.dataset.quizSlider].max
    );
  }

  _setNumberMask({ quizSlider, input, min, max }) {
    this.config.sliders[quizSlider].mask = IMask(input, {
      mask: Number,
      scale: 0,
      signed: false,
      thousandsSeparator: ' ',
      padFractionalZeros: false,
      normalizeZeros: true,
      radix: ',',
      mapToRadix: ['.'],
      min,
      max
    });
  }

  _initSliders() {
    this.quizElements.sliders.forEach((slider) => {
      const { quizSlider } = slider.dataset;

      noUiSlider.create(slider, {
        start: this.config.sliders[quizSlider].min,
        step: 1,
        connect: 'lower',
        format: this.config.numFormat,
        range: {
          min: this.config.sliders[quizSlider].min,
          max: this.config.sliders[quizSlider].max
        }
      });

      this._setSliderMaxMinLabels(slider);

      this._setNumberMask({
        quizSlider,
        input: this._getSliderInput(slider),
        min: this.config.sliders[quizSlider].min,
        max: this.config.sliders[quizSlider].max
      });

      this._updateSliderOnInput(this._getSliderInput(slider), slider);
      slider.noUiSlider.on('update', () => this._updateSliderInput(slider));
    });
  }

  _changeCounterText() {
    this.quizElements.counter.textContent = 'Почти готово';
  }

  _onInit() {
    this._setCounterInitValues();
    this._controlBranches();
    this._initProgressBar();
    this._initSliders();
  }
}

export default Quiz;

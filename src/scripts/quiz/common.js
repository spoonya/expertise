import { QUIZ } from '../constants';

function progressMinus(progress) {
  if (progress.value > 1) {
    progress.value -= 1;
  }
}

function progressPlus(progress) {
  if (progress.value < QUIZ.questionsCount) {
    progress.value += 1;
  }
}

function controlProgress({ buttonPrev, buttonNext, progress }) {
  buttonPrev.addEventListener('click', () => progressMinus(progress));
  buttonNext.addEventListener('click', () => progressPlus(progress));
}

function controlRadioButtons({
  slider,
  progress,
  quizDesignNo,
  quizDesignYes,
  quizUploadBlock,
  questionPlace,
  questionSquare
}) {
  quizDesignNo.addEventListener('change', () => {
    quizUploadBlock.style.display = 'none';

    setTimeout(() => {
      progressPlus(progress);
      slider.slideNext();
    }, 500);
  });

  quizDesignYes.addEventListener('change', () => {
    quizUploadBlock.style.display = 'block';
  });

  questionPlace.querySelectorAll('[type="radio"]').forEach((el) => {
    el.addEventListener('change', () => {
      setTimeout(() => {
        progressPlus(progress);
        slider.slideNext();
      }, 500);
    });
  });

  questionSquare.querySelectorAll('[type="radio"]').forEach((el) => {
    el.addEventListener('change', () => {
      setTimeout(() => {
        progressPlus(progress);
        slider.slideNext();
      }, 500);
    });
  });
}

export {
  onInit,
  onSlideChange,
  controlUpload,
  controlRadioButtons,
  controlProgress
};

/* eslint-disable no-unused-vars */
import 'core-js/es6/promise';
import 'regenerator-runtime/runtime';

import validateFormCallback from './forms/callback';
import validateFormQuiz from './forms/quiz';
import initQuiz from './quiz/quiz';

validateFormCallback();
validateFormQuiz();

initQuiz();

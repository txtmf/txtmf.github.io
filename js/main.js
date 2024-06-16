import model from "./model/QuizoidModel.js";
import view from "./view/QuizoidView.js";
import controller from "./controller/QuizoidController.js";

const quizoidModel = new model();
const quizoidView = new view(quizoidModel);
const quizoidController = new controller(quizoidModel, quizoidView);
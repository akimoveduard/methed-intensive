const choicesElem = document.querySelector('.js-choice');
const choices = new Choices(choicesElem, {
  allowHTML: true,
  searchEnabled: false,
  itemSelectText: '',
});
const WORDS = [
  'зомби',
  'попка',
  'герда',
  'вруша',
  'кроха',
];
let currentWordIndex = 0;
let WORD = WORDS[currentWordIndex];

const CLASSES = {
  right: 'right',
  semiright: 'semiright',
  wrong: 'wrong',
};
const MAX_ROWS = 6;
let currentRow = 1;

const allInputs = document.querySelectorAll('.input');
const initialInputs = document.querySelectorAll('.row-initial .input');
const submitButton = document.querySelector('.button');
const winText = document.querySelector('.win-text');
const loseText = document.querySelector('.lose-text');
const loveHeart = document.querySelector('.love-heart');
const rightWord = document.querySelector('.right-word');

let currentInputs = initialInputs;

start(currentInputs);

function start(inputs = currentInputs, button = submitButton) {
  allInputs.forEach(input => input.disabled = "true");

  let currentInputs = Array.from(inputs);
  const handlers = initInputs(currentInputs);
  currentInputs[0].focus();
  
  const escapeButtonHandler = escapeButtonPress(currentInputs);

  window.addEventListener('keydown', escapeButtonHandler);

  createButtonHandler(button, currentInputs, handlers, escapeButtonHandler);
}

function escapeButtonPress(currentInputs) {
  return (event) => {
    const isRightButton = event.key === 'Backspace';
    if (!isRightButton) {
      return;
    }

    const activeInput = document.activeElement;
    if (activeInput.value) {
      return;
    }

    const acitveInputIndex = Array.from(currentInputs).indexOf(activeInput);
    if (acitveInputIndex !== -1 && acitveInputIndex !== 0 ) {
      currentInputs[acitveInputIndex - 1].focus();
    }
  }
}

function initInputs(inputs) {
  const handlers = inputs.map((input, index) => {
    input.disabled = false;
    const handler = (event) => {
      inputHandler(event, inputs, index)
    };
    input.addEventListener('beforeinput', handler);
    return handler;
  });
  return handlers;
}

function clearInputs(inputs, handlers) {
  inputs.forEach((input, index) => {
    input.disabled = "true";
    input.removeEventListener('beforeinput', handlers[index]);
  })
}

function inputHandler(event, inputs, index) {
  const { target, data } = event;

  if (target.value) {
    event.preventDefault();
    if (!data) {
      target.value = '';
      return;
    }

    const isLastEl = index === inputs.length - 1;
    if (isLastEl) {
      return;
    }

    inputs[index + 1].value = data;
    inputs[index + 1].focus();
    return;
  }
  
  const isFirstInput = index === 0;
  if (isFirstInput || data) {
    return;
  }

  inputs[index - 1].focus();
}

function createButtonHandler(button, currentInputs, handlers, escapeButtonHandler) {
   button.addEventListener('click', function buttonHandler() {
    const resultWord = currentInputs.map(input => input.value).join('').toLowerCase();
    if (resultWord.length !== 5) {
      return;
    }

    currentInputs.forEach((input, index) => {
      const rightLetter = WORD[index].toUpperCase();
      const userLetter = input.value.toUpperCase();
      const wordIncludesLetter = WORD.includes(input.value);

      input.disabled = "true";

      if (rightLetter === userLetter) {
        input.classList.add(CLASSES.right);
      } else if (wordIncludesLetter) {
        input.classList.add(CLASSES.semiright);
      } else {
        input.classList.add(CLASSES.wrong);
      }
    });

    clearInputs(currentInputs, handlers);
    button.removeEventListener('click', buttonHandler);
    window.removeEventListener('keydown', escapeButtonHandler);

    currentRow += 1;

    const isRightWord = WORD === resultWord;
    const isLastRow = currentRow > MAX_ROWS;
    const isGameEnded = isRightWord || isLastRow;

    
    if (!isGameEnded) {
      currentInputs = document.querySelectorAll(`.row-${currentRow} .input`);
      start(currentInputs);
      return;
    }

    if (isRightWord) {
      showWin();
    } else if (isLastRow) {
      showLose();
    }

    setButtonRestartHandler(button);
   })
}

function restart({ target }) {
  WORD = WORDS[currentWordIndex];
  currentRow = 1;

  allInputs.forEach(input => {
    input.value = "";
    input.disabled = "true";
    input.classList.remove(...Object.values(CLASSES));
  });

  target.textContent = "Проверить";
  hideWin();
  hideLost();

  currentInputs = document.querySelectorAll('.row-initial .input');
  start(currentInputs);
}

function setButtonRestartHandler(button) {
  currentWordIndex += 1;

  if (currentWordIndex === WORDS.length) {
    button.textContent = "Всё";
    button.addEventListener('click', () => {
      loveHeart.classList.add('visible');
      loveHeart.addEventListener('transitionend', function heartHandler() {
        setTimeout(() => {
          loveHeart.classList.remove('visible');
        }, 1000)
      }, { once: true });
    })
    return;
  }

  button.textContent = "Следующее слово";
  button.addEventListener('click', restart, { once: true });
}

function showLose() {
  loseText.style.display = 'block';
  rightWord.style.display = 'block';
  rightWord.textContent = `Это было слово: ${WORD.toUpperCase()}`;
}

function hideLost() {
  loseText.style.display = 'none';
  rightWord.style.display = 'none';
  rightWord.textContent = '';
}

function showWin() {
  winText.style.display = 'block';
}

function hideWin() {
  winText.style.display = 'none';
}
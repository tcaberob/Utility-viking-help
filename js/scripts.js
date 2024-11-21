document.addEventListener('DOMContentLoaded', function () {

  // Variables and Constants

  /**
   * A reference to the HTML element with the ID 'input-container-CR'.
   * @type {HTMLElement}
   */
  const inputContCR = document.getElementById('input-container-CR');

  /**
   * A reference to the DOM element with the ID 'liveToast'.
   * @type {HTMLElement}
   */
  const liveToast = document.getElementById('liveToast');

  /**
   * Regular expression pattern that matches digits (0-9) and the letters 'k', 'm', 'b', 't' 
   * in both uppercase and lowercase.
   * 
   * @type {RegExp}
   */
  const patternKeyDown = /[\d.kmbt]/i;

  /**
   * Regular expression pattern to validate resource values.
   * 
   * The pattern matches:
   * - A non-zero digit followed by any number of digits (e.g., 1, 23, 456).
   * - An optional decimal point followed by one or two digits (e.g., 1.2, 23.45).
   * - An optional suffix indicating a multiplier (k, m, b, t) in either uppercase or lowercase.
   * 
   * Examples of valid inputs:
   * - "1"
   * - "23.45"
   * - "100k"
   * - "1.2M"
   * 
   * Examples of invalid inputs:
   * - "012" (leading zero)
   * - "1.234" (more than two decimal places)
   * - "100x" (invalid suffix)
   * 
   * @type {RegExp}
   */
  const patternInputResources = /^(?!0\d)[1-9]\d*(?:\.\d{1,2})?([kmbt])?$/i;

  /**
   * Instance of Bootstrap Toast component.
   * 
   * @type {bootstrap.Toast}
   */
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(liveToast);

  /**
   * An array to store the validation status of input data.
   * Each element in the array represents whether a specific input data is valid (true) or invalid (false).
   * @type {boolean[]}
   */
  let inputsDataIsValid = [];

  /**
   * An array of resource impulsors, each containing information about the type, 
   * the resources it can be used on, and the available formats with their respective values.
   * 
   * @typedef {Object} Formato
   * @property {number} id - The unique identifier for the format.
   * @property {string} formato - The format description.
   * @property {number} valor - The value associated with the format.
   * 
   * @typedef {Object} Impulsor
   * @property {number} type - The type of the impulsor.
   * @property {string[]} usedOn - The resources that the impulsor can be used on.
   * @property {Formato[]} formatos - The available formats for the impulsor.
   * 
   * @type {Impulsor[]}
   */
  const resorcesImpulsors = [
    {
      type: 1,
      usedOn: ["comida"],
      formatos: [
        { id: 1, formato: "15k", valor: 15000 },
        { id: 2, formato: "75k", valor: 75000 },
        { id: 3, formato: "250k", valor: 250000 },
        { id: 4, formato: "1m", valor: 1000000 },
        { id: 5, formato: "3m", valor: 3000000 },
      ],
    },
    {
      type: 2,
      usedOn: ["madera", "hierro", "piedra"],
      formatos: [
        { id: 1, formato: "5k", valor: 5000 },
        { id: 2, formato: "25k", valor: 25000 },
        { id: 3, formato: "15k", valor: 15000 },
        { id: 4, formato: "75k", valor: 75000 },
        { id: 5, formato: "250k", valor: 250000 },
        { id: 6, formato: "750k", valor: 750000 },
        { id: 7, formato: "1.5m", valor: 1500000 },
      ],
    },
    {
      type: 3,
      usedOn: ["plata"],
      formatos: [
        { id: 1, formato: "1.5k", valor: 1500 },
        { id: 2, formato: "7.5k", valor: 7500 },
        { id: 3, formato: "25k", valor: 25000 },
        { id: 4, formato: "100k", valor: 100000 },
        { id: 5, formato: "300k", valor: 300000 },
        { id: 6, formato: "750k", valor: 750000 },
      ],
    }
  ];
  // End Variables---------------------------------------------------------------

  // Functions
  /**
   * Generates a list of resources and impulsors, creating HTML elements dynamically
   * and appending them to the corresponding unordered list (ul) elements in the DOM.
   * 
   * This function iterates over the `resorcesImpulsors` array, and for each item,
   * it iterates over the `usedOn` array to determine where the item should be used.
   * It then creates list items (li) with buttons containing formatted data and appends
   * them to the appropriate ul elements.
   * 
   * The generated button contains:
   * - A badge span displaying the format.
   * - A strong element with a multiplication sign.
   * - A span element with attributes for type, id, and value, and a unique ID.
   */
  function generateListResourcesImpulsors() {
    for (const item of resorcesImpulsors) {
      for (const usedOn of item.usedOn) {
        let ul = document.getElementById("list-cr-" + usedOn),
          /**
           * Initializes a counter for unique IDs.
           * @type {number}
           */
          counter = 1;

        item.formatos.forEach(formato => {
          /**
           * Creates a new 'li' (list item) HTML element.
           * @type {HTMLLIElement}
           */
          const li = document.createElement('li');
          li.classList.add('list-group-item');

          /**
           * Creates a new button element.
           * @type {HTMLButtonElement}
           */
          const button = document.createElement('button');
          button.classList.add('btn', 'btn-dark', 'text-decoration-none');
          button.type = 'button';

          /**
           * Creates a new <span> element to be used as a badge.
           * @type {HTMLSpanElement}
           */
          const badgeSpan = document.createElement('span');
          badgeSpan.classList.add('badge', 'text-bg-success');
          badgeSpan.textContent = formato.formato;

          /**
           * Creates a new <strong> HTML element.
           * @type {HTMLElement}
           */
          const strongX = document.createElement('strong');
          strongX.textContent = ' x';

          /**
           * Creates a new <span> element and assigns it to the variable `spanSolve`.
           * This element can be used to display or contain text or other inline elements.
           */
          const spanSolve = document.createElement('span');
          spanSolve.textContent = '~';
          spanSolve.setAttribute("data-type", item.type);
          spanSolve.setAttribute("data-id", formato.id);
          spanSolve.setAttribute("data-value", formato.valor);
          spanSolve.id = 'solve-' + usedOn + "-" + counter;
          counter++;

          // Assemble the button
          button.appendChild(badgeSpan);
          button.appendChild(strongX);
          button.appendChild(spanSolve);

          // Assemble the li
          li.appendChild(button);

          // Append the li to the ul
          ul.appendChild(li);
        });
      }
    }
  }

  /**
   * Converts a string representing a number with optional suffixes (k, m, b, t) into a numerical value.
   * 
   * The function handles the following suffixes:
   * - 'k' for thousand (10^3)
   * - 'm' for million (10^6)
   * - 'b' for billion (10^9)
   * - 't' for trillion (10^12)
   * 
   * If the input contains a decimal point, the function adjusts the numerical value accordingly.
   * 
   * @param {HTMLInputElement} target - The input element containing the value to be converted.
   * @returns {number} - The numerical value represented by the input string.
   */
  function defineNumberOfInput(target) {
    let text = target.value,
      haveLetter = text.match(/[kmbt]/i) ? true : false,
      havePoint = text.includes('.'),
      letter = "",
      amountCifrasPointRigth = 0;
    if (havePoint) {
      let tempPoint = text.split('.');
      amountCifrasPointRigth = tempPoint[1].length - (haveLetter ? 1 : 0);
    }
    if (haveLetter) {
      let temp = text.slice(0, text.match(/[kmbt]/i).index);
      letter = text.slice(text.match(/[kmbt]/i).index).toLowerCase();

      switch (letter) {
        case 'k':
          letter = "000";
          break;
        case 'm':
          letter = "000000";
          break;
        case 'b':
          letter = "000000000";
          break;
        case 't':
          letter = "000000000000";
          break;

        default:
          letter = "";
          break;
      }
      letter = letter.length > 0 ? (letter.slice(0, letter.length - amountCifrasPointRigth)) : 0;
      text = (havePoint ? temp.split('.').join('') : temp) + letter;
    }
    return parseFloat(text);
  }

  /**
   * Calculates and updates the resource impulsors for a given target input element.
   *
   * @param {HTMLElement} target - The target input element whose resources are to be calculated.
   */
  function calculateResourcesImpulsors(target) {
    let resource = target.id.replace('input-', ''),
      spanSolvesAll = inputContCR.querySelectorAll(`[id^="solve-${resource}"]`),
      realNumberOfInput = inputsDataIsValid[target.id] ? defineNumberOfInput(target) : 0;

    spanSolvesAll.forEach(spanSolve => {
      let result;
      if (inputsDataIsValid[target.id]) {// if the input is valid
        let type = spanSolve.getAttribute('data-type'),
          id = spanSolve.getAttribute('data-id'),
          impulse = resorcesImpulsors[type - 1].formatos.find(formato => formato.id == id).valor;
        if (realNumberOfInput >= impulse) {
          // Calculate the number of impulses required to reach the input value, rounded up
          result = Math.ceil(realNumberOfInput / impulse);
        } else {
          result = 1;
        }
      }
      // If the input is invalid, set the result to 'n/a'
      result = result ? result : "n/a";

      spanSolve.textContent = '~' + result;
    });
  }

  /**
   * Displays feedback for a given input element.
   *
   * @param {HTMLElement} target - The input element to show feedback for.
   * @param {string} message - The feedback message to display.
   * @param {boolean} [isValid=false] - Indicates whether the input is valid or not.
   */
  function showFeedback(target, message, isValid = false) {
    let errorCont = inputContCR.querySelector("#" + target.id + '-feedback');

    target.classList.toggle("is-valid", isValid);
    target.classList.toggle("is-invalid", !isValid);

    errorCont.textContent = message ? message : ' ';
    errorCont.classList.toggle("valid-feedback", isValid);
    errorCont.classList.toggle("invalid-feedback", !isValid);

    if (isValid) {
      inputsDataIsValid[target.id] = true;
    } else {
      inputsDataIsValid[target.id] = false;
    }
  }

  /**
   * Adds a horizontal shake animation to the specified element.
   * The animation is removed after 900 milliseconds.
   *
   * @param {HTMLElement} element - The DOM element to which the shake animation will be added.
   */
  function addAnimationShakeHorizontal(element) {
    element.classList.add('shake-horizontal');
    setTimeout(() => {
      element.classList.remove('shake-horizontal');
    }, 900);
  }

  // Execute functions
  generateListResourcesImpulsors()
  // End Functions---------------------------------------------------------------


  // Listeners events
  // Event to validate the keydown event within the resource calculator inputs
  inputContCR.addEventListener('keydown', e => {
    if (!(e.ctrlKey && e.key === 'v') && !(e.ctrlKey && e.key === 'c') &&
      e.key !== 'Backspace' && e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' &&
      e.key !== 'Home' && e.key !== 'End' &&
      !e.ctrlKey &&
      !patternKeyDown.test(e.key)) {
      e.preventDefault();
      addAnimationShakeHorizontal(e.target);
    }
  });

  // Event to validate the paste event within the resource calculator inputs
  inputContCR.addEventListener('paste', e => {
    let clipboardData = e.clipboardData.getData('text');
    if (clipboardData.length > 0) {
      if ((e.target.selectionStart === 0 && !patternInputResources.test(clipboardData)) ||
        !(/^[0-9]\d*(?:\.\d{1,2})?([kmbt])?$/i.test(clipboardData))) {
        e.preventDefault();
        const userLang = navigator.language || navigator.userLanguage;
        let errorMessage = {
          en: {
            header: 'Paste Error',
            body: `
              <strong>Field:</strong> ${e.target.id}<br>
              <strong>Invalid value:</strong> ${clipboardData}<br>
              <span>Does not meet the required format.</span>
            `
          },
          es: {
            header: 'Error de Pegado',
            body: `
              <strong>Campo:</strong> ${e.target.id}<br>
              <strong>Valor inválido:</strong> ${clipboardData}<br>
              <span>No cumple con el formato requerido.</span>
            `
          }
        };

        let message = errorMessage[userLang.startsWith('es') ? 'es' : 'en'];

        liveToast.querySelector('.toast-header strong').textContent = message.header;
        liveToast.querySelector('.toast-body').innerHTML = message.body;
        toastBootstrap.show();
        addAnimationShakeHorizontal(e.target);
      }
    }
  });

  // Event to validate the input event within the resource calculator inputs
  inputContCR.addEventListener('input', e => {
    if (!patternInputResources.test(e.target.value)) {
      showFeedback(e.target, 'Valor no válido, no cumple con el formato requerido');
      addAnimationShakeHorizontal(e.target);
    } else {
      showFeedback(e.target, '', true);
    }
    calculateResourcesImpulsors(e.target);
  });
  // End Listeners events--------------------------------------------------------
});
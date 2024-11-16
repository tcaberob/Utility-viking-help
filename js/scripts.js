document.addEventListener('DOMContentLoaded', function () {

  // Variables-------------------------------------------------------------------
  let inputContCR = document.getElementById('input-container-CR'),
    liveToast = document.getElementById('liveToast'),
    patternKeyDown = /[\d.kmbt]/i, //patron que acepta numeros y las letras k, m, b, t en mayusculas y minusculas
    patternInputResources = /^(?!0\d)[1-9]\d*(?:\.\d{1,2})?([kmbt])?$/i, //patron para validar el valor de los recursos
    inputIdNames = [],
    inputsDataIsValid = [];

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(liveToast);
  //arreglo formato json de los recursos y los impulsores
  let resorcesImpulsors = [
    {
      "type": 1,
      "usedOn": ["comida"],
      "formatos": [
        { "id": 1, "formato": "15k", "valor": 15000 },
        { "id": 2, "formato": "75k", "valor": 75000 },
        { "id": 3, "formato": "250k", "valor": 250000 },
        { "id": 4, "formato": "1m", "valor": 1000000 },
        { "id": 5, "formato": "3m", "valor": 3000000 },
      ],
    },
    {
      "type": 2,
      "usedOn": ["madera", "hierro", "piedra"],
      "formatos": [
        { "id": 1, "formato": "5k", "valor": 5000 },
        { "id": 2, "formato": "25k", "valor": 25000 },
        { "id": 3, "formato": "15k", "valor": 15000 },
        { "id": 4, "formato": "75k", "valor": 75000 },
        { "id": 5, "formato": "250k", "valor": 250000 },
        { "id": 6, "formato": "750k", "valor": 750000 },
        { "id": 7, "formato": "1.5m", "valor": 1500000 },
      ],
    },
    {
      "type": 3,
      "usedOn": ["plata"],
      "formatos": [
        { "id": 1, "formato": "1.5k", "valor": 1500 },
        { "id": 2, "formato": "7.5k", "valor": 7500 },
        { "id": 3, "formato": "25k", "valor": 25000 },
        { "id": 4, "formato": "100k", "valor": 100000 },
        { "id": 5, "formato": "300k", "valor": 300000 },
        { "id": 6, "formato": "750k", "valor": 750000 },
      ],
    }
  ];
  // End Variables---------------------------------------------------------------

  // Funciones-------------------------------------------------------------------
  // Funcion para definir los nombres de los inputs segun su id dentro del contenedor inputContCR
  function setInputIdNames() {
    inputIdNames = Array.from(inputContCR.querySelectorAll('input')).map(input => input.id);
  }  

  //Funcion para agregar los elementos li al ul de la lista de recursos impulsos segun el tipo de recurso
  function generateListResourcesImpulsors() {
    for (const item of resorcesImpulsors) {
      for (const usedOn of item.usedOn) {
        let ul = document.getElementById("list-cr-" + usedOn),
          counter = 1; // Inicializa un contador para IDs únicos

        item.formatos.forEach(formato => {
          // Crea el <li>
          const li = document.createElement('li');
          li.classList.add('list-group-item');

          // Crea el <button>
          const button = document.createElement('button');
          button.classList.add('btn', 'btn-dark', 'text-decoration-none');
          button.type = 'button';

          // Crea el badge <span>
          //Arreglar este------------
          const badgeSpan = document.createElement('span');
          badgeSpan.classList.add('badge', 'text-bg-success');
          badgeSpan.textContent = formato.formato;

          // Crea el <strong> x
          const strongX = document.createElement('strong');
          strongX.textContent = ' x';

          // Crea el <span> calculo de impulso
          const spanSolve = document.createElement('span');
          spanSolve.textContent = '~';
          spanSolve.setAttribute("data-type", item.type);
          spanSolve.setAttribute("data-id", formato.id);
          spanSolve.setAttribute("data-value", formato.valor);
          spanSolve.id = 'solve-' + usedOn + "-" + counter;
          counter++;

          // Emsambla el button
          button.appendChild(badgeSpan);
          button.appendChild(strongX);
          button.appendChild(spanSolve);

          // Emsambla el li
          li.appendChild(button);

          // Agrega el li al ul
          ul.appendChild(li);
        });
      }
    }
  }

  //function para definir numero segun input
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

  //function para calcular los recursos y los impulsores segun el input
  function calculateResourcesImpulsors(target) {
    let resource = target.id.replace('input-', ''),
      spanSolvesAll = inputContCR.querySelectorAll(`[id^="solve-${resource}"]`),
      realNumberOfInput = inputsDataIsValid[target.id] ? defineNumberOfInput(target) : 0;

    spanSolvesAll.forEach(spanSolve => {
      let result;
      if (inputsDataIsValid[target.id]) {//calcular
        let type = spanSolve.getAttribute('data-type'),
          id = spanSolve.getAttribute('data-id'),
          impulse = resorcesImpulsors[type - 1].formatos.find(formato => formato.id == id).valor;
        if (realNumberOfInput >= impulse) {
          //Dividir realNumberOfInput / impulse y si es decimal redondear hacia arriba
          result = Math.ceil(realNumberOfInput / impulse);
        } else {
          result = 1;
        }
      }
      //si result es null o es undefined dar un valor por defecto
      result = result ? result : "n/a";

      //result = result ? result : "n/a";
      spanSolve.textContent = '~' + result;
    });
  }

  // Función para mostrar mensajes personalizados
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

  // Funcion para agregar class de animacion al input que no cumple con el patron
  function addAnimationShakeHorizontal(element) {
    element.classList.add('shake-horizontal');
    setTimeout(() => {
      element.classList.remove('shake-horizontal');
    }, 900);
  }

  // Ejecutar funciones
  generateListResourcesImpulsors()
  setInputIdNames();
  // setOldValues();
  // End Funciones---------------------------------------------------------------


  //eventos de escucha---------------------------------------------------------
  inputContCR.addEventListener('keydown', e => {
    console.log(e);
    if (!(e.ctrlKey && e.key === 'v') && !(e.ctrlKey && e.key === 'c') &&
      e.key !== 'Backspace' && e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' &&
      e.key !== 'Home' && e.key !== 'End' &&
      !e.ctrlKey &&
      !patternKeyDown.test(e.key)) {
      e.preventDefault();
      addAnimationShakeHorizontal(e.target);
    }
    console.log("keydown");
  });

  // Evento para validar el ctlr + v dentro del los inputs de calculadora de recursos
  inputContCR.addEventListener('paste', e => {
    let clipboardData = e.clipboardData.getData('text');
    if (clipboardData.length > 0) {
      if ((e.target.selectionStart === 0 && !patternInputResources.test(clipboardData)) ||
        !(/^[0-9]\d*(?:\.\d{1,2})?([kmbt])?$/i.test(clipboardData))) {
        e.preventDefault();
        liveToast.querySelector('.toast-header strong').textContent = 'Paste no complete: ' + e.target.id;
        liveToast.querySelector('.toast-body').textContent = 'Valor no válido: (' + clipboardData + '), no cumple con el formato requerido';
        toastBootstrap.show();
        addAnimationShakeHorizontal(e.target);
      }
    }
    console.log("paste");
  });

  inputContCR.addEventListener('input', e => {
    if (!patternInputResources.test(e.target.value)) {
      showFeedback(e.target, 'Valor no válido, no cumple con el formato requerido');
      addAnimationShakeHorizontal(e.target);
    } else {
      showFeedback(e.target, '', true);
    }
    calculateResourcesImpulsors(e.target);
  });
  //eventos de escucha---------------------------------------------------------
  //Lo siguiente es dar los conjunto de impulsores y recursos y hacer el calculo automatico
});
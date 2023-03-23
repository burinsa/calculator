
// let form = document.querySelector('.form');
// let pianos = document.querySelectorAll('input[name="piano_type"]');
let royals = document.querySelectorAll('input[name="type"]');
var btnSubmit = document.getElementById("btn-submit");
let calcForm = document.querySelector('.form');
let btnOrderNow = document.getElementById("btn-order-now");

let outputSum = document.querySelector('.total-sum_value');
let orderTitle = document.querySelector('.order-title');
let forteType = document.getElementById('forte_type');
let totalSum = document.getElementById('total_sum');
var tabs = document.querySelectorAll(".calculator");
let currentTab = 0; // Current tab is set to be the first tab (0)


let sum = 0;
let pianoPrice = 0;
let royalPrice = 0;
let pianoMin = 0;
let royalMin = 0;
let amoutMkad = 0;
let amoutFloorFrom = 0;
let amoutFloorTo = 0;
let noLift = false;

/// code security
let numRand = getRandomInt(100000, 10000);
let codeNum = document.querySelector('.code-num');
let securityInput = document.querySelector('.security-input');
    codeNum.textContent = numRand;
let codeValue = false;



const priceMap = {
  'modern': 6500,
  'old_soviet': 6500,
  'old_up_120': 6500,
  'old_from_120': 6500,
  'mini_132_155': 12500,
  'kabinet_160_195': 15000,
  'salun_200_215': 17000,
  'small_koncert_215_240': 17000,
  'big_koncert_272_380': 28000
}

const nameOrderMap = {
  'modern': 'российского фортепиано',
  'old_soviet': 'советского фортепиано',
  'old_up_120': 'импорнтго фортепиано (ниже 120 см)',
  'old_from_120': 'импорнтго фортепиано (выше 130 см)',
  'mini_132_155': 'миниатюрного рояля (132-155см)',
  'kabinet_160_195': 'кабинетного рояля (160-195см)',
  'salun_200_215': 'салонного рояля (200-215)',
  'small_koncert_215_240': 'малого концертного рояля (215-240см)',
  'big_koncert_272_380': 'Большого концертного рояля (272-308см)'
}




securityInput.onchange = () => {
  console.log(securityInput.value);
  codeValue = Number(securityInput.value)===numRand;
  console.log(codeValue);
};

 
  // if(dist) {
  //   amoutMkad = Number(dist) * 100;
  //   console.log("mkad " + amoutMkad);
  // }

  // if (currentTab == (tabs.length - 1)) {
  calcForm.onsubmit = (e) => {
      e.preventDefault();
      
    btnSubmit.addEventListener('click', async () => {
      if (document.getElementById('name').value !== "" && document.getElementById('tel').value !== "" && codeValue) {
        
        
        //   let response =  await fetch('https://perevozkapianinomoskva.ru/wp-includes/calc-form.php', {
        //     method: 'POST',
        //     body: new FormData(form)
        //   });
        // //   window.location.href = 'https://perevozkapianinomoskva.ru/kalkulyator/'

        //   if(response.ok) {
        //       window.location.href = 'https://perevozkapianinomoskva.ru/kalkulyator/';
          
        //   } else {
        //       window.location.href = '/';
        //   }
        // //   calcForm.submit();

        
          let response =  await fetch('/calc-form.php', {
            method: 'POST',
            body: new FormData(form)
          });
        //   window.location.href = 'https://perevozkapianinomoskva.ru/kalkulyator/'

          if(response.ok) {
              //window.location.href = 'https://perevozkapianinomoskva.ru/kalkulyator/';

              form.style.display = 'none';
              document.querySelector('.request-ok').style.display = 'block';
          
          } else {
              window.location.href = '/';
          }

      
      } else {
        document.getElementById('name').classList.add('invalid');
        document.getElementById('tel').classList.add('invalid');
        document.getElementById('security').classList.add('invalid');
      }
    });
   };
 
    
  // }
  



  calcForm.onchange = function(e) {
  // e.preventDefault();

  if(dist) {
    amoutMkad = Number(dist) * 100;
    console.log("mkad " + amoutMkad);
  }

  if(e.target.name == 'type') {
    for(let royal of royals) {
      if(royal.checked) {
        royalPrice = royal.value;
        royalMin = priceMap[royal.id];
        orderTitle.textContent = "Заказ перевозки  " + nameOrderMap[royal.id];
        forteType.value = "Заказ перевозки  " + nameOrderMap[royal.id];
        console.log(priceMap[royal.id]);
        if (royal.id === 'small_koncert_215_240' || royal.id === 'big_koncert_272_380'){
          noLift = true;
        }
      }
    }
  }

  if(e.target.name == 'floor-from') {
    amoutFloorFrom = document.getElementById('floor-from').value;
    console.log(amoutFloorFrom);
  }
  if(e.target.name == 'floor-to') {
    amoutFloorTo = document.getElementById('floor-to').value;
    console.log(amoutFloorTo);
  }
  
  btnNext.classList.remove('disabled');
}

document.getElementById('button').addEventListener('click', function () {
  console.log(addressTo.textContent);
})


// 

// let currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  // var tabs = document.querySelectorAll(".calculator");
  tabs[n].style.display = "flex";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "block";
  }

}

function nextPrev(n) {
  // This function will figure out which tab to display
  
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  tabs[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;

  // if you have reached the end of the form... :
  if (currentTab >= tabs.length) {
    //...the form gets submitted:
    document.querySelector(".form").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
  btnNext.classList.add('disabled');

  if (currentTab === 2) {
    btnNext.classList.remove('disabled');
  }
  // /////
  amoutMkad = Number(dist.value) * 100;

  sum = royalMin + amoutMkad;
  
  if (Number(amoutFloorFrom) > 1 && !liftFrom.checked || noLift) {
    sum += amoutFloorFrom * Number(royalPrice);
  }

  if (Number(amoutFloorTo )> 1 && !liftTo.checked || noLift ) {
    sum += amoutFloorTo * Number(royalPrice);
  }

  outputSum.textContent = '';
  outputSum.textContent = sum + " руб";
  totalSum.value = "";
  totalSum.value = sum + " руб";


  window.location.href = `#calc-${currentTab+1}`;

  if (currentTab == (tabs.length - 1)) {
    btnNext.style.display = 'none';
    // btnNext.textContent = "Отправить";
    btnSubmit.style.display = 'block';
    btnSubmit.type = 'submit';

  } else {
    btnSubmit.style.display = 'none';
    btnNext.style.display = 'block';
    btnNext.textContent = "Вперед";
  }
}

function validateForm() {
  // This function deals with validation of the form fields
  var inputs, i, valid = false;
  // btnNext.classList.add('disabled');
  // tabs = document.querySelectorAll(".calculator");
  if (currentTab !== 2) {
    inputs = tabs[currentTab].querySelectorAll("input");
  
  // A loop that checks every input field in the current tab:
  for (i = 0; i < inputs.length; i++) {

    if(currentTab === 0) {
    
    // If a field is empty...
        if (inputs[i].checked ) {
          // add an "invalid" class to the field:
          // console.log(inputs[i]);
          // and set the current valid status to false:
          valid = true;
          btnNext.classList.remove('disabled');
          
        } 
      } else if (currentTab === 1) {
        if (document.getElementById('from').value !== "" && document.getElementById('to').value !== "") {
          // add an "invalid" class to the field:
          // console.log(inputs[i]);
          // and set the current valid status to false:
          valid = true;
          btnNext.classList.remove('disabled');
          break;
        } 
      } else if (currentTab === 2) {
        valid = true;
        btnNext.classList.remove('disabled');
      } 
    }
  } else {
    valid = true;
    btnNext.classList.remove('disabled');
  }
  // If the valid status is true, mark the step as finished and valid:
  // if (valid) {
  //   document.getElementsByClassName("step")[currentTab].className += " finish";
  // }
  return valid; // return the valid status
}

btnNext.addEventListener('click', () => {
  nextPrev(1);
});

btnOrderNow.addEventListener('click', () => {
  nextPrev(1)
});
 
btnPrev.addEventListener('click',() => {
  nextPrev(-1);
  btnNext.classList.remove('disabled');
});

// btnNext.onclick = nextPrev(1);
// btnSubmit.onclick = nextPrev(1);




// 



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}
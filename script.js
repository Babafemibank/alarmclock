let hrs = document.querySelector('#hr');
let mins = document.querySelector('#min');
let secs = document.querySelector('#sec');

setInterval(()=>{
    let time = new Date();
    let hh = time.getHours() * 30;
    let mm = time.getMinutes() * 6;
    let ss = time.getSeconds() * 6;
    hrs.style.transform =`rotateZ(${hh+(mm/12)}deg)`;
    mins.style.transform =`rotateZ(${mm}deg)`;
    secs.style.transform =`rotateZ(${ss}deg)`;
   },1000);

const colDiv = document.createElement('div');
   colDiv.className = 'col';
   
const hrDiv = document.createElement('select');
   hrDiv.name='hours';
    hrDiv.className = 'hrs';
    hrDiv.id = 'hrs';
   let optionH = document.createElement('option');
   optionH.value = 'hour';
   optionH.selected = true;
   optionH.hidden = true;
   optionH.textContent = 'Hours';
   hrDiv.appendChild(optionH);
   
const mnDiv = document.createElement('select');
   mnDiv.name='minutes';
    mnDiv.className = 'mins';
    mnDiv.id = 'mins';
   let optionM = document.createElement('option');
   optionM.value = 'minutes';
   optionM.selected = true;
   optionM.hidden = true;
   optionM.textContent = 'Minutes';
   mnDiv.appendChild(optionM);
   
const ampmDiv = document.createElement('select');
   ampmDiv.name='ampm';
   ampmDiv.className = 'ampm';
   ampmDiv.id = 'ampm';
   let optionAmPm = document.createElement('option');
   optionAmPm.value = 'AM/PM';
   optionAmPm.selected = true;
   optionAmPm.hidden = true;
   optionAmPm.textContent = 'AM/PM';
   ampmDiv.appendChild(optionAmPm);
   
   for(let i = 12; i> 0; i--){
    i =  i < 10? "0" + i: i;
     let option = `<option value = "${i}">${i}</option>`;
     hrDiv.firstElementChild.insertAdjacentHTML("afterend", option);
  }
  for(let i = 59; i>= 0; i--){
      i =  i < 10? "0" + i: i;
       let option = `<option value = "${i}">${i}</option>`;
       mnDiv.firstElementChild.insertAdjacentHTML("afterend", option);
    }
    for(let i = 2; i> 0; i--){
      let ampm =  i == 1? "AM": "PM";
       let option = `<option value = "${ampm}">${ampm}</option>`;
       ampmDiv.firstElementChild.insertAdjacentHTML("afterend", option);
    }

   colDiv.appendChild(hrDiv);
        colDiv.appendChild(mnDiv);
        colDiv.appendChild(ampmDiv);
        let cont = document.getElementById('alarmContainer');
        cont.appendChild(colDiv);

//Alarm section        
        const hourInput = document.getElementById('hrs'),
        minutesInput = document.getElementById('mins'),
        ampmInput = document.getElementById('ampm'),
        activeAlarm = document.getElementById('activeAlarm'),
        setAlarm = document.getElementById('plus');
        let alarmsArray = [];
        let alarmSound = new Audio('./ringtone.mp3');
        let initialHour = 'Hours',
        initialMinutes = 'Minutes',
initialAmPm = 'Am/Pm',
alarmIndex = 0;

//search for values
        const searchObject = (parameter, value) => {
          let alarmObject,
          ObjIndex,
          exixts = false;
       
        alarmsArray.forEach((alarm, index) => {
          if(alarm[parameter] == value){
            exixts = true;
            alarmObject = alarm;
            ObjIndex = index;
            return false;
          }
        });
        return [exixts, alarmObject, ObjIndex];
      };
        
//Time      
displayTimer = () => {let date = new Date();
let actualTime = [date.getHours(), date.getMinutes(),date.getSeconds(), 'AM'];
let hhs = actualTime[0], 
mms = actualTime[1],
sss = actualTime[2],
AmPm = actualTime[3];   
if(hhs >= 12) {
          hhs = hhs - 12;
          AmPm = "PM";
      }
      hhs = hhs == 0 ? hhs = 12 : hhs;
      hhs = hhs < 10 ? "0" + hhs : hhs;
      mms = mms < 10 ? "0" + mms : mms;
      sss = sss < 10 ? "0" + sss : sss;

      //Alarms
      alarmsArray.forEach((alarm, index) => {
        if(alarm.isActive){
          if(
            `${alarm.alarmHour}:${alarm.alarmMinte} ${alarm.alarmAmPm}` === `${hhs}:${mms} ${AmPm}`){
               alarmSound.play();
               alarmSound.loop = true;
            }
        }
      });
    }

const selectedCheck = (selectedValue) => {
  selectedValue = parseInt(selectedValue);
  return selectedValue;
};
hourInput.addEventListener('select', () => {
  hourInput.value = selectedCheck(hourInput.options[hourInput.selectedIndex].value);
});

minutesInput.addEventListener('select', () => {
  minutesInput.value = selectedCheck(minutesInput.options[minutesInput.selectedIndex].value);
});

ampmInput.addEventListener('select', () => {
  ampmInput.value = selectedCheck(ampmInput.options[ampmInput.selectedIndex].value);
});

//Create Alarm Div
const createAlarm = (alarmObj) => {
  const  {id, alarmHour, alarmMinte, alarmAmPm} = alarmObj;
  let alarmDiv = document.createElement('div');
  alarmDiv.classList.add('alarm');
  alarmDiv.setAttribute('data-id', id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinte} ${alarmAmPm}</span>`;

//Checkbox
  let checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.addEventListener('click', (e) => {
    if(e.target.checked){
      startAlarm(e);
      alert(`Alarm set to ${alarmHour}:${alarmMinte} ${alarmAmPm}!`);
    }
    else{
      stopAlarm(e);
    }
  });
alarmDiv.appendChild(checkbox);

// Delete Button
let deleteButton = document.createElement('button');
deleteButton.innerHTML =`<i class="fa-solid fa-trash-can"></i>`;
deleteButton.classList.add('deleteButton');
deleteButton.addEventListener('click', (e) => deleteAlarm(e));
alarmDiv.appendChild(deleteButton);
activeAlarm.appendChild(alarmDiv);  
};

//set alarm
setAlarm.addEventListener('click', () => {
  alarmIndex += 1;

  //AlarmObject
 let alarmObj = {};
 alarmObj.id = `${alarmIndex}_${hourInput.value}`;
alarmObj.alarmHour = hourInput.value;
alarmObj.alarmMinte = minutesInput.value;
alarmObj.alarmAmPm = ampmInput.value;
alarmObj.isActive = false;
if (hourInput.value == 'Hours' || minutesInput.value
== 'Minutes' || ampmInput.value == 'AM/PM') {
  return alert("Please, select a valid time to set Alarm!");
}
else{
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
}
hourInput.value = initialHour;
minutesInput.value = initialMinutes;
ampmInput.value = initialAmPm;
});

//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute('data-id');
  let [exists, obj, index] = searchObject('id', searchId);
  if(exists){
    alarmsArray[index].isActive = true;
  }
};

//Stop Alarm
const stopAlarm = (e) => {
let searchId = e.target.parentElement.getAttribute('data-id');
let [exists, obj, index] = searchObject('id', searchId);
if(exists){
  alarmsArray[index].isActive = false;
  alarmSound.pause(); 
}
};

//Delete Alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute('data-id');
  let [exists, obj, index] = searchObject('id', searchId);
  if(exists){
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
    alarmSound.pause(); 
  }
  };

      window.onload = () => {setInterval(displayTimer);
      initialHour = 'Hours';
      initialMinutes = 'Minutes';
      initialAmPm ='AM/PM';
      alarmIndex = 0;
      alarmsArray = [];
      hourInput.options[hourInput.selectedIndex].value = 'Hours';
      minutesInput.options[hourInput.selectedIndex].value = 'Minutes';
      ampmInput.options[hourInput.selectedIndex].value = 'AM/PM';}
'use strict';

class Warnings {
  renderWarning(div) {
    this.div = div;
    this.parent = document.querySelector(`#${this.div.id}`).parentElement;
    this.warning = document.createElement("div");
    this.warning.setAttribute("class", "warnings");
    this.parent.appendChild(this.warning).innerHTML = ` параметр ${this.div.placeholder} должно быть число больше 0`;
  }
  clearWarning() {
    document.querySelectorAll(".warnings").forEach(item => item.remove());
  }
}

class RacingTrace {
  constructor(distance) {
    this.cars = [];
    this.setDistance(distance || 100);
  }
  addCar(car) {
    this.cars.push(car);
    let renderer = new RenderingCar(this, car);
    renderer.drawningCar();
  }
  reset() {
    this.cars = [];
    document.querySelector(".race").innerHTML = "";
  }
  setDistance(distance) {
    this.distance = distance;
  }
  start() {
    this.cars.forEach(car => {
      if (document.querySelector(`#car_${car.id}`) != null) {
        car.spended = 0;
        car.carMoving = setInterval(() => {
          car.move();
          if (car.isFinished() || car.left <= 0.1) {   //!Warning!!! Вопрос! Непонятно почему || а не &&
            clearInterval(car.carMoving);
          }
        }, 10);
      }
    });


  }

  stop() {
    this.cars.forEach(car => clearInterval(car.carMoving));
  }
  restart() {
    this.stop();
    this.cars.forEach(car => {
      car.position = 0;
      document.querySelector(`#car_${car.id}`).style.left = "0%";
    });
  }
}


class Car {
  constructor(mark, speed, capacity, consumption) {
    this.mark = mark || "жигуль";
    this.speed = speed || 100;
    this.capacity = capacity || 50;
    this.consumption = consumption || 10;
    this.id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    this.position = null;
    this.pased = null;
    this.spent = null;
    this.left = null;
  }

  move() {
    this.position += this.speed / (racingTrace.distance * 10);
    this.pased = ((this.position / 8.5) * (racingTrace.distance / 10));
    this.spent = (this.pased * (this.consumption / 100));
    this.left = this.capacity - this.spent;
    document.querySelector(`#car_${this.id}`).style.left = this.position + "%";
    document.querySelector(`#car_${this.id} > .fuel`).style.height = `${100 * (this.left / this.capacity)}%`;
    document.querySelector(`#car_${this.id}> .car > span`).innerHTML = `${Math.floor(this.pased)}`;
    document.querySelector(`#car_${this.id}> .fuel > span`).innerHTML = `${Math.floor(100 * (this.left / this.capacity))}%`;
  }
  isFinished() {
    return this.position > 85;  //racingTrace.traceWidth;
  }
}

class RenderingCar {
  constructor(race, car) {
    this.race = race;
    this.car = car;
  }
  drawningCar() {
    let carHtml = `<div class="road">
       <div class="cars" id="car_${this.car.id}">
       <div  class="fuelValue"></div>
       <div class="fuel"><span>100%</span></div>
       <div  class="car"><span>0</span>km</div>
       </div>
       <div class="trace">
       <div class="aboutCar">
       <span>${this.car.mark}: ${this.car.speed} km/h, V:${this.car.capacity}L, ${this.car.consumption}L per 100km </span>
       </div>
		<div class="distance"><span>${this.race.distance}</span> km</div>
		</div>
		</div>`;
    document.querySelector(".race").innerHTML += carHtml;
  }
}

let racingTrace = new RacingTrace();
let warningMessage = new Warnings();


window.addEventListener("load", () => {
  //set new Car
  document.querySelector("#newCarAccept").addEventListener("click", setNewCar, false);
  //clear race
  document.querySelector("#clearCar").addEventListener("click", () => {
    racingTrace.reset();
    warningMessage.clearWarning();
  }, false);

  //start move
  document.querySelector("#startButton").addEventListener("click", () => {
    racingTrace.stop();
    racingTrace.start()
  }, false);

  // stop
  document.querySelector("#stopButton").addEventListener("click", () => {
    racingTrace.stop()
  }, false);

  //restart
  document.querySelector("#restartCar").addEventListener("click", () => racingTrace.restart(), false);

  //trace width
  document.carDistanceForm.distanceAccept
    .addEventListener("click", () => {
      let distance = document.carDistanceForm.inputCarDistance;

      if(Number.isInteger(distance.value) || distance.value > 0) {
        document.querySelectorAll(".distance > span").forEach(item => {
          item.innerHTML = distance.value;
        });
        racingTrace.setDistance(distance.value);
        racingTrace.restart();
        warningMessage.clearWarning();


      }else {
        warningMessage.clearWarning();
        warningMessage.renderWarning(distance);
      }

    }, false)

}, false);//end of window.eventLestener

//create New car
function setNewCar() {
  let carMark = document.carInfoForm.CarMark;
  let carSpeed = document.carInfoForm.CarSpeed;
  let carCapacity = document.carInfoForm.CarCapacity;
  let carConsumption = document.carInfoForm.carConsumption;

  let success = true;
  warningMessage.clearWarning();

  if (!Number.isInteger(carSpeed.value * 1) || carSpeed.value <   0) {
    warningMessage.renderWarning(carSpeed);
    success = false;
  }
  if (!Number.isInteger(carCapacity.value * 1) || carCapacity.value < 0) {
    warningMessage.renderWarning(carCapacity);
    success = false;
  }
  if (!Number.isInteger(carConsumption.value * 1) || carConsumption.value < 0) {
    warningMessage.renderWarning(carConsumption);
    success = false;
  }
  if (success) {
    let car = new Car(
      carMark.value,  // document.carInfoForm.CarMark.value,  //another way how can it be//
      carSpeed.value,
      carCapacity.value,
      carConsumption.value
    );
    racingTrace.addCar(car);
  }


//to cleat new car input;
  document.querySelectorAll(".inputCar").forEach(input => {
    input.value = "";
  });

}


window.addEventListener("load", setDefault, false);

function setDefault() {
  let car1 = new Car("Mercedes", 150, 60, 100);
  racingTrace.addCar(car1);
  let car2 = new Car("Ferrari", 150, 120, 60);
  racingTrace.addCar(car2);
  let car3 = new Car("Porshe", 80, 120, 60);
  racingTrace.addCar(car3);
}



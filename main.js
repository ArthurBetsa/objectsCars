'use strict';

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
          if (car.isFinished() || car.left <= 0.5 ) {   //!Warning!!! Вопрос! Непонятно почему || а не &&
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


window.addEventListener("load", () => {

  //set new Car
  document.querySelector("#newCarAccept").addEventListener("click", setNewCar, false);

  //clear race
  document.querySelector("#clearCar").addEventListener("click", () => {
    racingTrace.reset();


  }, false);


  //start move
  document.querySelector("#startButton").addEventListener("click", () => {
    let traceWidth = document.querySelector(".road").clientWidth;
    racingTrace.stop();
    racingTrace.start(traceWidth)
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
      let distance = document.carDistanceForm.inputCarDistance.value;
      document.querySelectorAll(".distance > span").forEach(item => {
        item.innerHTML = distance
      });
      racingTrace.setDistance(distance);

    }, false)


}, false);//end of window.eventLestener


function setNewCar() {

  let carMark = document.carInfoForm.CarMark.value;
  let carSpeed = document.carInfoForm.CarSpeed.value * 1;
  let carСapacity = document.carInfoForm.CarCapacity.value;
  let carConsumption = document.carInfoForm.carConsumption.value;
  let car = new Car(
    carMark,  // document.carInfoForm.CarMark.value,  //another way how can it be//
    carSpeed,
    carСapacity,
    carConsumption
  );
  racingTrace.addCar(car);


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



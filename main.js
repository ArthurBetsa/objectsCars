'use strict';

class RacingTrace {
  constructor(distance) {
    this.cars = [];
    this.setDistance(distance || 10);
    this.traceWidth = null;
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

  start(traceWidth) {

    this.cars.forEach(car => {
      if (document.querySelector(`#car_${car.id}`) != null) {
        car.carMoving = setInterval(() => {
          car.move();
          if(car.isFinished()){
            clearInterval(car.carMoving);
          }
          }, 10);
      }

    });



  }

  stop() {
      this.cars.forEach(car => clearInterval(car.carMoving));
      this.cars.forEach(car => console.log(car.carMoving));
  }

  restart() {

    this.cars.forEach(car => {
      this.stop();
      car.position = 0;
      document.querySelector(`#car_${car.id}`).style.left = "0%";
      document.querySelector("#startButton").disabled = false;

    });
  }
}


class Car {
  constructor(mark, speed, capacity, consumption) {
    this.mark = mark || "жигуль";
    this.speed = speed * 0.01 || 1;
    this.capacity = capacity || 50;
    this.consumption = consumption || 10;
    this.id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
    this.position = 0;


  }

  move() {
    this.position += this.speed / racingTrace.distance;
    this.capacity -= this.consumption / this.speed;


    document.querySelector(`#car_${this.id}`).style.left = this.position + "%";

  }

  isFinished() {
    return this.position > 80;  //racingTrace.traceWidth;

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
       <div class="fuel">10%</div>
       <div  class="car">0</div>
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
    // document.querySelector("#startButton").disabled = true;
    let traceWidth = document.querySelector(".road").clientWidth;
    racingTrace.stop();
    racingTrace.start(traceWidth)
  }, false);

  // stop
  document.querySelector("#stopButton").addEventListener("click", () => {
    // document.querySelector("#startButton").disabled = false;
    racingTrace.stop()
  }, false);

  //restart

  document.querySelector("#restartCar").addEventListener("click", () => racingTrace.restart(), false);
//trace width

  let b = document.carDistanceForm.distanceAccept;

  b.addEventListener("click", () => {
    let distance = document.carDistanceForm.inputCarDistance.value;
    let a = document.querySelectorAll(".distance > span").forEach(item => {
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
    carMark,  // document.carInfoForm.CarMark.value,
    carSpeed,
    carСapacity,
    carConsumption
  );
  racingTrace.addCar(car);


//очистка формы;
  document.querySelectorAll(".inputCar").forEach(input => {
    input.value = "";
  });

}


window.addEventListener("load", setDefault, false);

function setDefault() {

  let car1 = new Car("Mercedes", 150, 60, 10);
  racingTrace.addCar(car1);
  let car2 = new Car("Ferrari", 100, 120, 60);
  racingTrace.addCar(car2);

  let car3 = new Car("Porshe", 80, 120, 60);
  racingTrace.addCar(car3);


}


//
"use strict";

const axios = require('axios');
var Alexa = require("alexa-sdk");

var handlers = {
   'LaunchRequest': function () {
    this.response.speak('Welcome, to Care Buddy, your personal healthcare assistant. What can I do for you?.').listen("Can you please tell me your name?");
    this.emit(":responseReady");
   },
   'NearestStoreIntent': function () {
    
     this.attributes.loc = slotValue(this.event.request.intent.slots.loc);

     let lat;
     let long;
     let name, address;
     axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.attributes.loc}&key=AIzaSyAT8CvxZX9KZnqnR5DKsvxyUMoWEMcEs2Y`)
           .then(res => res.data)
           .then(res => res.results[0])
           .then(res => {
               lat = res.geometry.location.lat;
               long = res.geometry.location.lng;
               console.log(lat)
           });
     
     axios.get(`https://fierce-forest-33378.herokuapp.com/closest_shop?latitude=25.4358011&longitude=81.846311`)
           .then(res => res.data)
           .then(res => {
               name = res.name;
               address = res.address;
               let say = `The nearest shop in ${this.attributes.loc} is ${name}. It is at ${address}.`;
               
               this.response.speak(say).listen("Ask for help if not sure what to do!");
               this.emit(":responseReady");
           })
           .catch(error => console.log(error.message));

     
    
},
   'MedicineAvailableIntent': function () {
       
    this.attributes.loc = slotValue(this.event.request.intent.slots.loc);
    this.attributes.med = slotValue(this.event.request.intent.slots.med);

    let lat;
    let long;
    let name, address, distance;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.attributes.loc}&key=AIzaSyAT8CvxZX9KZnqnR5DKsvxyUMoWEMcEs2Y`)
          .then(res => res.data)
          .then(res => res.results[0])
          .then(res => {
              lat = res.geometry.location.lat;
              long = res.geometry.location.lng;
              console.log(lat)
          });
    
    axios.get(`https://fierce-forest-33378.herokuapp.com/nearest?medicine=${this.attributes.med}&latitude=${lat}&longitude=${long}`)
          .then(res => res.data)
          .then(res => res.shops)
          .then(res => res[0])
          .then(res => {
              name = res.name;
              address = res.address;
              distance = parseInt(res.distance);
              let say = `The nearest shop having ${this.attributes.med} in ${this.attributes.loc} is ${name}. It is at ${address} and about ${parseFloat(distance/1000)} km away.`;
              
              this.response.speak(say).listen("Ask for help if not sure what to do!");
              this.emit(":responseReady");
          })
          .catch(error => console.log(error.message));

        
       
   },
   'CPRIntent': function () {
        let say = `Here are instructions for doing CPR on teens or adults.<break time="1s"/> If someone suddenly collapses and is not responsive and breathing normally, the first thing you should do is call an ambulance on 1-0-2. <break time="1s"/> Next, push hard and fast in the center of the chest at the rate of 100 to 120 beats per minute.`;
        this.response.speak(say).listen("Can you please tell me your name?");
        this.emit(":responseReady");
   },
   'StrokeAttackWarningIntent': function() {
        
        if(slotValue(this.event.request.intent.slots.strack)=='Stroke'){
            let say = `If you think you are having a stroke, call an ambulance on 1-0-2 immediately. You can easily spot the signs of a stroke if you remember the acronym fast. The F means face drooping. The A stands for arm weakness. The S stands for speech difficulty. The T stands for Time to call ambulance if you see the above warning signs.`;
            this.response.speak(say).listen("Can you please tell me your name?");
            this.emit(":responseReady");
        }
        if(slotValue(this.event.request.intent.slots.strack)=='Heart Attack'){
            let say = `Some heart attacks are sudden and intense, but most start slowly, with mild pain or discomfort. Call an ambulance on 1-0-2 right away if you have any of these heart attack warning signs. First, Chest discomfort: Most heart attacks involve discomfort in the center of the chest that lasts more than a few minutes, or that goes away and comes back. It can feel like uncomfortable pressure, squeezing, fullness or pain. Second, Discomfort in other areas of the upper body: Symptoms can include pain or discomfort in one or both arms, the back, neck, jaw or stomach. Third, Shortness of breath: with or without chest discomfort. Also, Other signs: may include breaking out in a cold sweat, nausea or lightheadedness. <break time="1s"/> Women, the elderly, and people with diabetes are more likely to have less typical signs of a heart attack. An ache in the chest, heartburn, or indigestion. An uncomfortable feeling in the back, jaw, neck, or shoulder. Shortness of breath, Nausea or vomiting.`;
            this.response.speak(say).listen("Can you please tell me your name?");
            this.emit(":responseReady");
        }
   },
   'TreatmentIntent': function () {
            this.attributes.injury = slotValue(this.event.request.intent.slots.injury);
            if(this.attributes.injury=="sprain"){
                let say = `Rest the sprained area. Put some ice on it. Do not apply ice directly on the skin. Call an ambulance and see the doctor if there is significant swelling.`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
            else if(this.attributes.injury=="papercut"){
                let say = `Do not worry, it is only a flesh wound. Rinse the cut with clean water and use a bandaid to prevent infection.`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
            else if(this.attributes.injury=="nosebleed"){
                let say = `Sit up straight and lean forward slightly. Pinch your nose firmly with your thumb and forefinger. If the bleeding does not stop in ten minutes, call an ambulance.`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
            else if(this.attributes.injury=="chestpain"){
                let say = `If you are also experiencing Chest discomfort, Discomfort in other areas of the upper body, Shortness of breath, nausea or lightheadedness, You most likely are experiencing a heart attack. Call an ambulance immediately`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
            else if(this.attributes.injury=="fever"){
                let say = `If you are not experiencing any chest discomfort, You most likely have the flu. Contact your physician as soon as possible.`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
            else if(this.attributes.injury=="nausea" || this.attributes.injury=="dizziness"){
                let say = `You may have a flu. Name any other symptom you are experiencing.`;
                this.response.speak(say).listen("Can you please tell me your name?");
                this.emit(":responseReady");
            }
   },
    'AMAZON.HelpIntent': function () {
        this.response.speak("Hmm, I couldn't quite catch that. Maybe try saying something like I have a headache or I'm feeling a neck pain").listen('Would you like to play?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Thank you for trying the complete healthcare assistant. I hope you feel better.');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Thank you for trying the complete healthcare assistant. I hope you feel better.');
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        this.response.speak("Thank you for trying the complete healthcare assistant. I hope you feel better.");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        const message = 'I don\'t get it! Try saying Alexa, Open does it fly!';
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'UnhandledIntent': function() {
        const message = 'I don\'t get it! Try saying Alexa, Open does it fly!';
        this.response.speak(message);
        this.emit(':responseReady');
    }

};





function slotValue(slot, useId){
    let value = slot.value;
    let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
    if(resolution && resolution.status.code == 'ER_SUCCESS_MATCH'){
        let resolutionValue = resolution.values[0].value;
        value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
    }
    return capitalize(value);
}

function capitalize(s)
{
    return s[0].toUpperCase() + s.toLowerCase().slice(1);
}


// This is the function that AWS Lambda calls every time Alexa uses your skill.
exports.handler = function(event, context, callback) {

// Set up the Alexa object
var alexa = Alexa.handler(event, context); 
// Register Handlers
alexa.registerHandlers(handlers); 

// Start our Alexa code
alexa.execute(); 
  
};
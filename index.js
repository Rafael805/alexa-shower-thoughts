'use strict';
// This makes Alexa's core features available in our Lambda function
// and sets up an Alexa object for us to work with
var Alexa = require('alexa-sdk');

var request = require('request');

const APP_ID = "amzn1.ask.skill.9591e073-59f3-405c-af95-064388bc7291";

const GET_THOUGHT = "Here's your shower thought of the day: ";
const HELP_MESSAGE = "You can ask for a shower thought, or, you can say exit... What can I help you with?";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

// This is the function that AWS Lambda calls every time Alexa uses the skill.
exports.handler = function(event, context, callback) {
   // Sets up an Alexa object to work with
   var alexa = Alexa.handler(event, context);
   alexa.APP_ID = APP_ID;
   alexa.registerHandlers(handlers); // Registers Handlers
   alexa.execute(); // Start our Alexa code
};

// When Alexa sends a request to the Lambda function, the script needs to handle
// those requests. All of the requests are handled by an object named handlers.
var handlers = {
      // Our skill will receive a LaunchRequest when the user invokes the skill
      // with the invocation name but desn't provide any command mapping to an intent.
      // In this case invocation name is "Shower Thoughts"
      'LaunchRequest': function () {
         this.emit('ShowerThoughtIntent');
      },

      // Custom intent - ShowerThoughtIntent
      'ShowerThoughtIntent': function () {
         var scope = this;
         // https://www.reddit.com/r/Showerthoughts/new.json?sort=new
         request('https://www.reddit.com/r/Showerthoughts/.json', function(error, response, body){
            var resp = JSON.parse(body);
            // Create random value to randomize the posts from the API
            var random = Math.floor(Math.random() * resp.data.children.length);
            // Retrieve the title of a reddit post
            var Text = resp.data.children[random].data.title;
            // Output
            var speechOutput = GET_THOUGHT + " <break time='1s'/> " + Text;
            scope.emit(':tell', speechOutput)
         })
      },

      'AMAZON.HelpIntent': function () {
         var speechOutput = HELP_MESSAGE;
         var reprompt = HELP_REPROMPT;
         this.emit(':ask', speechOutput, reprompt);
      },

      'AMAZON.CancelIntent': function () {
         this.emit(':tell', STOP_MESSAGE);
      },

      'AMAZON.StopIntent': function () {
         this.emit(':tell', STOP_MESSAGE);
      }

   }; // end of handlers

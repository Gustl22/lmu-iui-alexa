// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const Products = require("./products");
const config = require("./config.json");

//jdbc:mariadb://www.reb0.org:3306
//Url: https://www.reb0.org/phpmyadmin
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

var buyingProcess = false;


async function getPrice(search) {
    let product = await getProduct(search);
    if (product) {
        return 'It costs ' + product.price + ' €. ';
    } else {
        return "We don't sell this product. ";
    }
}

async function getProduct(search) {
    let conn;
    const sql = `SELECT * FROM product WHERE LOWER(name) LIKE '${search}' LIMIT 1`;
    try {
        conn = await pool.getConnection();
        const res = await conn.query(sql);
        return res[0];
    } catch (err) {
        throw err;
    } finally {
        if (conn)
            await conn.end();
    }
    return false;

    // for (let key in Products) {
    //     let product = Products[key];
    //     // console.log(product);
    //     // for(let prop in product) {
    //     //     res = res + prop + ';';
    //     // }
    //     if (product.hasOwnProperty('name')) {
    //         // res = res + product.name + ';';
    //         if (product.name.toLowerCase() === search) {
    //             return product.price;
    //         }
    //     }
    // }
    // return false;
}

function getProductsWithType(type) {
    let productList = [];
    //let productList = type;
    /*switch (type){
       case 1: type = 'food';
       case 2: type = 'drink';
   }  */

    for (var key in Products) {
        let product = Products[key];
        if (product.categories[0] === type) {
            //productList = product.name;
            productList.push(product.name);
        }
    }//)
    return productList;
}


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to our vending machine!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();

    }
};
const WantToBuySomethingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'Want_to_buy_something';
    },
    handle(handlerInput) {
        const speakOutput = 'We offer drinks and snacks. Are you hungry or thirsty?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const BuyIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BuyIntent'
            && handlerInput.requestEnvelope.request.intent.slots.product;
    },
    async handle(handlerInput) {
        let product = handlerInput.requestEnvelope.request.intent.slots.product.value;
        const speakOutput = await getPrice(product) + "Do you want to buy it?";
        var buyingProcess = true;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const CategoryOfDecisionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'category_of_decision';
    },
    handle(handlerInput) {
        let aisystem = handlerInput.requestEnvelope.request.intent.slots.category_of_product.value;
        /*if (aisystem === 1) var prodType = 'snacks';
         if (aisystem === 2) prodType = "drinks";*/
        const speakOutput = 'We offer the following ${prodType}: ' + getProductsWithType(aisystem) + "Which do you choose?";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.` + error;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BuyIntentHandler,
        WantToBuySomethingIntentHandler,
        CategoryOfDecisionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
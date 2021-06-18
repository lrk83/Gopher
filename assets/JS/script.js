//Query Selector variables
var dateFormEl = document.querySelector("#date-form");
var activityFormEl = document.querySelector("#activity-form");
var activityCardEl = document.querySelector("#activityCard");
var resultsCardEl = document.querySelector('#resultsCard');
var nameOfEvent = document.querySelector("#nameOfEvent");
var eventInfoEl = document.querySelector("#eventInfo");
var iframe = document.querySelector("#iframe");

//Varaibles for links
var baseLink = "https://app.ticketmaster.com/discovery/v2/events.json";
var apiKey = "&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR";

//Global variables for passing between functions
var globalDateInput = "";
var stateCode="";
var eventsInfo=[];

var getDirections = function(venue){
    venueName="";
    venue.split(" ").forEach((element) => {
        venueName+=element;
        venueName+="+";
    });

    console.log(venueName);

    var googleMapsIFrame = document.createElement("iframe");
    googleMapsIFrame.setAttribute("src","https://www.google.com/maps/embed/v1/place?key=AIzaSyCNGVJ1YMzTfo0ANBH6sPMd9kmnZwqUh2o&q="+venueName);
    googleMapsIFrame.setAttribute("width","600");
    googleMapsIFrame.setAttribute("height","450");
    googleMapsIFrame.setAttribute("style","border: 0");
    googleMapsIFrame.setAttribute("loading","lazy");
    iframe.appendChild(googleMapsIFrame);
};

var displayEventInfo = function(data){
    nameOfEvent.textContent=data._embedded.events[0]._embedded.attractions[0].name;

    console.log(data._embedded.events[0]);
    getDirections(data._embedded.events[0]._embedded.venues[0].name);
    eventInfoEl.innerHTML="";

    for (x=0;x<data._embedded.events.length;x++){
        var newEventInfoEl = document.createElement("div");
        newEventInfoEl.setAttribute("class","row");
        newEventInfoEl.innerHTML='<div class="card searchCard"><div class="column col-6"><div class="card-header"><h4>'+data._embedded.events[x].name+' ('+data._embedded.events[x].dates.start.localDate+')</h4></div><div class="card-body"><a href="'+data._embedded.events[x].url+'">'+data._embedded.events[x].url+'</a></div></div><div class="column col-4"><img src="'+data._embedded.events[x].images[x].url+'"></img></div></div>';
        eventInfoEl.appendChild(newEventInfoEl);
    };
};

var getEventInfo = function(eventName){
    console.log(eventName);

    //search eventsInfo for this event
    for (x=0;x<eventsInfo.length;x++){
        if (eventsInfo[x].name===eventName){
            eventforDisplay=eventsInfo[x].attractionID;
        }
    }

    console.log(eventforDisplay);

    //Get the info for all events for this attraction ID, in this state, past this date
    date = globalDateInput+"T00:00:01Z";
    fetch(baseLink+"?stateCode="+stateCode+"&attractionId="+eventforDisplay+"&startDateTime="+date+"&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR").then(function(response){
        if (response.ok){
            response.json().then(function(data){
                displayEventInfo(data);
            });
        }
    });
};


var displayEvents = function(data){
    //Reset list of events
    resultsCardEl.innerHTML="";

    //Make the list of events
    resultsCardEl.setAttribute("class","card searchCard");
    resultsCardEl.innerHTML='<div class="card-header"><h3>Do any of these sound fun?</h3></div><div class="card-body">';

    //List of buttons already displayed
    var eventsDisplayed=[];

    for (x=0;x<data.length;x++){
        console.log(data[x]);

        //By default the next one isn't in eventsDisplayed
        var imAlreadyInEventsDisplayed=false;

        //Check if the next event name is already in eventsDisplayed
        for (y=0;y<eventsDisplayed.length;y++){
            if (eventsDisplayed[y]===data[x].name){
                imAlreadyInEventsDisplayed=true;
            };
        };

        //If the next event name is not already in events Displayed,
        if (imAlreadyInEventsDisplayed===false){

            //Display it
            var newEventButton=document.createElement("button");
            newEventButton.textContent=data[x].name;
            newEventButton.setAttribute("class","btn");
            resultsCardEl.appendChild(newEventButton);

            //Save it to eventsDisplayed
            eventsDisplayed.push(data[x].name);

            //Save its info to eventsInfo
            var eventInfo={
                name: data[x].name,
                attractionID: data[x]._embedded.attractions[0].id
            };

            eventsInfo.push(eventInfo);
        };
    };

    resultsCardEl.innerHTML=resultsCardEl.innerHTML+'</div>';
};

var getEventsList=function(activityType){
    date = globalDateInput+"T00:00:01Z";
    fetch(baseLink+"?startDateTime="+date+"&classificationName="+activityType+"&stateCode="+stateCode+"&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR").then(function(response){
        if (response.ok){
            response.json().then(function(data){

                displayEvents(data._embedded.events);
            });
        }else{
            window.alert("There was a problem with your request!");
        };
    });
};

var getActivities = function(){
    //Reset List of activities
    activityCardEl.innerHTML="";

    //Make the list of activities
    activityCardEl.setAttribute("class","card searchCard");
    activityCardEl.innerHTML="<div class='card-header'><h3>What kind of event do you have in mind?</h3></div><div class='card-body'><form id='activity-form'><button class='btn' id='music' type='button'>Music</button><button class='btn' id='sports' type='button'>Sports</button><button class='btn' id='artsTheater' type='button'>Arts & Theater</button><button class='btn' id='film' type='button'>Film</button><button class='btn' id='miscellaneous' type='button'>I'm Feeling Lucky</button></form></div>";
};

var eventFormHandler = function(event){

    event.preventDefault();
    
    var targetEl=event.target;

    //Track which button was clicked, call getEvents with appropriate button
    if (targetEl===document.querySelector("#music")){
        getEventsList("music");
    }else if (targetEl===document.querySelector("#sports")){
        getEventsList("sports");
    }else if (targetEl===document.querySelector("#artsTheater")){
        getEventsList("arts");
    }else if(targetEl===document.querySelector("#film")){
        getEventsList("film");
    }else if (targetEl===document.querySelector("#miscellaneous")){
        getEventsList("miscellaneous");
    }
}

var dateFormHandler = function(event){
    event.preventDefault();

    //Get date and state
    var dateInput = document.querySelector("input[name='date']").value;
    var stateInput = document.querySelector("input[name='state']").value

    // check if inputs are empty (validate)
    if (!dateInput) {
        alert("You need to enter a date!");
        return false;
    }else if (!stateInput){
        alert("You need to enter a state!");
        return false;
    }

    //Put them in global variables so I can access them from other functions
    globalDateInput=dateInput;
    stateCode=stateInput;

    //Generate my list of activities
    getActivities();
};

//When "Search" button is clicked
dateFormEl.addEventListener("submit",dateFormHandler);

//When one of the event types is clicked
activityCardEl.addEventListener("click",eventFormHandler);

//When one of the events is clicked
$("#resultsCard").on("click","button",function(){
    var eventName=$(this).text();
    getEventInfo(eventName);
})
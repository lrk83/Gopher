var dateFormEl = document.querySelector("#date-form");
var activityFormEl = document.querySelector("#activity-form");
var activityCardEl = document.querySelector("#activityCard");
var resultsCardEl = document.querySelector('#resultsCard');


var baseLink = "https://app.ticketmaster.com/discovery/v2/events.json";
var apiKey = "&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR";
var globalDateInput = "";
var stateCode="";

var displayEvents = function(data){
    console.log(data);
    resultsCardEl.innerHTML="";
    resultsCardEl.setAttribute("class","card searchCard");
    resultsCardEl.innerHTML='<div class="card-header"><h3>Do any of these sound fun?</h3></div><div class="card-body">';

    for (x=0;x<data.length;x++){
        console.log(data[x].name);
        var newEventButton=document.createElement("button");
        newEventButton.textContent=data[x].name;
        newEventButton.setAttribute("class","btn");
        resultsCardEl.appendChild(newEventButton);
    }

    resultsCardEl.innerHTML=resultsCardEl.innerHTML+'</div>';
};

var getEventsList=function(activityType){
    date = globalDateInput+"T00:00:01Z";
    console.log(activityType);
    console.log(stateCode);
    fetch(baseLink+"?startDateTime="+date+"&classificationName="+activityType+"&stateCode="+stateCode+"&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR").then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
                displayEvents(data._embedded.events);
            });
        }else{
            window.alert("There was a problem with your request!");
        };
    });
};

var getActivities = function(){
    console.log("get Activities");
    activityCardEl.innerHTML="";
    activityCardEl.setAttribute("class","card searchCard");
    activityCardEl.innerHTML="<div class='card-header'><h3>What kind of event do you have in mind?</h3></div><div class='card-body'><form id='activity-form'><button class='btn' id='music' type='button'>Music</button><button class='btn' id='sports' type='button'>Sports</button><button class='btn' id='artsTheater' type='button'>Arts & Theater</button><button class='btn' id='film' type='button'>Film</button><button class='btn' id='miscellaneous' type='button'>I'm Feeling Lucky</button></form></div>";
};

var eventFormHandler = function(event){
    console.log("In the event form handler");
    console.log(event.target);

    event.preventDefault();
    
    var targetEl=event.target;

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
    var dateInput = document.querySelector("input[name='date']").value;
    var stateInput = document.querySelector("input[name='state']").value

    console.log(stateInput);

    // check if inputs are empty (validate)
    if (!dateInput) {
        alert("You need to enter a date!");
        return false;
    }else if (!stateInput){
        alert("You need to enter a state!");
        return false;
    }

    // reset form fields for next date to be entered
    //document.querySelector("input[name='date']").value = "";
    //document.querySelector("input[name='state']").value = "";

    globalDateInput=dateInput;
    stateCode=stateInput;
    //Check weather
    getActivities();
};

dateFormEl.addEventListener("submit",dateFormHandler);

activityCardEl.addEventListener("click",eventFormHandler);
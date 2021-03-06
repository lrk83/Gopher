//Query Selector variables
var dateFormEl = document.querySelector("#date-form");
var activityFormEl = document.querySelector("#activity-form");
var activityCardEl = document.querySelector("#activityCard");
var resultsCardEl = document.querySelector('#resultsCard');
var nameOfEvent = document.querySelector("#nameOfEvent");
var eventInfoEl = document.querySelector("#eventInfo");
var iframe = document.querySelector("#iframe");
var adressFrame = document.querySelector("#adressFrame");
var gopherIt = document.querySelector("#goPherIt");

//Varaibles for links
var baseLink = "https://app.ticketmaster.com/discovery/v2/events.json";
var apiKey = "&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR";

//Global variables for passing between functions
var globalDateInput = "";
var stateCode="";
var eventsInfo=[];
var venuesInfo=[];
var searchedEvents=[];

//Load events from local storage
var loadEvents = function(){
    var savedEvents = localStorage.getItem("searchedEvents");

        if (!savedEvents) {
            savedEvents=[];
            return false;
        };

        searchedEvents=JSON.parse(savedEvents);
};

//When page is first loaded, load local storgae
loadEvents();

//Save events to local storage
var saveSearchedEvents = function(data){
    searchedEvents.push(data);
    localStorage.setItem("searchedEvents",JSON.stringify(searchedEvents));
};

//get Directions
var getDirections = function(venue){
    
    //Remove all ? and & from venue name
    venueForLoop="";
    for (x=0;x<venuesInfo.length;x++){
        if (venuesInfo[x].name===venue && venuesInfo[x].name!=venueForLoop){
            venueForLoop=venuesInfo[x].name;

            venueNameCompiled=venuesInfo[x].name+venuesInfo[x].address+venuesInfo[x].city+venuesInfo[x].state;

            venueNameEdited="";
            for (y=0;y<venueNameCompiled.length;y++){
                if(venueNameCompiled[y]!="&" && venueNameCompiled[y]!="?"){
                    venueNameEdited+=venueNameCompiled[y];
                };
            };

            //Remove all spaces from the venue name
            venueName="";
            venueNameEdited.split(" ").forEach((element) => {
                venueName+=element;
                venueName+="+";
            });

            //Make a map for the venue
            iframe.innerHTML="";
            var googleMapsIFrame = document.createElement("iframe");
            gopherIt.textContent="Gopher It.";
            googleMapsIFrame.setAttribute("src","https://www.google.com/maps/embed/v1/place?key=AIzaSyCNGVJ1YMzTfo0ANBH6sPMd9kmnZwqUh2o&q="+venueName);
            googleMapsIFrame.setAttribute("width","600");
            googleMapsIFrame.setAttribute("height","450");
            googleMapsIFrame.setAttribute("style","border: 0");
            googleMapsIFrame.setAttribute("loading","lazy");
            iframe.appendChild(googleMapsIFrame);

            adressFrame.innerHTML="";

            //Make an address card for the venue
            var newAdressRow1 = document.createElement("div");
            newAdressRow1.setAttribute("class","row");

            var newAdressName = document.createElement("h4");
            newAdressName.textContent = venuesInfo[x].name
            newAdressRow1.appendChild(newAdressName);

            var newAdressRow2 = document.createElement("div");
            newAdressRow2.setAttribute("class","row");

            var newAdress = document.createElement("p");
            newAdress.textContent = venuesInfo[x].address
            newAdressRow2.appendChild(newAdress);

            var newAdressRow3 = document.createElement("div");
            newAdressRow3.setAttribute("class","row");

            var newAdressState = document.createElement("p");
            newAdressState.textContent = venuesInfo[x].city+", "+venuesInfo[x].state;
            newAdressRow3.appendChild(newAdressState);

            var newAdressRow4 = document.createElement("div");
            newAdressRow4.setAttribute("class","row");

            var newAdressZip = document.createElement("p");
            newAdressZip.textContent = venuesInfo[x].zipCode
            newAdressRow4.appendChild(newAdressZip);

            adressFrame.appendChild(newAdressRow1);
            adressFrame.appendChild(newAdressRow2);
            adressFrame.appendChild(newAdressRow3);
            adressFrame.appendChild(newAdressRow4);
            adressFrame.setAttribute("class","white");
        };
    };
};

//Display all events for a given attraction
var displayEventInfo = function(data){
    //Save artist/attraction name
    nameOfEvent.textContent=data._embedded.events[0]._embedded.attractions[0].name;

    if(window.matchMedia("screen and (max-width: 980px)").matches){
        var newEventInfoImage = document.createElement("img");
        newEventInfoImage.setAttribute("src",data._embedded.events[0].images[2].url);
        nameOfEvent.appendChild(newEventInfoImage);
        };


    //Display the events
    eventInfoEl.innerHTML="";
    
    for (x=0;x<data._embedded.events.length;x++){
        var newEventInfoEl = document.createElement("div");
        newEventInfoEl.setAttribute("class","row");

        var newEventInfoCard = document.createElement("card");
        newEventInfoCard.setAttribute("class","card searchCard");

        var newEventInfoCardCol6=document.createElement("div");
        newEventInfoCardCol6.setAttribute("class","column col-6");

        var newEventInfoCardHeader=document.createElement("div");
        newEventInfoCardHeader.setAttribute("class","card-header");

        var newEventInfoName=document.createElement('h4');
        newEventInfoName.textContent=data._embedded.events[x].name+' ('+data._embedded.events[x].dates.start.localDate+')';
        newEventInfoCardHeader.appendChild(newEventInfoName);

        newEventInfoCardCol6.appendChild(newEventInfoCardHeader);

        var newEVentInfoCardBody=document.createElement("div");
        newEVentInfoCardBody.setAttribute("class","card-body");

        var getTicketsButton = document.createElement("a");
        getTicketsButton.setAttribute("class","getTickets");
        getTicketsButton.setAttribute("href",data._embedded.events[x].url);
        getTicketsButton.setAttribute("target","_blank");
        getTicketsButton.textContent="Get Tickets";

        var getDirectionsButton = document.createElement("a");
        getDirectionsButton.setAttribute("id",data._embedded.events[x]._embedded.venues[0].name);

        //Save the venues address for address section
        var newVenueInfo = {
            name: data._embedded.events[x]._embedded.venues[0].name,
            address: data._embedded.events[x]._embedded.venues[0].address.line1,
            city: data._embedded.events[x]._embedded.venues[0].city.name,
            zipCode: data._embedded.events[x]._embedded.venues[0].postalCode,
            state: data._embedded.events[x]._embedded.venues[0].state.name
        };
        venuesInfo.push(newVenueInfo);
        
        getDirectionsButton.setAttribute("class","getDirections");
        getDirectionsButton.setAttribute("href","#iframe");
        getDirectionsButton.textContent="Get Directions";

        newEVentInfoCardBody.appendChild(getTicketsButton);
        newEVentInfoCardBody.appendChild(getDirectionsButton);

        newEventInfoCardCol6.appendChild(newEVentInfoCardBody);

        newEventInfoCard.appendChild(newEventInfoCardCol6);

        var newEventInfoCardCol4=document.createElement("div");
        newEventInfoCardCol4.setAttribute("class","column col-4");

        if(!window.matchMedia("screen and (max-width: 980px)").matches){
        var newEventInfoImage = document.createElement("img");
        newEventInfoImage.setAttribute("src",data._embedded.events[x].images[x].url);
        newEventInfoCardCol4.appendChild(newEventInfoImage);
        };

        newEventInfoCard.appendChild(newEventInfoCardCol4);
        newEventInfoEl.appendChild(newEventInfoCard);

        eventInfoEl.appendChild(newEventInfoEl);
    };
};

//fetch event info from ticketmaster
var getEventInfo = function(eventName){

    //search eventsInfo for this event
    for (x=0;x<eventsInfo.length;x++){
        if (eventsInfo[x].name===eventName){
            eventforDisplay=eventsInfo[x].attractionID;
        }
    }
    
    //Get the info for all events for this attraction ID, in this state, past this date
    date = globalDateInput+"T00:00:01Z";
    fetch(baseLink+"?stateCode="+stateCode+"&attractionId="+eventforDisplay+"&startDateTime="+date+"&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR").then(function(response){
        if (response.ok){
            response.json().then(function(data){
                saveSearchedEvents(data);
                displayEventInfo(data);
            });
        }
    });
};

//Make a list of buttons for all attractions available in this category and this state
var displayEvents = function(data,activityType){
    //Reset list of events
    resultsCardEl.innerHTML="";

    //Make the list of events
    resultsCardEl.setAttribute("class","card searchCard");
    resultsCardEl.innerHTML='<div class="card-header"><h3>Do any of these sound fun?</h3></div><div class="card-body">';

    //List of buttons already displayed
    var eventsDisplayed=[];

    //For I'm feeling luck only display 1 event
    if (activityType==="miscellaneous"){
        var newEventButton=document.createElement("button");
        newEventButton.textContent=data[0].name;
        newEventButton.setAttribute("class","btn");
        resultsCardEl.appendChild(newEventButton);

        //Save it to eventsDisplayed
        eventsDisplayed.push(data[0].name);

        //Save its info to eventsInfo
        var eventInfo={
            name: data[0].name,
            attractionID: data[0]._embedded.attractions[0].id
        };

        eventsInfo.push(eventInfo);
    }else{
        for (x=0;x<data.length;x++){

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
                if (data[x]._embedded.attractions[0].id!=null){
                    //Display it
                    var newEventButton=document.createElement("button");
                    newEventButton.textContent=data[x].name;
                    newEventButton.setAttribute("class","btn");
                    newEventButton.setAttribute("href","#eventInfoSection");
                    resultsCardEl.appendChild(newEventButton);

                    //Save it to eventsDisplayed
                    eventsDisplayed.push(data[x].name);

                    //Save its info to eventsInfo
                    var eventInfo={
                        name: data[x].name,
                        attractionID: data[x]._embedded.attractions[0].id
                    };

                    eventsInfo.push(eventInfo);
                }
            };
        };
    }

    resultsCardEl.innerHTML=resultsCardEl.innerHTML+'</div>';
};

//fetch list of attractions available in this category and this state
var getEventsList=function(activityType){
    date = globalDateInput+"T00:00:01Z";
    fetch(baseLink+"?startDateTime="+date+"&classificationName="+activityType+"&stateCode="+stateCode+"&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR").then(function(response){
        if (response.ok){
            response.json().then(function(data){

                displayEvents(data._embedded.events,activityType);
            });
        }else{
            window.alert("There was a problem with your request!");
        };
    });
};

//List the different activity categories
var getActivities = function(){
    //Reset List of activities
    activityCardEl.innerHTML="";

    //Make the list of activities
    activityCardEl.setAttribute("class","card searchCard");
    activityCardEl.innerHTML="<div class='card-header'><h3>What kind of event do you have in mind?</h3></div><div class='card-body'><form id='activity-form'><button class='btn' id='music' type='button'>Music</button><button class='btn' id='sports' type='button'>Sports</button><button class='btn' id='artsTheater' type='button'>Arts & Theater</button><button class='btn' id='film' type='button'>Film</button><button class='btn' id='miscellaneous' type='button'>I'm Feeling Lucky</button></form></div>";
};

var eventFormHandler = function(event){
    event.preventDefault;

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
    };
};

//Save the state 
var dateFormHandler = function(event){
    event.preventDefault();

    //Get date and state
    var dateInput = moment().format("YYYY-MM-DD")
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

//event listeners

//When "Search" button is clicked
dateFormEl.addEventListener("submit",dateFormHandler);

//When one of the event types is clicked
activityCardEl.addEventListener("click",eventFormHandler);


//When one of the event buttons is clicked
resultsCardEl.addEventListener("click",function(event){
    var targetEl = event.target;
    var eventName =targetEl.textContent;
    getEventInfo(eventName);
});

//When get directions is clicked
$('#eventInfo').on("click",".getDirections",function(){
    var venue =$(this)[0].attributes.id.nodeValue;
    getDirections(venue);
});


//MODAL STUFF


//Gopher it modal
var modalBtn = document.querySelector("#modalBtn");
var modalBg = document.querySelector("#modalBG");
var modalClose = document.querySelector("#modalClose");

modalBtn.addEventListener("click",function(){
    modalBg.classList.add("bg-active");
});

modalClose.addEventListener("click",function(){
    modalBg.classList.remove("bg-active");
});


//connect modal
var connectBtn = document.querySelector("#connectBtn");
var connectBg = document.querySelector("#connectModalBG")
var connectClose = document.querySelector("#connectClose");

connectBtn.addEventListener("click",function(){
    console.log("clicked");
    connectBg.classList.add("bg-active");
});

connectClose.addEventListener("click",function(){
    connectBg.classList.remove("bg-active");
});

// local storage 
var tasks = [];
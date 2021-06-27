//Variables for query Selectors
var iframe = document.querySelector("#iframe");
var pastSearchesBox = document.querySelector("#pastSearchesBox");
var eventInfoEl =document.querySelector("#eventInfo");
var adressFrame = document.querySelector("#adressFrame");
var gopherIt = document.querySelector("#goPherIt");

//Variables for passing btwn functions
var savedEvents = [];
var eventsInfo = [];
var globalDateInput = moment().format("YYYY-MM-DD");
var stateCode = "";
var venuesInfo = [];

//Varaibles for links
var baseLink = "https://app.ticketmaster.com/discovery/v2/events.json";
var apiKey = "&apikey=T95dZRPqdgVYqRDHuXUKuK8DTaYIgRoR";


//Get directions for a given venue
var getDirections = function(venue){
    venueForLoop="";
    for (x=0;x<venuesInfo.length;x++){

        //Get venues address for google maps
        if (venuesInfo[x].name===venue && venuesInfo[x].name!=venueForLoop){
            venueForLoop=venuesInfo[x].name;

            venueNameCompiled=venuesInfo[x].name+venuesInfo[x].address+venuesInfo[x].city+venuesInfo[x].state;

            //Remove any ?s or &s from venue name
            venueNameEdited="";
            for (y=0;y<venueNameCompiled.length;y++){
                if(venueNameCompiled[y]!="&" && venueNameCompiled[y]!="?"){
                    venueNameEdited+=venueNameCompiled[y];
                };
            };

            //Remove any spaces from the venue name
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

            //Make an address card for the venue
            adressFrame.innerHTML="";

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

//Make the display events section for a given attraction
var displayEventInfo = function(data){

    //Save artist/attraction name
    nameOfEvent.textContent=data._embedded.events[0]._embedded.attractions[0].name;

    //This is for formatting the artist pictures
    if(window.matchMedia("screen and (max-width: 980px)").matches){
        var newEventInfoImage = document.createElement("img");
        newEventInfoImage.setAttribute("src",data._embedded.events[0].images[2].url);
        nameOfEvent.appendChild(newEventInfoImage);
        };

    //getDirections(data._embedded.events[0]._embedded.venues[0].name);
    eventInfoEl.innerHTML="";

    //Display the events
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

        //Save the venue address for getDirections
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
        };
    };

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

//Display all events for a given state and a given category
var displayEvents = function(data){
    
    //Display the event
    var newEventButton=document.createElement("button");
    newEventButton.textContent=data._embedded.events[0].name;
    newEventButton.setAttribute("class","btn");
    newEventButton.setAttribute("href","#eventInfoSection");
    pastSearchesBox.appendChild(newEventButton);

    //Save the events info to eventsInfo
    var eventInfo={
        name: data._embedded.events[0].name,
        attractionID: data._embedded.events[0]._embedded.attractions[0].id
    };
    eventsInfo.push(eventInfo);
};

//load events from local storage
var loadEvents = function(){
    var savedEvents = localStorage.getItem("searchedEvents");

    if (!savedEvents) {
        savedEvents=[];
        return false;
    };

    savedEvents=JSON.parse(savedEvents);

    stateCode= savedEvents[0]._embedded.events[0]._embedded.venues[0].state.stateCode;

    //Display each event in local storage
    for(x=0;x<savedEvents.length;x++){
        displayEvents(savedEvents[x]);
    }; 
};

//Event listeners
pastSearchesBox.addEventListener("click",function(event){
    var targetEl = event.target;
    var eventName =targetEl.textContent;
    getEventInfo(eventName);
});

$('#eventInfo').on("click",".getDirections",function(){
    var venue =$(this)[0].attributes.id.nodeValue;
    getDirections(venue);
});

//load events from local storage when page first loads
loadEvents();
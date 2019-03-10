/**
 * Draw calendar
 * XXX document dates types...
 */
function drawCalendar(startDate, endDate, dateData){
  // Need to clear calendar before we draw it...
  let calendar = document.getElementById('calendar');
  calendar.innerHTML = "";

  const cellMargin = 2,
        cellSize = 17;
  const labelOffset = 20;

  let svg = d3.select("#calendar")
    .selectAll("svg")
    .data(d3.timeMonth.range(d3.timeMonth.floor(startDate), endDate))
    .enter()
    .append("svg")
    .attr("class", "month")
    .attr("height", ((cellSize * 6) + (cellMargin * 7) + labelOffset))  // max 6 rows in month
    .attr("width", ((cellSize * 7) + (cellMargin * 8)))
    .append("g")

  svg.append("text")
    .attr("class", "month-name")
    .attr("y", labelOffset / 2)
    .attr("x", cellMargin)
    .attr("text-anchor", "left")
    .text(function(d) { return d3.timeFormat('%B')(d); })

  const getDay = d3.timeFormat("%w"),   // Sunday based day [0, 6]
        getWeek = d3.timeFormat("%U");  // Sunday based week [0, 53]

  let rect = svg.selectAll("rect.day")
    .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
    .enter()
    .append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 3) // rounded corners
    .attr("ry", 3)
    .attr("fill", '#eaeaea') // default light grey fill
    .attr("y", function(d) {
        const weekOffset = getWeek(d) - getWeek(new Date(d.getFullYear(), d.getMonth(), 1));
        return (weekOffset * cellSize) + ((weekOffset + 1) * cellMargin) + labelOffset;
    })
    .attr("x", function(d) {
        const dayOffset = getDay(d);
        return (dayOffset * cellSize) + (dayOffset * cellMargin) + cellMargin;
    })
    .on("mouseover", function(d) { d3.select(this).classed('hover', true); })
    .on("mouseout", function(d) { d3.select(this).classed('hover', false); })
    .datum(d3.timeFormat("%Y-%m-%d"));

  rect.append("title")
    .text(function(d) { return d3.utcFormat("%a, %Y-%m-%d")(new Date(d)); });

  let lookupNumEvents = d3.nest()
    .key(function(d) { return d.day; })
    .rollup(function(v){ return d3.sum(v, function(d) { return d.events.length; }); })
    .object(dateData);

  let lookupEvents = d3.nest()
    .key(function(d) { return d.day; })
    .rollup(function(v){ return v[0].events.join(', '); })
    .object(dateData);

  let scale = d3.scaleLinear()
    .domain(d3.extent(dateData, function(d) { return d.events.length; }))
    .range([0.4, 1.]);  // don't use low part of range

  rect.filter(function(d) { return d in lookupNumEvents; })
    .style("fill", function(d) { return d3.interpolatePuBu(scale(lookupNumEvents[d])); })
    .select("title")
    .text(function(d) { return d3.utcFormat('%a, %Y-%m-%d')(new Date(d)) + ":  " + lookupEvents[d]; });
}

/**
 * [Google Calendar API sample)[https://developers.google.com/calendar/quickstart/js]
 */

// Client ID and API key from the Developer Console.
const CLIENT_ID = '58280590265-epo6dfaaks8tqph3i5ha8l9lu572lnhd.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCd0DR2KNsiuA84YZbP0OUiNJNjQfMDA8E';

// Array of API discovery doc URLs for APIs used by the quickstart.
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

/**
 * Authorization scopes required by the API; multiple scopes can be
 * included, separated by spaces.
 */
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');

/**
 * Dates we care about
 */
const TODAY_DATE = new Date();
const START_DATE = new Date(TODAY_DATE.getFullYear(), TODAY_DATE.getMonth(), 1);
const END_DATE = new Date(TODAY_DATE.getFullYear(), TODAY_DATE.getMonth() + 12, 1);

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = function(event) { gapi.auth2.getAuthInstance().signIn(); };
    signoutButton.onclick = function(event) { gapi.auth2.getAuthInstance().signOut();};
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'inline-block';
    updateCalendar();
  } else {
    authorizeButton.style.display = 'inline-block';
    signoutButton.style.display = 'none';
    console.log('HEY!!!');
    // Clear dropdown menu and draw empty calendar events.
    let idDropdown = document.getElementById('calendar_ids');
    idDropdown.innerHTML = "";
    drawCalendar(START_DATE, END_DATE, []);
  }
}

/**
 * XXX docs...
 */
function updateCalendar() {
  gapi.client.calendar.calendarList.list({}).then(function(response) {
    const calendars = response.result.items;
    let calendarItems = [];
    for (let i = 0; i < calendars.length; ++i) {
        const c = calendars[i];
        console.log(c.summary + ' ' + c.id);
        calendarItems.push({'id':c.id, 'label':c.summary});
    }
    return calendarItems;
  }).then(function(calendarItems) {
    // Add calendar ids to dropdown menu.
    let idDropdown = document.getElementById('calendar_ids');
    for (let i = 0; i < calendarItems.length; ++i) {
      let idButton = document.createElement('a');
      const c = calendarItems[i];
      idButton.innerHTML = c.label;
      idButton.onclick = function(event) {
        drawCalendarEvents(c.id);
      };
      idDropdown.appendChild(idButton);
    }
    drawCalendarEvents('primary');
  });
}

/**
 * XXX docs
 */
function drawCalendarEvents(calendarId) {
  console.log('Fetching id: ' + calendarId);

  gapi.client.calendar.events.list({
    'calendarId': calendarId,
    'timeMin': (START_DATE).toISOString(),
    'timeMax': (END_DATE).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    const events = response.result.items;
    let dates = {};
    for (let i = 0; i < events.length; ++i) {
      const e = events[i];
      for (let d = new Date(e.start.date); d < new Date(e.end.date); d.setDate(d.getDate() + 1)) {
        if (dates.hasOwnProperty(d)) {
          dates[d].events.push(e.summary);
        } else {
          dates[d] = {'day': d.toISOString().substring(0, 10), 'events':[e.summary]};
        }
      }
    }

    console.log('Dates: ' + JSON.stringify(Object.values(dates)));
    drawCalendar(START_DATE, END_DATE, Object.values(dates));
  });
}

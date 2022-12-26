// Saving to local storage
var events = JSON.parse(localStorage.getItem('events')) || {};
var selectedHour = null;

// Sets date on header
$('#calendar-date').text(moment().format('MMMM DD, YYYY'));

// Calendar Hours
for (var i = 9; i < 18; i++) {
    var hour = moment().hour(i).format('h A');
    var hourDiv = $('<div class="calendar-hour"></div>');
    hourDiv.text(hour);
    $('#calendar-hours').append(hourDiv);
}

// Displays events for the day
displayEvents();

//  Open modal when the hour is clicked
$('.calendar-hour').click(function() {
    selectedHour = $(this).text();
    $('#event-time').val(selectedHour);
    $('#event-form-modal').modal('show');
});

// Save event
$('#event-form').submit(function(e) {
    e.preventDefault();
    var title = $('#event-title').val();
    var description = $('#event-description').val();
    if (title) {
      if (!events[selectedHour]) {
        events[selectedHour] = [];
      }
      events[selectedHour].push({
        title: title,
        description: description
      });
      displayEvents();
      $('#event-form-modal').modal('hide');
      localStorage.setItem('events', JSON.stringify(events));
    }
});

// Display the events for the current day
function displayEvents() {
    $('#events').empty();
    for (var hour in events) {
      var hourDiv = $('<div class="event-hour"></div>');
      hourDiv.text(hour);
      $('#events').append(hourDiv);
      var eventList = $('<ul class="event-list"></ul>');
      for (var i in events[hour]) {
        var event = events[hour][i];
        var eventLi = $('<li class="event"></li>');
        eventLi.text(event.title + ': ' + event.description);
        var eventTime = moment(hour, "h A");
        var currentTime = moment();
        if (eventTime.isBefore(currentTime)) {
        eventLi.addClass("past-event");
        } else if (eventTime.isSame(currentTime)) {
        eventLi.addClass("current-event");
        } else {
        eventLi.addClass("future-event");
        }
        var deleteButton = $('<button class="delete-button">Delete</button>');
        deleteButton.click(function() {
          events[hour].splice(i, 1); 
          localStorage.setItem('events', JSON.stringify(events)); 
          displayEvents();
        });
        eventLi.append(deleteButton);
        eventList.append(eventLi);
      }
      $('#events').append(eventList);
    }
}

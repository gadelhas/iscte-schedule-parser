var fs = require('fs');
const jsdom = require("jsdom");
const ics = require('ics');

const {JSDOM} = jsdom;

var html = fs.readFileSync('table.html', 'utf8', (err, data) => {
    return data;
});

const dom = new JSDOM(html);
const $ = (require('jquery'))(dom.window);

var classes = $(".period-first-slot");

var events = [];

for (var i = 0; i < classes.length; i++) {
	var period = $(classes[i]);
    var start_time = period.attr('datetimemilis');
    var parsed_start_time = new Date(start_time);

    var all_time = period.attr('rowspan');
    
	var class_name = period.find('a').first().text();
    let duration = (30 * all_time);
    let teacher = period.find('.timetable-slot-teacher-value').first().text();
    let room = period.find('a').eq(2).text();

	console.log(class_name + " - " + start_time + " - durante: " + duration + " minutos" + " | Sala: " + room);

    let event = {
        title: class_name,
        description: 'Docente: ' + teacher + "\n" + room,
        location: room,
        start: [parsed_start_time.getFullYear(), parsed_start_time.getMonth() + 1, parsed_start_time.getDate(), parsed_start_time.getHours(), parsed_start_time.getMinutes()],
        duration: { minutes: duration },
        busyStatus: 'FREE',
    }

    events.push(event);
}

const { error, value } = ics.createEvents(events);

if(error) {
    console.log(error);
    return;
}

fs.writeFileSync('calendar.ics', value);

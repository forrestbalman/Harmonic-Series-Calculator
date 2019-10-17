//returns upward series
function otonalFreq(f, p) {
    return (f * p).toFixed(2);
}

//returns downward series
function utonalFreq(f, p) {
    return (f / p).toFixed(2);
}

//converts MIDI to pitch name
function freqToMidi(f) {
    return Math.round(69 + (12 * Math.log2(f / 440)));
}

//returns keyboard key
function keyboardNumber(f) {
    return Math.round(12 * Math.log2(f / 440) + 49);
}

//converts MIDI to
let noteNames = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
function midiToPitch(f) {
    let octave = Math.floor(Math.round(12 * Math.log2(f / (440 * Math.pow(2, -4.75)))) / 12);
    return `${noteNames[freqToMidi(f) % 12]}${octave}`;
}

//converts difference in cents from keyboard pitch
function adjustment(f) {
    let pureMidiFreq = Math.pow(2, (freqToMidi(f) - 69) / 12) * 440;
    return Math.round(1200 * Math.log2(f / pureMidiFreq));
}

//creates table
let frequency,
    partials,
    seriesType;
function tableMaker(p) {
    frequency = $("#user-freq").val();
    partials = $("#user-parts").val();
    seriesType = $("#user-type").text();

    if (frequency === "" || partials === "") {
        alert("A field has been left blank.");
        return;
    } 

    if (frequency <= 0 || isNaN(frequency)) {
        alert("The provided frequency is not a valid value.");
        return;
    }

    if (partials <= 0 || Number.isInteger(+partials) === false || isNaN(partials)) {
        alert("The provided number of partials is not a valid value.");
        return;
    }

    if (seriesType === "Otonality") {
        for (let i = 0; i < partials; i++) {
            $("tbody").append(`<tr>
                       <th scope="row">${i}</th> \
                       <td>${otonalFreq(frequency, (i + 1)).toString() + "hz"}</td> \
                       <td>${freqToMidi(frequency * (i + 1))}</td> \
                       <td>${keyboardNumber(frequency * (i + 1))}</td> \
                       <td>${midiToPitch(frequency * (i + 1))}</td> \
                       <td>${adjustment(frequency * (i + 1))}</td> \
                       </tr>`);
        }
    }

    if (seriesType === "Utonality") {
        for (let i = 0; i < partials; i++) {
            $("tbody").append(`<tr>
                       <th scope="row">${i + 1}</th> \
                       <td>${utonalFreq(frequency, (i + 1)).toString() + "hz"}</td> \
                       <td>${i}</td> \
                       <td>${i}</td> \
                       </tr>`);
        }
    }
    adjustment(frequency);
}

//interactive functions
$(document).ready(function() {
    $(".dropdown-item").mouseover(function() {
        if ((this).text === "Otonality") {
            $("#user-type-info").text("Otonality - an ascending series.");
        } else if ((this).text === "Utonality") {
            $("#user-type-info").text("Utonality - an inverted series.");
        }
    });
    $(".dropdown-item").click(function() {
        $("tbody").empty();
        $("#user-type").text(this.text);
        tableMaker(partials);
    });
})
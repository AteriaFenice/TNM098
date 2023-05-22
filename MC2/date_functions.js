function daySlider() {

    var slider = document.getElementById("rangeDay");
    var output = document.getElementById("dateText");
    var dayText = days_text[new Date(used_year, used_month, slider.value, start_time,0).getDay()];
    output.innerHTML =  dayText + " " + slider.value + " Jan"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        var value = this.value;
        dayText = days_text[new Date(used_year, used_month, this.value, start_time,0).getDay()];
        output.innerHTML = dayText + " " + value + " Jan";
   
    }
    
    // Update the data when finished sliding
    slider.onchange = function() {
        //console.log(this.value);
        var lower_date = new Date(used_year, used_month, this.value, start_time,0);
        var upper_date = new Date(used_year, used_month, this.value, end_time,0);
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtered data");
    }

}

function timeSlider() {
    var slider_lower = document.getElementById("rangeTimeLower");
    var slider_upper = document.getElementById("rangeTimeUpper");
    var output = document.getElementById("timeText");
    output.innerHTML = slider_lower.value + ":00-" + slider_upper.value + ":00"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider_lower.oninput = function() {
        var value = this.value;
        output.innerHTML = output.innerHTML = value + ":00-" + slider_upper.value + ":00";
   
    }

    // Update the current slider value (each time you drag the slider handle)
    slider_upper.oninput = function() {
        var value = this.value;
        output.innerHTML = output.innerHTML = slider_lower.value + ":00-" + value + ":00";
   
    }

    // Update the data when finished sliding
    slider_lower.onchange = function() {
        //console.log(this.value);
        var lower_date = new Date(used_year, used_month, start_date.getDate(), this.value, 0);
        var upper_date = new Date(used_year, used_month, end_date.getDate(), slider_upper.value, 0);
        
        //console.log('lower_date: ', lower_date);
        //console.log('higher_date: ', upper_date);

        start_time = this.value;
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtered data");
    }

    // Update the data when finished sliding
    slider_upper.onchange = function() {
        //console.log(this.value);
        //console.log(slider_lower.value);
        var lower_date = new Date(used_year, used_month, start_date.getDate(), slider_lower.value,0);
        var upper_date = new Date(used_year, used_month, end_date.getDate(), this.value,0);
        end_time = this.value;
        start_date = lower_date;
        end_date = upper_date;
        getFilterData(lower_date, upper_date, chosen_id);
        console.log("updated filtered data");
    }
    
}

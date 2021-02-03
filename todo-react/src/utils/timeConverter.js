module.exports = {
  // takes total_minutes as parameter and converts them to [h min] format, for example param 80
  // will return string "1h 20min"
  minutesToTitle: (total_minutes) => {
    let string = "";
    let hours = parseInt(total_minutes / 60);
    let minutes = total_minutes % 60;
    if (hours > 0) {
      string += hours + "h ";
    }
    if (minutes > 0) {
      string += minutes + "min";
    }

    return string;
  },
  minutesToSlider: (total_minutes) => {
    let string = "";
    let hours = parseInt(total_minutes / 60);
    let minutes = total_minutes % 60;
    if (hours > 0) {
      string += hours + "h";
    }
    if (minutes > 0) {
      string += minutes + "min";
    } else if (minutes === 0) {
      string += "00min";
    }
    return string;
  },
  minutesToSubtask: (total_minutes) => {
    let string = "";
    let hours = parseInt(total_minutes / 60);
    let minutes = total_minutes % 60;
    if (hours > 0) {
      string += hours + "h ";
    }
    if (minutes > 0) {
      string += minutes + " min";
    }

    return string;
  },
};

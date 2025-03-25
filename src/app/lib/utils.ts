export function getDateComponents(date: Date = new Date()): {
    day: number;
    month: string;
    dayOfWeek: string;
  } {
    const day = date.getDate();
    const nmonth = date.getMonth() + 1; // Months are zero-indexed
    const dayOfWeekIndex = date.getDay();
   
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    let month = months[nmonth];


  
    const dayOfWeek = daysOfWeek[dayOfWeekIndex];
  
    return { day, month, dayOfWeek };
  }
  
function getDaySufix(day : number){
    if (day > 3) return 'th';
    else {
        if (day == 2) return 'nd';
        if (day == 1) return 'st';
    }
}

export function getTodayFormated(){
    const today = getDateComponents();
    const todayDate = new Date();
    const minute = todayDate.getMinutes();

    //let minutes = (minute >= 0 && minute <= 9) ? `0${minute}` : minute;
    let minutes = 0;
    return today.dayOfWeek+", " + today.day + getDaySufix(today.day) + ' ' + today.month + ' ' + todayDate.getHours() + ':' + minutes; 
}
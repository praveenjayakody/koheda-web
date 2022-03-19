export class Xui {
    static parseForm (event) {
        // https://dev.to/smeijer/simple-form-handling-in-react-o72
        const data = new FormData(event.currentTarget);
        return Object.fromEntries(data.entries());
    }
    static formatCurrency(value) {
        if (typeof value == "undefined") {
            return "NaN";
        } else {
            var numVal = parseInt(value);
            if (numVal >= 1000000) {
                return ( (numVal / 1000000).toFixed(1) + " M" );
            }
            if (numVal >= 1000) {
                return ( (numVal / 1000).toFixed(1) + " K" );
            }
            return numVal;
        }
    }
    static getWeekOfMonth = function (thisDate, exact = false) {
        var month = thisDate.getMonth()
            , year = thisDate.getFullYear()
            , firstWeekday = new Date(year, month, 1).getDay()
            , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
            , offsetDate = thisDate.getDate() + firstWeekday - 1
            , index = 1 // start index at 0 or 1, your choice
            , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
            , week = index + Math.floor(offsetDate / 7)
        ;
        if (exact || week < 2 + index) return week;
        return week === weeksInMonth ? index + 5 : week;
    }
    static getFormattedDate = function (thisDate, format) {
        var theseMonths, today = new Date(), M;
        today = thisDate;
        theseMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
        
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        
        var yyyy = today.getFullYear();
        var yy = today.getYear() - 100;


        M = theseMonths[today.getMonth()];
        
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        if (typeof (format) === "undefined") {
            format = "mm/dd/yyyy";
        }
        today = format.replace("dd", dd).replace("mm", mm).replace("yyyy", yyyy).replace("yy", yy).replace("M", M);
        return today;
    }
}
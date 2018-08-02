let el = function(id) {
    return document.getElementById(id);
}

var storedBills = JSON.parse(localStorage.getItem("bill"));
var getPayDate = moment(JSON.parse(localStorage.getItem("setNextPay")));
var getUserIncome = JSON.parse(localStorage.getItem("setUserIncome"));

console.log(getUserIncome);

chooseDate = function() {
    var x = document.getElementById("pay-date").value;
    document.getElementById("date-output").innerHTML = x;
}

var userIncome = 0;
var um = '';
var md = '';
var umd = '';

userPay = function() {
    userIncome = el('user-income').value;
    userNextPay = moment(el('pay-date').value);
    localStorage.setItem('setNextPay', JSON.stringify(userNextPay));
    localStorage.setItem('setUserIncome', JSON.stringify(userIncome));

    userSummary();
    totalBills();
    showBills();
}


userSummary = function() {
    getPayDate = moment(JSON.parse(localStorage.getItem("setNextPay")));
    getUserIncome = JSON.parse(localStorage.getItem("setUserIncome"));
    return document.getElementById('info').innerHTML = 'You have ' + '<strong>$' + getUserIncome + '</strong> in your account, until you get paid again on <strong>' + moment(getPayDate).format('LL') + '</strong>';
}

if (getUserIncome > 1) {
    userSummary();
}

/* Show current bills */
if (localStorage.getItem('bill')) {
    bill = JSON.parse(localStorage.getItem('bill'));
} else {
    bill = [];
}

showBills = function() {
    el('bill-list').innerHTML = '';

    bill.sort(function(a, b) {
        var dateA = moment(a.date), 
            dateB = moment(b.date);
        return dateA - dateB;
    });
    
    for (var i = 0; i < bill.length; i++) {
        billDue = moment(bill[i].date);
        var md = billDue.format('LL');
        today = moment();

        if (billDue > getPayDate) {
            el('bill-list').innerHTML += '<li class="future"> Future <strong>Name:</strong> ' + bill[i].name + ' <strong>Frequency:</strong> ' + bill[i].frequency + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue > today && billDue <= getPayDate ) {
            el('bill-list').innerHTML += '<li class="due-soon"> DUE this paycheck <strong>Name:</strong> ' + bill[i].name + ' <strong>Frequency:</strong> ' + bill[i].frequency + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue < today) {
            el('bill-list').innerHTML += '<li class="past-due">  <strong>Name:</strong> ' + bill[i].name + ' <strong>Frequency:</strong> ' + bill[i].frequency + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue == today) {
            el('bill-list').innerHTML += '<li class="due-today"> <strong>Name:</strong> ' + bill[i].name + ' <strong>Frequency:</strong> ' + bill[i].frequency + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        }   
    }
};

showBills();

/* Remove Bills */

var billList = el('bill-list');
billList.addEventListener('click', function(e) {
    var index = e.target.getAttribute('data-value');
    bill.splice(index, 1);
    localStorage.setItem("bill", JSON.stringify(bill));

    totalBills();
    showBills();  
});

/* Add to list of bills */

addBill = function(e) {
    e.preventDefault();
    billName = el('bill-name').value;
    billFrequency = el('bill-frequency').value;
    billCost = el('bill-cost').value; 
    billDateInput = el('bill-date').value; 
    fullBillDate = moment(billDateInput);
    billDate = fullBillDate.format('LL');
    var fullToday = moment();
    var today = fullToday.format('LL');

    var billFun = function() {
        if (billDate < today) {
            return moment(billDate).add(1, 'M');
        } else {
            return billDate;
        }
    }

    newBill = {
        name: billName,
        frequency: billFrequency,
        cost: parseInt(billCost, 10),
        date: billFun() // billDate
    }

    if (billCost.length == 0) {
        alert('Please enter a cost')
    } else {
        bill.push(newBill);
        localStorage.setItem("bill", JSON.stringify(bill));
        totalBills();
        showBills();
    }
}

/* Total Bills */

var billInit = 0;
var billTotal = 0;

var totalBills = function() {
    billTotal = bill.reduce(function (accumulator, currentValue) {
        var today = moment().format('LL');
        var billDate = currentValue.date;
        var billDateMoment = moment(billDate);

        if (billDateMoment < moment(getPayDate)) {
            return accumulator + currentValue.cost;
        } else if (billDateMoment < today) {
            return accumulator + 0;
        } else {
            return accumulator + 0;
        } 
    } , billInit);

    leftover = userIncome - billTotal;

    return el('total-bills').innerHTML = 'You have $' + billTotal + ' in bills',
    el('money-leftover').innerHTML = 'You have $' + leftover + ' leftoveruntil your next paycheck (' + moment(getPayDate).format('LL') + ')';
}

totalBills();

// Update Bill Date

var updateBillDate = function() {
    var getBills = JSON.parse(localStorage.getItem("bill")); // get whats in storage
    var today = moment(); // get todays date
    bill = []; // clear the bills array

    for (var i = 0; i < getBills.length; i++) { // loop through storage
        var getBillDate = getBills[i].date; // get the current bill date
        var getBillFrequency = getBills[i].frequency; // get the current bill date
        console.log('working');
        var updatedBill = '';

        if (moment(getBills[i].date) < today && getBills[i].frequency == 1) { // if the bill date has expired and is equal to 1, add a month
            updatedBill = moment(getBills[i].date).add(1, 'M').format('LL'); // add one month to the date
            console.log(updatedBill);
        } else if (moment(getBills[i].date) < today && getBills[i].frequency == 2) { // if the bill date has expired and is equal to 2, add 2 weeks
            updatedBill = moment(getBills[i].date).add(2, 'week').format('LL'); // add 2 weeks to the date
            console.log(updatedBill);
        } else if (moment(getBills[i].date) < today && getBills[i].frequency == 3) { // if the bill date has expired and is equal to 3, add 3 months (quarterly)
            updatedBill = moment(getBills[i].date).add(3, 'M').format('LL'); // add 3 months to the date
            console.log(updatedBill);
        } else if (moment(getBills[i].date) > getPayDate && getBills[i].frequency == 4) { // one time use
            localStorage.removeItem(getBills[i]);
        } else {
            updatedBill = getBills[i].date;
        }

        updateBill = { // create a new object
            name: getBills[i].name, // update name with whats already in storage
            frequency: getBills[i].frequency, // update frequency with whats already in storage
            cost: parseInt(getBills[i].cost, 10), // update cost with whats already in storage
            date: updatedBill // update date with updated bill
        }

        bill.push(updateBill); // push the object to the bill array
    }

    localStorage.removeItem('bill'); // clear the key
    localStorage.setItem('bill', JSON.stringify(bill)); // once the loop is finished, push the bill to local storage and reset the key
    bill = JSON.parse(localStorage.getItem("bill")); // get the bills again

    totalBills();
    showBills();
};

if (storedBills) { // running the updateBillDate function without storage already set, prevents the user from adding bills
    updateBillDate();
} else {
    console.log('empty')
}


el('next').addEventListener('click', userPay);

el('add-bill').addEventListener('click', addBill);
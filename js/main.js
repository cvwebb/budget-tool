let el = function(id) {
    return document.getElementById(id);
}

var storedBills = JSON.parse(localStorage.getItem("bill"));


chooseDate = function() {
    var x = document.getElementById("pay-date").value;
    document.getElementById("date-output").innerHTML = x;
}

var userIncome = 0;
var userNextPay = '';
var formattedUserNextPay = '';
var um = '';
var md = '';
var umd = '';

userPay = function() {
    userIncome = el('user-income').value;
    // userPayFreq = el('frequency').value,
    nextPayVal = el('pay-date').value
    userNextPay = moment(nextPayVal);
    formattedUserNextPay = userNextPay.format('LL');

    userSummary();
    totalBills();
    showBills();
}


userSummary = function() {
    return document.getElementById('info').innerHTML = 'You have ' + '<strong>$' + userIncome + '</strong> in your account, until you get paid again on <strong>' + formattedUserNextPay + '</strong>';
}

/* Show current bills */
if (localStorage.getItem('bill')) {
    bill = JSON.parse(localStorage.getItem('bill'));
} else {
    bill = [];
}

console.log(storedBills);
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

        if (billDue > userNextPay) {
            el('bill-list').innerHTML += '<li class="future"> Next Paycheck <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue > today && billDue <= userNextPay ) {
            el('bill-list').innerHTML += '<li class="due-soon"> DUE this paycheck <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue < today) {
            el('bill-list').innerHTML += '<li class="past-due">  <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue == today) {
            el('bill-list').innerHTML += '<li class="due-today"> <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
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
})

/* Add to list of bills */

addBill = function(e) {
    e.preventDefault();
    billName = el('bill-name').value;
    billCost = el('bill-cost').value; 
    billDateInput = el('bill-date').value; 
    fullBillDate = moment(billDateInput);
    billDate = fullBillDate.format('LL');
    var fullToday = moment();
    var today = fullToday.format('LL');

    newBill = {
        name: billName,
        cost: parseInt(billCost, 10),
        date: billDate
    }

    if (billCost.length == 0) {
        alert('Please enter a cost')
    } else if (fullBillDate < fullToday) {
        alert('Please enter a future date');
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

        if (billDateMoment < userNextPay) {
            return accumulator + currentValue.cost;
        } else if (billDateMoment < today) {
            return accumulator + 0;
        } else {
            return accumulator + 0;
        } 
    } , billInit);

    leftover = userIncome - billTotal;

    return el('total-bills').innerHTML = 'You have $' + billTotal + ' in bills',
    el('money-leftover').innerHTML = 'You have $' + leftover + ' leftoveruntil your next paycheck (' + formattedUserNextPay + ')';
}


el('next').addEventListener('click', userPay);

el('add-bill').addEventListener('click', addBill);
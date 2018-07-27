let el = function(id) {
    return document.getElementById(id);
}

chooseDate = function() {
    var x = document.getElementById("pay-date").value;
    document.getElementById("date-output").innerHTML = x;
}

var userIncome = 0;
var userNextPay = '';
var um = '';
var md = '';
var umd = '';

userPay = function() {
    userIncome = el('user-income').value,
    // userPayFreq = el('frequency').value,
    userNextPay = new Date(el('pay-date').value);
    um = userNextPay.getMonth()+1;
    ud = userNextPay.getDate()+1;
    umd = um + '/' + ud;

    userSummary();
    totalBills();
    showBills();
}


userSummary = function() {
    return document.getElementById('info').innerHTML = 'You have ' + '<strong>$' + userIncome + '</strong> in your account, until you get paid again on <strong>' + umd + '</strong>';
}

/* Show current bills */
bill = [
    // {
    //     name: 'Mortgage',
    //     frequency: '2 Weeks',
    //     cost: 30,
    //     date: 31
    // },
    // {
    //     name: 'Water',
    //     frequency: '30 days',
    //     cost: 77,
    //     date: 28
    // },
    // {
    //     name: 'Trash',
    //     frequency: '30 days',
    //     cost: 77,
    //     date: 22
    // },
    // {
    //     name: 'Food',
    //     frequency: '30 days',
    //     cost: 77,
    //     date: 1
    // },
]


showBills = function() {
    el('bill-list').innerHTML = '';

    bill.sort(function(a, b) {
        var dateA = new Date(a.date), 
            dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    for (var i = 0; i < bill.length; i++) {
        billDue = bill[i].date;
        var m = billDue.getMonth()+1;
        var d = billDue.getDate()+1;
        var md = m + '/' + d;
        today = new Date();

        if (billDue > userNextPay) {
            el('bill-list').innerHTML += '<li class="future"> <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue > today && billDue <= userNextPay ) {
            el('bill-list').innerHTML += '<li class="due-soon"> <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
        } else if (billDue < today) {
            el('bill-list').innerHTML += '<li class="past-due"> <strong>Name:</strong> ' + bill[i].name + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + md + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
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

    totalBills();
    showBills();  
})

/* Add to list of bills */

addBill = function() {
    billName = el('bill-name').value;
    billCost = el('bill-cost').value; 
    billDateInput = el('bill-date').value; 
    billDate = new Date(billDateInput);

    newBill = {
        name: billName,
        cost: parseInt(billCost, 10),
        date: billDate
    }

    if (billCost.length == 0) {
        alert('Please enter a cost')
    } else {
        bill.push(newBill);
        totalBills();
        showBills();
    }
}

/* Total Bills */

var billInit = 0;
var billTotal = 0;

var totalBills = function() {
    billTotal = bill.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.cost;
    } , billInit);

    leftover = userIncome - billTotal;

    return el('total-bills').innerHTML = 'You have $' + billTotal + ' in bills',
    el('money-leftover').innerHTML = 'You have $' + leftover + ' leftoveruntil your next paycheck (' + userNextPay + ')';
}


el('next').addEventListener('click', userPay);

el('add-bill').addEventListener('click', addBill);
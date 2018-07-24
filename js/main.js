let el = function(id) {
    return document.getElementById(id);
}

chooseDate = function() {
    var x = document.getElementById("pay-date").value;
    document.getElementById("date-output").innerHTML = x;
}

userPay = function() {
    userIncome = el('user-income').value,
    userPayFreq = el('frequency').value,
    userNextPay = el('pay-date').value;

    userSummary();
}


userSummary = function() {
    return document.getElementById('info').innerHTML = 'You make ' + '$' + userIncome + ' every ' + userPayFreq + ' days. ' + 'You get paid again on ' + userNextPay;
}

/* Show current bills */
bill = [
    {
        name: 'Mortgage',
        frequency: '2 Weeks',
        cost: '30',
        date: '9/3/2018'
    },
    {
        name: 'Water',
        frequency: '30 days',
        cost: '77',
        date: '8/14/2018'
    },
    {
        name: 'Trash',
        frequency: '30 days',
        cost: '77',
        date: '8/14/2018'
    },
    {
        name: 'Food',
        frequency: '30 days',
        cost: '77',
        date: '8/14/2018'
    },
]

showBills = function() {
    el('bill-list').innerHTML = '';
    
    for (var i = 0; i < bill.length; i++) {
        el('bill-list').innerHTML += '<li> <strong>Name:</strong> ' + bill[i].name + ' <strong>Frequency:</strong> ' + bill[i].frequency + ' <strong>Cost:</strong> ' + bill[i].cost + ' <strong>Due Date:</strong> ' + bill[i].date + '<a href="#" id="remove-bill" data-value=' + i + '> Remove Bill</a>' + '</li>';
    }
};

var billList = el('bill-list');
billList.addEventListener('click', function(e) {
    var index = e.target.getAttribute('data-value');
    bill.splice(index, 1);

    showBills();  
})
    

showBills();

/* Add to list of bills */

addBill = function() {
    billName = el('bill-name').value;
    billFrequency = el('bill-frequency').value;
    billCost = el('bill-cost').value;
    billDate = el('bill-date').value;

    console.log('working')

    newBill = {
        name: billName,
        frequency: billFrequency,
        cost: billCost,
        date: billDate
    }

    bill.push(newBill);

    showBills();
}

/* Remove Bill */



/* Total Bills */

el('next').addEventListener('click', userPay);

el('add-bill').addEventListener('click', addBill);
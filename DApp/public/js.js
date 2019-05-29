function getOrders() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/getOrders',false);
    xhr.send();
    return(xhr.responseText);
}

function generateOrderBlocks() {

}

window.onload = function() {
    const orders = getOrders();
    console.log(orders);
    const data =  JSON.parse(orders);

    let orderTable = document.getElementById("orderTable");

    let table = document.createElement('TABLE');
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement('TR');
        for (let j = 1; j < data[i].length; j++) {
            let column = document.createElement('TD');
            column.innerText = data[i][j];
            row.appendChild(column);
        }
        table.appendChild(row);
    }
    orderTable.appendChild(table)

};
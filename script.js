document.body.onload = function () {
    if (localStorage.receipt) {
        let products = JSON.parse(localStorage.receipt)
        //console.log(products)

        for (let p of products.products) {
            receipt.addProduct(p)
        }
    }
}

class Product {
    constructor(name, quantity, price, sum) {
        this.name = name
        this.quantity = quantity
        this.price = price
        this.sum = sum
    }
}

class Receipt {
    constructor() {
        this.products = []
        this.total = 0
    }

    addProduct(product) {
        this.products.push(product)

        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        let newRow = table.insertRow(table.childElementCount - 1)

        let cell0 = newRow.insertCell(0)
        cell0.innerHTML = this.products.length

        let cell1 = newRow.insertCell(1)
        cell1.innerHTML = product.name

        let cell2 = newRow.insertCell(2)
        cell2.innerHTML = product.quantity

        let cell3 = newRow.insertCell(3)
        cell3.innerHTML = product.price + " zł"

        let cell4 = newRow.insertCell(4)
        cell4.innerHTML = product.sum + " zł"

        let cell5 = newRow.insertCell(5)
        cell5.innerHTML = `<img id="upArrow" src="img/up_arrow.png" onClick="up(this)">
        <img id="downArrow" src="img/down_arrow.png" onClick="down(this)">`

        let cell6 = newRow.insertCell(6)
        cell6.innerHTML = `<button id="editButton" class="btn btn-outline-warning btn-sm" type="button" onClick="editProduct(this)">EDYTUJ</button>
        <button id="deleteButton" class="btn btn-outline-danger btn-sm" type="button" onClick="deleteProduct(this)">USUŃ</button>`

        this.totalPrice(product.sum)
        this.resetForm()
    }

    totalPrice(productPrice) {
        document.getElementById("totalPrice").innerHTML = (Math.round((this.total += productPrice) * 100) / 100) + " zł"
    }

    resetForm() {
        let name = document.getElementById("productName")
        name.value = null
        document.getElementById("productQuantity").value = null
        document.getElementById("productPrice").value = null

        name.focus()
    }

    up(button) {
        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        //console.log(table)
        let rows = table.rows
        //console.log(rows)
        let row = button.parentElement.parentElement //button => td => tr
        // console.log(row)
        let rowIndex = row.rowIndex - 1 //Numer wiersza jak w tablicy
        //console.log(rowIndex)

        if (rowIndex > 0) {
            table.insertBefore(rows[rowIndex], rows[rowIndex - 1]) //Nowszy, nowy
            //https://stackoverflow.com/questions/2440700/reordering-arrays/2440723
            this.products.splice(rowIndex - 1, 0, this.products.splice(rowIndex, 1)[0]) //Zmiana kolejności w tablicy
        }

        this.updateLP()
        // console.log(`UP:`)
        // console.log(this.products)
    }

    down(button) {
        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        let rows = table.rows
        let row = button.parentElement.parentElement //button => td => tr
        let rowIndex = row.rowIndex - 1 //Numer wiersza jak w tablicy

        if (rowIndex < this.products.length - 1) {
            table.insertBefore(rows[rowIndex + 1], rows[rowIndex]) //Nowszy, nowy
            //https://stackoverflow.com/questions/2440700/reordering-arrays/2440723
            this.products.splice(rowIndex + 1, 0, this.products.splice(rowIndex, 1)[0]) //Zmiana kolejności w tablicy
        }

        this.updateLP()
    }

    editProduct(button) {
        let row = button.parentElement.parentElement //button => td => tr

        row.cells[1].innerHTML = `<input id="editName" class="form-control" type="text" value="${row.cells[1].innerHTML}" maxlength="25" required>`
        row.cells[2].innerHTML = `<input id="editQuantity" class="form-control" type="number" min="0" step="0.01" value="${parseFloat(row.cells[2].innerHTML)}" required>`
        row.cells[3].innerHTML = `<input id="editPrice" class="form-control" type="number" min="0" step="0.01" value="${parseFloat(row.cells[3].innerHTML)}" required>`

        row.cells[6].innerHTML = `<button id="saveButton" class="btn btn-outline-success btn-sm" type="button" onClick="saveProduct(this)">ZAPISZ</button>`
    }

    saveProduct(button) {
        let row = button.parentElement.parentElement //button => td => tr
        let rowIndex = row.rowIndex - 1 //Numer wiersza jak w tablicy
        let previousSum = parseFloat(row.cells[4].innerHTML)

        let name = document.getElementById("editName").value
        let quantity = Math.round(document.getElementById("editQuantity").value * 100) / 100
        let price = Math.round(document.getElementById("editPrice").value * 100) / 100
        let newSum = Math.round(quantity * price * 100) / 100

        row.cells[1].innerHTML = name
        row.cells[2].innerHTML = quantity
        row.cells[3].innerHTML = price + " zł"
        row.cells[4].innerHTML = newSum + " zł"
        row.cells[6].innerHTML = `<button id="editButton" class="btn btn-outline-warning btn-sm" type="button" onClick="editProduct(this)">EDYTUJ</button>
        <button id="deleteButton" class="btn btn-outline-danger btn-sm" type="button" onClick="deleteProduct(this)">USUŃ</button>`

        this.totalPrice(newSum - previousSum)

        this.products[rowIndex].name = name
        this.products[rowIndex].quantity = quantity
        this.products[rowIndex].price = price
        this.products[rowIndex].sum = newSum
    }

    deleteProduct(button) {
        if (confirm("Czy na pewno chcesz usunąć wybrany produkt?")) {
            //console.log(td) //Button
            let row = button.parentElement.parentElement //button => td => tr
            let rowIndex = row.rowIndex - 1 //Numer wiersza jak w tablicy
            let productFullPrice = parseFloat(row.cells[4].innerHTML)
            this.totalPrice(-productFullPrice)

            document.getElementById("receiptTable").deleteRow(row.rowIndex)

            this.products.splice(rowIndex, 1)
            //console.log(this.products)

            this.updateLP()
            this.resetForm()
        }
    }

    updateLP() {
        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        let lp = 0

        for (let i = 0; i < this.products.length; i++) {
            table.children[i].cells[0].innerHTML = ++lp
        }
    }
}

let receipt = new Receipt()

function readFormData() {
    let name = document.getElementById("productName").value
    let quantity = document.getElementById("productQuantity").value
    let price = document.getElementById("productPrice").value
    let sum = Math.round(+quantity * +price * 100) / 100

    let product = new Product(name, +quantity, +price, sum)

    return product
}

function up(button) {
    receipt.up(button)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function down(button) {
    receipt.down(button)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function editProduct(button) {
    receipt.editProduct(button)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function saveProduct(button) {
    receipt.saveProduct(button)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function deleteProduct(button) {
    receipt.deleteProduct(button)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

//https://getbootstrap.com/docs/5.0/forms/validation/?
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            //https://developer.mozilla.org/pl/docs/Web/API/EventTarget/addEventListener
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    //https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
                    event.preventDefault()
                    event.stopPropagation() //The preventDefault() method does not prevent further propagation of an event through the DOM. Use the stopPropagation() method to handle this.
                    form.classList.add('was-validated')
                } else {
                    event.preventDefault()
                    receipt.addProduct(readFormData())
                    localStorage.setItem("receipt", JSON.stringify(receipt))
                    form.classList.remove('was-validated')
                }
            }, false)
        })
})()
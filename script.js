let products = []
document.body.onload = function () {
    if (localStorage.receipt) {
        products = JSON.parse(localStorage.receipt)
        console.log(products)

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
        //this.id = 0
        this.total = 0
    }

    addProduct(product) {
        this.products.push(product)
        //console.log(`Wszystkie produkty:`)
        //console.log(this.products)
        //console.table(this.products)

        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        //console.log(table)

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
        //this.total += productPrice

        document.getElementById("totalPrice").innerHTML = (Math.round((this.total += productPrice) * 100) / 100) + " zł"
        //sumAll.textContent = this.total + " zł"
    }

    resetForm() {
        let name = document.getElementById("productName")
        name.value = null
        //document.getElementById("productName").value = null
        document.getElementById("productQuantity").value = null
        document.getElementById("productPrice").value = null

        selectedRow = null

        name.focus()
    }

    up(td) {
        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        //console.log(table)

        let rows = table.rows
        //console.log(rows)

        // let currentRow = td.parentElement.parentElement //tbody
        // console.log(row)

        let currentRowIndex = td.parentElement.parentElement.rowIndex - 1
        //console.log(currentRowIndex)

        if (currentRowIndex > 0) {
            table.insertBefore(rows[currentRowIndex], rows[currentRowIndex - 1]) //Nowszy, nowy
            this.products.splice(currentRowIndex - 1, 0, this.products.splice(currentRowIndex, 1)[0])
        }

        this.updateLP()

        console.log(`UP:`)
        console.log(this.products)
    }

    down(td) {
        let table = document.getElementById("receiptTable").getElementsByTagName("tbody")[0]
        let rows = table.rows
        let currentRowIndex = td.parentElement.parentElement.rowIndex - 1

        if (currentRowIndex < this.products.length - 1) {
            table.insertBefore(rows[currentRowIndex + 1], rows[currentRowIndex]) //Nowszy, nowy
            //https://stackoverflow.com/questions/2440700/reordering-arrays/2440723
            this.products.splice(currentRowIndex + 1, 0, this.products.splice(currentRowIndex, 1)[0])
        }

        this.updateLP()

        console.log(`DOWN:`)
        console.log(this.products)
        console.table(this.products)
    }

    editProduct(td) {
        let row = td.parentElement.parentElement

        // for (let i = 1; i < 5; i++) {
        //     row.cells[i].innerHTML = `<input id="editValue" value="${parseFloat(row.cells[i].innerHTML)}" required>`
        // }

        row.cells[1].innerHTML = `<input id="editName" value="${row.cells[1].innerHTML}" maxlength="25" type="text" required>`
        row.cells[2].innerHTML = `<input id="editQuantity" value="${parseFloat(row.cells[2].innerHTML)}" type="number" min="0" step="0.01" required>`
        row.cells[3].innerHTML = `<input id="editPrice" value="${parseFloat(row.cells[3].innerHTML)}" type="number" min="0" step="0.01" required>`

        row.cells[6].innerHTML = `<button id="saveButton" class="btn btn-outline-success btn-sm" type="button" onClick="saveProduct(this)">ZAPISZ</button>`
    }

    saveProduct(td) {

        let row = td.parentElement.parentElement
        console.log(row)
        let rowIndex = row.rowIndex - 1

        this.totalPrice(-parseFloat(row.cells[4].innerHTML))
        let name = document.getElementById("editName").value
        let quantity = document.getElementById("editQuantity").value
        let price = document.getElementById("editPrice").value

        row.cells[1].innerHTML = name
        row.cells[2].innerHTML = quantity
        row.cells[3].innerHTML = price + "zł"
        let sum = quantity*price

        row.cells[4].innerHTML = sum + "zł"

        row.cells[6].innerHTML = `<button id="editButton" class="btn btn-outline-warning btn-sm" type="button" onClick="editProduct(this)">EDYTUJ</button>
        <button id="deleteButton" class="btn btn-outline-danger btn-sm" type="button" onClick="deleteProduct(this)">USUŃ</button>`

        this.totalPrice(sum)

        this.products[rowIndex].name = name
        this.products[rowIndex].quantity = quantity
        this.products[rowIndex].price = price
        this.products[rowIndex].sum = sum
    }

    deleteProduct(td) {
        if (confirm("Czy na pewno chcesz usunąć wybrany produkt?")) {
            //console.log(td) //Button
            let row = td.parentElement.parentElement //button => td => tr
            //console.log(`Numer wiersza (naturalnie): ${row.rowIndex}`) //Naturalnie
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

let selectedRow = null

function readFormData() {
    let name = document.getElementById("productName").value
    let quantity = document.getElementById("productQuantity").value
    let price = document.getElementById("productPrice").value
    let sum = Math.round(+quantity * +price * 100) / 100

    let product = new Product(name, +quantity, +price, sum)

    return product
}

function up(td) {
    receipt.up(td)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function down(td) {
    receipt.down(td)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function editProduct(td) {
    receipt.editProduct(td)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function saveProduct(td) {
    receipt.saveProduct(td)
    localStorage.setItem("receipt", JSON.stringify(receipt))
}

function deleteProduct(td) {
    receipt.deleteProduct(td)
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
                    event.stopPropagation()
                    form.classList.add('was-validated')
                }
                else {
                    event.preventDefault()
                    let formData = readFormData()

                    if (selectedRow == null) {
                        receipt.addProduct(formData)
                        localStorage.setItem("receipt", JSON.stringify(receipt))
                    }
                    //else { }

                    form.classList.remove('was-validated')
                }
            }, false)
        })
})()
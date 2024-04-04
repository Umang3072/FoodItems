document.addEventListener('DOMContentLoaded', function(){

    var table = $('#categoryTable').DataTable();

    var form = document.getElementById("form");
    var submitButton = document.getElementById('submit');
    const array = [];
    var itemID = 0;
    var updateID = null;
    var maxItem = 2;

    // Validation
    var currentDate = new Date().toISOString().split('T')[0];
    $('#launchDate').attr('max',currentDate);

    // add Button
    var addButton = document.getElementById('add');

    addButton.addEventListener('click', function(){
        submitButton.textContent = 'Submit';
        $('#itemBody tr').slice(2).remove();
        form.reset();
    })

    form.addEventListener('submit', function(event){
        event.preventDefault();

        if(updateID){
            updateData();
        } else{
            displayData();
        }

        form.reset();
    })

    function displayData(){
        var obj = {
            id           : ++itemID,
            Cname        : $('#categoryName').val(),
            Cdescription : $('#categoryDescription').val(),
            Cactive      : 'Yes',
            ClaunchDate  : $('#launchDate').val()
        }

        var launch = new Date($('#launchDate').val());
        var curr = new Date();

        var past7days = (curr-launch)/(24*60*60*1000);

        if ( past7days <= 8 ){
            obj.date = 'New'
        } else {
            obj.date = 'Old'
        }

        obj.item = [];

        // Items
        var Ibody = document.querySelectorAll('#itemBody tr');

        Ibody.forEach(row => {
            var itemObj = {
                Iname          : row.querySelector('[name="itemName"]').value,
                Idesciption    : row.querySelector('[name="itemDescription"]').value,
                IfoodType      : row.querySelector('[name="foodType"]').value,
                Iprice         : row.querySelector('[name="itemPrice"]').value,
                Idiscount      : row.querySelector('[name="itemAccount"]').value,
                Igst           : row.querySelector('[name="itemGST"]').value,
                IdiscountPrice : row.querySelector('[name="itemPrice"]').value - (row.querySelector('[name="itemPrice"]').value * row.querySelector('[name="itemAccount"]').value / 100)
            }
            obj.item.push(itemObj);
        })
        
        array.push(obj);

        console.log(array);

        displayInTable();
    }

    function displayInTable(){
        table.clear().draw();

        console.log(array);

        array.forEach(obj => {
            let row = [
                `<button class="btn btn-light" data-id="${obj.id}" id="showItem">Item</button>`,
                obj.Cname,
                obj.Cdescription,
                obj.Cactive,
                obj.date,
                `<button class="btn btn-info edit" data-id="${obj.id}" data-bs-toggle="modal" data-bs-target="#modalId">Edit</button>`,
                `<button class="btn btn-danger delete" data-id="${obj.id}">Delete</button>`
            ]
            table.row.add(row).draw();
        })
    }

    // Edit Category
    $(document).on('click','.edit', function(){
        var eID = $(this).data('id');
        console.log(eID);
        editData(eID);
    })

    function editData(eID){

        submitButton.textContent = 'Save';

        var editIndex = array.findIndex(obj => obj.id == eID);

        console.log(array[editIndex].item);

        maxItem = array[editIndex].item.length - 3;

        $('#categoryName').val(array[editIndex].Cname);
        $('#categoryDescription').val(array[editIndex].Cdescription);
        $('#launchDate').val(array[editIndex].ClaunchDate);

        var items = array[editIndex].item;

        $('#itemBody').empty();

        for(let i=0; i<items.length; i++){
            if(i==0){
                addItemRowDisable();
                $('#itemBody tr:last-child').find('[name="itemName"]').val(items[i].Iname);
                $('#itemBody tr:last-child').find('[name="itemDescription"]').val(items[i].Idesciption);
                $('#itemBody tr:last-child').find('[name="foodType"]').val(items[i].IfoodType);
                $('#itemBody tr:last-child').find('[name="itemPrice"]').val(items[i].Iprice);
                $('#itemBody tr:last-child').find('[name="itemAccount"]').val(items[i].Idiscount);
                $('#itemBody tr:last-child').find('[name="itemGST"]').val(items[i].Igst);
            } else {
                addItemRow();
                $('#itemBody tr:last-child').find('[name="itemName"]').val(items[i].Iname);
                $('#itemBody tr:last-child').find('[name="itemDescription"]').val(items[i].Idesciption);
                $('#itemBody tr:last-child').find('[name="foodType"]').val(items[i].IfoodType);
                $('#itemBody tr:last-child').find('[name="itemPrice"]').val(items[i].Iprice);
                $('#itemBody tr:last-child').find('[name="itemAccount"]').val(items[i].Idiscount);
                $('#itemBody tr:last-child').find('[name="itemGST"]').val(items[i].Igst);
            }
        }

        updateID = eID;
    }

    // Update Category
    function updateData(){      
        console.log(updateID);

        var updateIndex = array.findIndex(obj => obj.id == updateID);

        array[updateIndex].Cname = $('#categoryName').val();
        array[updateIndex].Cdescription = $('#categoryDescription').val();
        array[updateIndex].ClaunchDate = $('#launchDate').val();

        var launch = new Date($('#launchDate').val());
        var curr = new Date();

        var past7days = (curr-launch)/(24*60*60*1000);

        if ( past7days <= 8 ){
            array[updateIndex].date = 'New'
        } else {
            array[updateIndex].date = 'Old'
        }

        var items = array[updateIndex].item;

        var itemNestedRows = document.querySelectorAll('#itemBody tr');

        for (let i=0; i<itemNestedRows.length; i++) {
            if(i<items.length){
                items[i].Iname =  $(itemNestedRows[i]).find('[name="itemName"]').val();
                items[i].Idesciption = $(itemNestedRows[i]).find('[name="itemDescription"]').val();
                items[i].IfoodType = $(itemNestedRows[i]).find('[name="foodType"]').val();
                items[i].Iprice = $(itemNestedRows[i]).find('[name="itemPrice"]').val();
                items[i].Idiscount = $(itemNestedRows[i]).find('[name="itemAccount"]').val();
                items[i].Igst = $(itemNestedRows[i]).find('[name="itemGST"]').val();
                items[i].IdiscountPrice = $(itemNestedRows[i]).find('[name="itemPrice"]').val() - ($(itemNestedRows[i]).find('[name="itemPrice"]').val() * $(itemNestedRows[i]).find('[name="itemAccount"]').val() / 100);
            } else {
                items.push({
                    Iname          : $(itemNestedRows[i]).find('[name="itemName"]').val(),
                    Idesciption    : $(itemNestedRows[i]).find('[name="itemDescription"]').val(),
                    IfoodType      : $(itemNestedRows[i]).find('[name="foodType"]').val(),
                    Iprice         : $(itemNestedRows[i]).find('[name="itemPrice"]').val(),
                    Idiscount      : $(itemNestedRows[i]).find('[name="itemAccount"]').val(),
                    Igst           : $(itemNestedRows[i]).find('[name="itemGST"]').val(),
                    IdiscountPrice : $(itemNestedRows[i]).find('[name="itemPrice"]').val() - ($(itemNestedRows[i]).find('[name="itemPrice"]').val() * $(itemNestedRows[i]).find('[name="itemAccount"]').val() / 100)
                })
            }
        }

        console.log(array[updateIndex]);
        displayInTable();
        updateID = null;
    }

    // Nested Table
    $(document).on('click','#showItem', function(){
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var index = $(this).data('id');
        console.log(index);

        if (row.child.isShown()){
            row.child.hide();
        } else {
            row.child(format(index)).show();
        }
    })

    function format(index){     
        var formatIndex = array.findIndex(obj => obj.id == index);

        var items = array[formatIndex].item;

        var nestedTable = $(`<table class="table table-bordered">`);

        nestedTable.append(
            `<thead>
                <tr>
                    <th scope="col">Number</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Item desciption</th>
                    <th scope="col">Food Type</th>
                    <th scope="col">Price</th>
                    <th scope="col">Discount</th>
                    <th scope="col">DiscountedPrice</th>
                </tr>
            </thead>
            <tbody></tbody>`);

        var number = 1;
        var totalPrice = 0;
        var totalDiscountedPrice = 0;

        for (var key in items){
            totalPrice += Number(items[key].Iprice);
            totalDiscountedPrice += items[key].IdiscountPrice;
            let row = `<tr><td>` + number + `</td><td>` + items[key].Iname + `</td><td>` + items[key].Idesciption + `</td><td>` + items[key].IfoodType + `</td><td>` + items[key].Iprice + `</td><td>` + items[key].Idiscount + `</td><td>` + items[key].IdiscountPrice + `</td></tr>`;
            number++;
            nestedTable.append(row);
        }

        var totalRow = `<tr><td>Total :</td><td></td><td></td><td></td><td>` + totalPrice + `</td><td></td><td>` + totalDiscountedPrice + `</td></tr>`;

        nestedTable.append(totalRow);

        return nestedTable
    }

    // add item row in pop-up form
    $(document).on('click','#addItemRow',function() {
        console.log(maxItem);
        if (maxItem < 10) {
            addItemRow();
        }     
    })

    function addItemRow() {
        let tbody = $('#itemBody');
        let tr = $('<tr></tr>');
        tr.html(
            `<td><input type="text-box" class="form-control" name="itemName" pattern="[a-zA-Z]+" required/></td>
            <td><input type="text-area" class="form-control" name="itemDescription" pattern="[a-zA-Z0-9@#$]+"/></td>
            <td>
                <select name="foodType">
                    <option value="veg">Veg</option>
                    <option value="dairyFood">Dairy food</option>
                    <option value="seaFood">Sea food</option>
                    <option value="vegan">Vegan</option>
                    <option value="nonVeg">Nonveg</option>
                </select>
            </td>
            <td><input type="number" class="form-control" name="itemPrice" min="1" required/></td>
            <td><input type="number" class="form-control" name="itemAccount" min="1" max="15" required/></td>
            <td><input type="number" class="form-control" name="itemGST" min="0" required/></td>
            <td><input type="checkbox" class="form-check-input" checked /></td>
            <td><input type="button" value="-" id="deleteItemRow"></td>`
        )
        tbody.append(tr);
        maxItem++;
        console.log(maxItem);
    }

    function addItemRowDisable() {
        let tbody = $('#itemBody');
        let tr = $('<tr></tr>');
        tr.html(
            `<td><input type="text-box" class="form-control" name="itemName" pattern="[a-zA-Z]+" required/></td>
            <td><input type="text-area" class="form-control" name="itemDescription" pattern="[a-zA-Z0-9@#$]+"/></td>
            <td>
                <select name="foodType">
                    <option value="veg">Veg</option>
                    <option value="dairyFood">Dairy food</option>
                    <option value="seaFood">Sea food</option>
                    <option value="vegan">Vegan</option>
                    <option value="nonVeg">Nonveg</option>
                </select>
            </td>
            <td><input type="number" class="form-control" name="itemPrice" min="1" required/></td>
            <td><input type="number" class="form-control" name="itemAccount" min="1" max="15" required/></td>
            <td><input type="number" class="form-control" name="itemGST" min="0" required/></td>
            <td><input type="checkbox" class="form-check-input" checked /></td>
            <td><input type="button" value="-" id="deleteItemRow" disabled></td>`
        )
        tbody.append(tr);
    }

    // remove item row in pop-up form
    $(document).on('click','#deleteItemRow', function(){
        var dIRow = $(this).closest('tr');
        console.log(dIRow);
        deleteItemInArray(dIRow);
    })

    function deleteItemInArray(dIRow){
        console.log(dIRow);
        let index = $(this).closest('tr').index();
        let itemIndex = array.findIndex(obj => obj.id == updateID);

        if(itemIndex != -1 && index < array[itemIndex].item.length){
            array[itemIndex].item.splice(index,1);
        }
        deleteItem(dIRow);
    }

    function deleteItem(dIRow){
        $(dIRow).closest('tr').remove();
        maxItem--;
        console.log(maxItem);
    }

    // Delete Category
    $(document).on('click','.delete', function(){
        var dID = $(this).data('id');
        console.log(dID);
        deleteData(dID);
    })

    function deleteData(dID){
        var deleteIndex = array.findIndex(obj => obj.id == dID);
        console.log(deleteIndex);

        if (confirm('Are you sure about delete this category')){
            array.splice(deleteIndex,1);
            for (let i = deleteIndex; i < array.length; i++) {
                array[i].id = i + 1;
            }
            itemID--;
            displayInTable();
        }

    }

})
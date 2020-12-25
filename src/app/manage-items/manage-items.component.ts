import manageItems from './manage-items.component.html';
import style from './manage-items.component.scss';
import '../../../node_modules/admin-lte/plugins/datatables/jquery.dataTables.min.js';
import '../../../node_modules/admin-lte/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js';
import '../../../node_modules/admin-lte/plugins/datatables-responsive/js/dataTables.responsive.min.js';
import '../../../node_modules/admin-lte/plugins/datatables-responsive/js/responsive.bootstrap4.min.js';
import {deleteItem, getAllItems, items, saveItem, updateItem} from '../service/item.service';
import {Item} from "../model/item";

$("app-manage-items").replaceWith('<div id="manage-items">' + manageItems + '</div>');
var html = '<style>' + style + '</style>';
$("#dashboard").append(html);

let dataTable: any;

async function loadAllItems() {

    let items = await getAllItems();

    if (dataTable) {
        ($("#tbl-items") as any).DataTable().destroy();
        $("#tbl-items tbody tr").remove();
    }

    for (const item of items) {
        $("#tbl-items tbody").append(`
            <tr>
                <td>${item.code}</td>
                <td>${item.description}</td>
                <td>${item.qtyOnHand}</td>
                <td>${item.unitPrice}</td>
                <td><i class="fas fa-trash"></i></td>
            </tr>
        `);
    }

    dataTable = ($("#tbl-items") as any).DataTable({
        "info": false,
        "searching": false,
        "lengthChange": false,
        "pageLength": 5,
        "ordering": false,
    });

    dataTable.page(Math.ceil(items.length / 5) - 1).draw(false);
}

loadAllItems();

$("#btn-save").click(async () => {
    let code = <string>$("#txt-code").val();
    let description = <string>$("#txt-description").val();
    let qty = <number>$("#txt-qty").val();
    let unitPrice = <number>$("#txt-unitprice").val();

    /* Font-end validation */
    if (!code.match(/^I\d{3}$/) || description.trim().length === 0 || unitPrice <= 0 || qty < 0) {
        alert("Invalid cutomer infromation");
        return;
    }
    let index: number = items.findIndex((item: Item) => item.code === code);
    if (index != -1) {
        try {
            await updateItem(new Item(code, description, qty, unitPrice), index);
            alert("Item Updated");
            loadAllItems();

        } catch (error) {
            alert("Failed to update the Item");
        }
    } else {
        try {
            await saveItem(new Item(code, description, qty, unitPrice));
            alert("Item Updated");
            loadAllItems();

        } catch (error) {
            alert("Failed to update the Item");
        }
    }
})

$("#tbl-items tbody").on('click', 'tr .fas', async (event: Event) => {
    let code = ($(event.target as any).parents("tr").find("td:first-child").text());
    try {
        await deleteItem(code);
        alert("Item has been deleted successfully");
        loadAllItems();
    } catch (error) {
        alert("Failed to delete the item");
    }
});



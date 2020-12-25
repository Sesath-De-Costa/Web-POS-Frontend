import {Item} from "../model/item";

export let items: Array<Item> = [];
let loaded = false;

export function getAllItems(): Promise<Array<Item>> {

    return new Promise((resolve, reject) => {

        if (!loaded) {

            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/Web_POS_Backend/items'
            }).then((data) => {
                items = data;
                loaded = true;
                resolve(items);
            }).fail(() => {
                reject();
            })

        } else {
            resolve(items);
        }

    });
}

export function saveItem(item: Item): Promise<void> {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            url: `http://localhost:8080/Web_POS_Backend/items`,
            contentType: 'application/x-www-form-urlencoded',
            data: $("#frm-customers").serialize()
        }).then(() => {
            items.push(item);
            resolve();
        }).fail(() => {
            reject();
        })
    })
}

export function updateItem(item: Item, index: number): Promise<void> {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'PUT',
            url: `http://localhost:8080/Web_POS_Backend/items`,
            contentType: 'application/json',
            data: JSON.stringify(item)
        }).then(() => {
            items.splice(index, 1, item);
            resolve();
        }).fail(() => {
            reject();
        })
    })
}

export function deleteItem(code: string): Promise<void> {
    return new Promise((resolve, reject) => {

        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/Web_POS_Backend/items?code=${code}`
        }).then(() => {
            items.splice(items.findIndex((elm) => elm.code === code), 1);
            resolve();
        }).catch(() => {
            reject();
        })

    });
}

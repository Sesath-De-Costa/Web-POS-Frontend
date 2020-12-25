import {Customer} from "../model/customer";

export let customers: Array<Customer> = [];
let loaded = false;

export function getAllCustomers(): Promise<Array<Customer>> {

    return new Promise((resolve, reject) => {

        if (!loaded) {
            $.ajax({
                method: "GET",
                url: 'http://localhost:8080/Web_POS_Backend/customer'
            }).then((data) => {
                customers = data;
                loaded = true;
                resolve(customers);
            }).fail(() => {
                reject();
            })

        } else {
            resolve(customers);
        }

    });
}

export function saveCustomer(customer: Customer): Promise<void> {

    return new Promise((resolve, reject) => {

        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/Web_POS_Backend/customer',
            contentType: 'application/x-www-form-urlencoded',
            data: $("#frm-customers").serialize()
        }).then(() => {
            customers.push(customer);
            resolve();
        }).fail(() => {
            reject();
        })
    });
}

export function updateCustomer(customer: Customer, index: number): Promise<void> {
    return new Promise((resolve, reject) => {

        $.ajax({
            method: 'PUT',
            url: `http://localhost:8080/Web_POS_Backend/customer?id=${customer.id}`,
            contentType: 'application/json',
            data: JSON.stringify(customer)

        }).then(() => {
            customers.splice(index, 1, customer);
            resolve();
        }).catch(() => {
            reject();
        })
    });
}

export function deleteCustomer(id: string): Promise<void> {
    return new Promise((resolve, reject) => {

        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/Web_POS_Backend/customer?id=${id}`
        }).then(() => {
            customers.splice(customers.findIndex((elm) => elm.id === id), 1);
            resolve();
        }).catch(() => {
            reject();
        })

    });
}

const Flutterwave = require('flutterwave-node-v3');
require('dotenv').config();
const{FLW_SECRET_KEY, FLW_PUBLIC_KEY} = process.env;
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

const chargeNgAcct = async () => {
    
    try {

        const payload = {
            "tx_ref": "MC-1585dshdhdsdv5050e8", //This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
            "amount": "100", //This is the amount to be charged.
            "account_bank": "044", //This is the Bank numeric code. You can get a list of supported banks and their respective codes Here: https://developer.flutterwave.com/v3.0/reference#get-all-banks
            "account_number": "0690000037",
            "currency": "NGN",
            "email": "olufemi@flw.com",
            "phone_number": "0902620185", //This is the phone number linked to the customer's mobile money account
            "fullname": "Olufemi Obafunmiso"
        }

        const response = await flw.Charge.ng(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}


const  bankTrf = async () => {

    try {

        const payload = {
            "tx_ref": "MC-1585230950508",
            "amount": "1500",
            "email": "johnmadakin@gmail.com",
            "phone_number": "054709929220",
            "currency": "NGN",
            "client_ip": "154.123.220.1",
            "device_fingerprint": "62wd23423rq324323qew1",
            "subaccounts": [
                {
                    "id": "RS_D87A9EE339AE28BFA2AE86041C6DE70E"
                }
            ],
            "duration": 2,
            "frequency": 5,
            "narration": "All star college salary for May",
            "is_permanent": 1,
        }

        const response = await flw.Charge.bank_transfer(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }

}




const initBulk = async (bulkData) => {

    try {
        const payload = {
            "title": "Staff salary",
            "bulk_data": bulkData
        }
        const response = await flw.Transfer.bulk(payload)
        return response;
    } catch (error) {
        return error
    }
}


module.exports = {chargeNgAcct, bankTrf, initBulk};
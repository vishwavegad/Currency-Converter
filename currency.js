// import CONFIG from './config.js';
const API_KEY = process.env.API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;
const dropdown = document.querySelectorAll(".dropdown select");
const button = document.querySelector("button");
const fromCurrency = document.querySelector(".from-container select");
const toCurrency = document.querySelector(".to-container select");
// console.log(import.meta.env.API_KEY);
for(let options of dropdown){
    for(let currencyCode in countryList){
        let newOption = document.createElement("option");
        newOption.innerText = currencyCode;
        newOption.value = currencyCode;
        if(options.name==="from" && currencyCode==="USD"){
            newOption.selected = "selected";
        } 
        else if(options.name==="to" && currencyCode==="INR"){
            newOption.selected = "selected";
        } 
        options.append(newOption);
    }
    options.addEventListener("change", (event)=>{
        updateFlag(event.target);
    })
}

const updateFlag = (ele)=>{
    let currencyCode = ele.value;
    let countryCode = countryList[currencyCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let image = ele.parentElement.querySelector("img");
    image.src = newSrc;
}

const message = document.querySelector(".message-container");

button.addEventListener("click", async(event)=>{
    event.preventDefault();
    let amount = document.querySelector(".details input");
    let amountValue = amount.value;
    if(amountValue==="" || amountValue<0){
        amountValue = 1;
        amount.value = "1";
    }
    const fromCurrencyURL = `${BASE_URL}/${fromCurrency.value.toUpperCase()}`;

    try{
        let response = await fetch(fromCurrencyURL);
        let data = await response.json();
        console.log("API Data: ", data);
        if (data.result !== "success") {
            throw new Error("API request failed.");
        }

        let rateFrom = data.conversion_rates[fromCurrency.value.toUpperCase()];
        let rateTo = data.conversion_rates[toCurrency.value.toUpperCase()];

        console.log("Rate From:", rateFrom);
        console.log("Rate To:", rateTo);

        if (isNaN(rateFrom) || isNaN(rateTo)) {
            throw new Error("Currency rates are not valid numbers.");
        }

        let conversionRate = rateTo / rateFrom;
        let finalAmount = (amountValue * conversionRate).toFixed(2);
        message.innerText = `${amountValue} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;  
    }
    catch(error){
        console.error("Error:", error);
        message.innerText = "Failed to fetch conversion rate. Please try again"
    }
})
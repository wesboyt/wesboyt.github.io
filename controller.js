function setup() {
    let txt = document.querySelector("#in");
    txt.style.cssText = "color:#a4a3a3;"
    txt.style.background = "#474749"
    txt.style.borderColor = "#5a5a5c"

    let eq = document.querySelector("#eq");
    let tr = document.createElement("tr");
    for(let i = 0; i < 9; i++) {
        let td = document.createElement("td");
        td.textContent = "0.0%";
        td.style.cssText = "color:#a4a3a3;";
        tr.appendChild(td);
        tr.style.visibility = "hidden";
    }
    eq.appendChild(tr);



    //style.visibility = "hidden"

    txt.addEventListener('keypress', (key) => {
            if(key.key == 'Enter') {
                let tmpStr = txt.value;
                console.log(tmpStr);
                let view = new Uint8Array(tmpStr.length);
                for(let i = 0; i < tmpStr.length; i++) {
                    let charCode = tmpStr.charCodeAt(i);
                    if(charCode < 128) {
                        view[i] = charCode;
                    } else {
                        throw new Error("invalid characters entered.")
                    }
                }
                let buffer = Module._malloc(view.length);
                Module.HEAP8.set(view, buffer);
                let result = Module.ccall("solve", "number", ["number", "number"], [buffer, view.length])
                let length = Number(Module.HEAPF32[result/Float32Array.BYTES_PER_ELEMENT]);
                let equities = [];
                for (let v = 1; v < length + 1; v++) {
                    equities.push(Module.HEAPF32[result/Float32Array.BYTES_PER_ELEMENT + v]);
                }
                let table = document.querySelector('tr');
                let outputs = table.children;
                console.log(outputs);
                for(let i = 0; i < equities.length; i++) {
                    outputs[i].textContent = String(equities[i] * 100).substring(0,6) + '%';
                    outputs[i].style.visibility = "visible";
                }
                for(let i = equities.length; i < 9; i++) {
                    outputs[i].style.visibility = "hidden";
                }

            }
        }
    );
    let hh = document.querySelector("#hhin");
    hh.style.cssText = "color:#a4a3a3;"
    hh.style.background = "#474749"
    hh.style.borderColor = "#5a5a5c"
    hh.addEventListener('keypress', (key) => {
        if(key.key == 'Enter') {
            post("https://ehl0o7x7ai.execute-api.us-west-2.amazonaws.com/Pay", hh.value);
        }
    });
}

function post(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        value: data
    }));

}

function showButton(){
    let authRequest;
    OffAmazonPayments.Button("AmazonPayButton", "A161J2LIJO90VQ", {
        type:  "PwA",
        color: "Gold",
        size:  "small",

        authorization: function() {
            loginOptions = {scope: "profile", popup: "true"};
            authRequest = amazon.Login.authorize (loginOptions);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => { setup(); });

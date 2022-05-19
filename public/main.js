window.addEventListener('load', async () => {
    let addresses = await makeReq('https://adressbokexpress.herokuapp.com/adress', 'GET');
    // let addresses = await makeReq('http://localhost:4000/adress', 'GET');
    renderData(addresses);
    console.log(addresses);
});

let form = document.querySelector('form');
let adressContainer = document.querySelector('#adressContainer');

document.querySelector('form button').addEventListener('click', async (e) => {
    e.preventDefault();
    let pattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/ig;
    let htmlObject = document.createElement('div');
    htmlObject.id = "error";
    document.querySelector('form').insertAdjacentElement('afterbegin', htmlObject);
    try {
        if (form.adressName.value === '' || form.number.value === '', form.epost.value === '') {
            htmlObject.innerHTML = "Fyll i formuläret tack";
            setTimeout(() => {
                htmlObject.innerHTML = '';
            }, 3000);

        } else if (pattern.test(form.epost.value) === false) {
            // alert('Ange E-post i rätt format')
            htmlObject.innerHTML = 'Ange E-post i rätt format';
            setTimeout(() => {
                htmlObject.innerHTML = '';
            }, 3000);
        } else {
            let body = {
                adressName: form.adressName.value,
                number: form.number.value,
                epost: form.epost.value
            };
            let status = await makeReq('https://adressbokexpress.herokuapp.com/adress', 'POST', body);
            // let status = await makeReq('http://localhost:4000/adress', 'POST', body);
            console.log(status);
            console.log(body);
            if (status === 'You have already adress') {
                alert('Den adressen redan registrerad');
            } else {
                let addresses = await makeReq('https://adressbokexpress.herokuapp.com/adress', 'GET');
                // let addresses = await makeReq('http://localhost:4000/adress', 'GET');
                console.log(addresses);
                renderData(addresses);
            }
        }
        form.adressName.value = '';
        form.number.value = '';
        form.epost.value = '';
    } catch (err) { console.log("Error" + err); };
});

async function makeReq(url, method, body) {
    try {
        let response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        console.log(response);
        // if (response.status != 200) {
        //     throw response
        // }
        if (response.status == 404) {
            throw new Error('NOt FOUND');
        }
        return await response.json();
    } catch (err) {
        throw err;
        // console.log('error' + err); 
    }
}

function renderData(addresses) {
    adressContainer.innerHTML = '';
    addresses.forEach((adress, i) => {
        adressContainer.innerHTML += `<div class="adressContent">
        <h3>Gatunamn: ${adress.adressName}</h3>
        <h3>Gatunummer: ${adress.number}</h3>
        <h3>E-post: ${adress.epost}</h3>
        <button onclick="remove(id)" id="${adress.id}">Radera</button>
    </div>`;
    });
}

async function remove(id) {
    console.log(id);

    let status = await makeReq('https://adressbokexpress.herokuapp.com/remove', 'POST', { "id": id });
    // let status = await makeReq('http://localhost:4000/remove', 'POST', { "id": id });
    // console.log(status);

    let addresses = await makeReq('https://adressbokexpress.herokuapp.com/adress', 'GET');
    // let addresses = await makeReq('http://localhost:4000/adress', 'GET');
    renderData(addresses);
    console.log(addresses);

}
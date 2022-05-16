window.addEventListener('load', async () => {
    let addresses = await makeReq('http://localhost:4000/adress', 'GET');
    renderData(addresses);
    console.log(addresses);
});

let form = document.querySelector('form');
let adressContainer = document.querySelector('#adressContainer');

document.querySelector('form button').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        if (form.adressName.value === '' || form.number.value === '', form.epost.value === '') {
            alert('Fyll i formuläret tack');
        } else {
            let body = {
                adressName: form.adressName.value,
                number: form.number.value,
                epost: form.epost.value
            };
            let status = await makeReq('http://localhost:4000/adress', 'POST', body);
            console.log(status);
            console.log(body);
            if (status === 'You have already adress') {
                alert('Den adressen redan registrerad');
            } else {
                let addresses = await makeReq('http://localhost:4000/adress', 'GET');
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

    addresses.forEach(adress => {
        adressContainer.innerHTML += `<div class="adressContent">
        <h3>Aderessens namn: ${adress.adressName}</h3>
        <h3>gatunummer: ${adress.number}</h3>
        <h3>E-post: ${adress.epost}</h3>
    </div>`;
    });

}

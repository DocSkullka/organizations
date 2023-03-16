const party = document.getElementById('party')
let organizations = []

party.addEventListener('input', async function(){
    organizations = []
        const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        const token = "21e05ec0fdb6ea37437f842488d61db1d63fa15c";
        const query = party.value;
        
        if(query.length > 0){
            document.getElementById('prompt').style.display = 'block'
        }else{
            document.getElementById('prompt').style.display = 'none'
        }

        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: query})
        }
        
        
        await fetch(url, options)
        .then(response => response.json())
        .then(result =>  {
            Array.from(result.suggestions).forEach(organization => {
                organizations.push(organization)
            })
        })
        .catch(error => console.log("error", error));

        const html = organizations.map(el => {
            return `<div class='promptElement'>
            <h1 class='promptName'>${el.value}</h1>
            <p class='promptAddress'>${el.data.address.unrestricted_value}</p>
            </div>`
        }).slice(0, 5).join('')

        document.getElementById('prompt').innerHTML = `Выберите вариант или продолжите ввод` + html
        if(organizations.length === 0){document.getElementById('prompt').innerHTML = 'Неизвестная организация' }
    }
)

document.addEventListener('click', function(el){
    if(el.target.className === 'promptName'){
        party.value = el.target.textContent
         
        let sortElement =  organizations.find(function(el){
            if(el.value === party.value)
            return el
        })
        document.getElementById('type').textContent = `Организация (${sortElement.data.type})`
        document.getElementById('name_short').value = sortElement.data.name.short_with_opf
        document.getElementById('name_full').value = sortElement.data.name.full_with_opf
        document.getElementById('inn_kpp').value = `${sortElement.data.inn} / ${sortElement.data.kpp}`
        document.getElementById('address').value = sortElement.data.address.unrestricted_value
        document.getElementById('prompt').style.display = 'none'
    }
    if(el.target.className === 'promptAddress'){
        party.value = el.target.parentNode.childNodes[1].textContent
        let sortElement =  organizations.find(function(el){
            if(el.value === party.value)
            return el
        })
        document.getElementById('type').textContent = `Организация (${sortElement.data.type})`
        document.getElementById('name_short').value = sortElement.data.name.short_with_opf
        document.getElementById('name_full').value = sortElement.data.name.full_with_opf
        document.getElementById('inn_kpp').value = `${sortElement.data.inn} / ${sortElement.data.kpp}`
        document.getElementById('address').value = sortElement.data.address.unrestricted_value
        document.getElementById('prompt').style.display = 'none'
    }
    if(el.target.className !== 'promptName' && el.target.className !== 'promptAddress'){
        document.getElementById('prompt').style.display = 'none'
    }
})


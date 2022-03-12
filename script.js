const selectFields = window.document.getElementsByClassName('selectFields')
const lists = window.document.getElementsByClassName("lists")
const options = window.document.getElementsByClassName("options")
const FirstList = window.document.getElementById('FirstList')
const main = window.document.querySelector('main')
const plusButton = window.document.querySelector('.plus')

main.style.display = 'none'

// verifica se tudo foi carregado


// adicionando evento no plus button 
plusButton.addEventListener("click", () => {
    const plus = window.document.querySelector(".plus")
    cloneCard().appendBefore(plus)
    addId()
    selectFields[selectFields.length - 1].addEventListener(('click'), (e) => {

        const [ele, id] = e.target.parentNode.id.split("-")
        selectDropdown(id);
        const options = selectFields[selectFields.length - 1].parentNode.querySelectorAll('.options')
        for (option of options) {
            option.addEventListener("click", (e) => {
                const [ele, dropId] = e.target.parentNode.parentNode.id.split("-")

                addElementOnField(e, dropId)

                const lists = window.document.getElementsByClassName("lists")
                lists[dropId].classList.remove("selected")
                getCurrencies()
            })
        }




    })








})
// clona o cartao 
const cloneCard = (e) => {
    let card = window.document.querySelectorAll('.card')
    let lastCard = card[1]
    let cardClone = lastCard.cloneNode(true)
    return cardClone

}
// adiciona um item clonado antes de um elemento 
Element.prototype.appendBefore = function (element) {
    element.parentNode.insertBefore(this, element);
}, false;


// pegando os valore da api 
const apiData = () => {
    const url = 'https://restcountries.com/v2/all?fields=name,flag,currencies'
    fetch(url).then((values) => {
        values.json().then((countryes) => {
            for (countrye of countryes) {
                if (countrye.currencies) {
                    FirstList.innerHTML += `<li class="options">
                <img src="${countrye.flag}" alt="">
                <p>${countrye.currencies[0].code}</p>
                <div>
                ${countrye.name}
                </div>
            </li>`
                }

            }
            main.style.display = 'flex'
            window.document.querySelector('.box-load').style.display = 'none'
            addDataToDrop();

            // adiciona  evento no option 
            optionEvent();
            // adiciona um id para cada dropdown do nosso programa
            addId()
            // adiciona evento de click no dropdown
            fildEvents()

            getCurrencies()
        })

    })

}

apiData()

// pega as currences
const getCurrencies = () => {
    let principal = null
    console.log(principal)
    for (field of selectFields) {
        const pValue = field.querySelector('p').textContent
        const card = field.parentNode.parentNode.parentNode.parentNode.parentNode
        const cardInputvalue = card.querySelector("input[type='text']")

        if (principal) {
            console.log(principal,pValue)

            fetch(`https://economia.awesomeapi.com.br/json/last/${principal}-${pValue}`).then((iten) => {
                iten.json().then((data) => {
                    const currenceValue = data[`${principal}${pValue}`].bid
                    var pInput = window.document.getElementById('PInput')
                    cardInputvalue.value = (currenceValue * pInput.value).toFixed(2)
                    cardInputvalue.style.fontSize = '18px'
                    cardInputvalue.style.textAlign = 'right'

                }).catch((e) => {
                    cardInputvalue.value = 'Escolha outra moeda para conversão'
                    cardInputvalue.style.fontSize = '10px'
                    cardInputvalue.style.textAlign = 'center'
                })
            })

        }


        if (field.id == 'field-0') {
            principal = field.querySelector('p').innerHTML
        }

    }




}




// clona os dados da lista principal e colocoa nas demais listas
const addDataToDrop = async () => {
    let cloneList = FirstList.cloneNode(true)
    for (list of lists) {
        if (!list.childNodes.length > 0) {
            list.append(...cloneList.childNodes)
            cloneList = FirstList.cloneNode(true)
        }
    }


}





// adicionando evento de click nos fields
const fildEvents = () => {
    const selectFields = window.document.getElementsByClassName('selectFields')
    for (selectField of selectFields) {
        selectField.addEventListener('click', (e) => {
            const [ele, id] = e.target.parentNode.id.split("-")
            selectDropdown(id);
        })
    }

}

// adiciona um id para cada dropdown e list  do nosso programa
const addId = () => {
    for (selectFieldIndex in selectFields) {
        selectFields[selectFieldIndex].id = `field-${selectFieldIndex}`
    }

    for (listIndex in lists) {
        lists[listIndex].id = `list-${listIndex}`
    }
}

// abre ou fecha o dropdown seleccionado
const selectDropdown = (dropdownId) => {
    const lists = window.document.getElementsByClassName("lists")
    lists[dropdownId].classList.toggle("selected")
}


// adiciona  evento no option 
const optionEvent = () => {
    const options = window.document.getElementsByClassName("options")
    for (option of options) {
        option.addEventListener("click", (e) => {
            const [ele, dropId] = e.target.parentNode.parentNode.id.split("-")
            selectDropdown(dropId) // remove o dropdown 
            addElementOnField(e, dropId)
            getCurrencies()


        })
    }


}

// fecha dropdawn selecionado pela option 
const closeDrop = (dropId) => {
    selectDropdown(dropId)

}
const addElementOnField = (optionTarget, dropId) => {
    const option = optionTarget.target.parentNode
    const imgSrc = option.querySelector('img').src
    const pValue = option.querySelector('p').textContent

    selectFields[dropId].innerHTML = `<img src="${imgSrc}" alt="">
    <p>${pValue}</p>`

}


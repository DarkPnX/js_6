/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise (resolve => {
        fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(response => response.json())
            .then(towns => towns.sort((a,b)=>{
                return a.name < b.name ? -1 : 1
            }))
            .then(sortTowns => resolve(sortTowns));
    });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    let city = full.toUpperCase();
    let localStr = chunk.toUpperCase();
    if (~city.indexOf(localStr)) { //если нет совпадений , то ~city.indexOf(localStr) == 0
        return true;
    }else{
        return false;
    }
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
//кнопка повторной загрузки городов
const restartBtn = homeworkContainer.querySelector('#loading-btn-restart');

let listTowns;

filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле
    let inVal = filterInput.value;

    const resultList = listTowns.filter(town => isMatching(town.name , inVal));

    while(filterResult.lastChild){
        filterResult.removeChild(filterResult.lastChild);//innerHTML вроде не безопасен, решил так сделать
    }

    if(!inVal){
        return;
    }

    resultList.forEach(town => {
       const newElem = document.createElement('div');
       newElem.innerText = town.name;
       filterResult.appendChild(newElem);
    });

});


restartBtn.addEventListener('click',e =>{
   e.preventDefault();
   blockLoadAndError();
});



function blockLoadAndError() {
    loadingBlock.innerText = 'Загрузка...';
    loadTowns().then(sortTowns => {
       listTowns = sortTowns;
       loadingBlock.style.display = 'none';
       restartBtn.style.display = 'none';
       filterBlock.style.display = 'block';
    }).catch(()=>{
        loadingBlock.innerText = 'Не удалось загрузить города';
        restartBtn.style.display = 'block';
    });
}

blockLoadAndError();


export {
    loadTowns,
    isMatching
};

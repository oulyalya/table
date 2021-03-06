const appRoot = document.getElementById('app-root');

/*
write your code here

list of all regions
externalService.getRegionsList();
list of all languages
externalService.getLanguagesList();
get countries list by language
externalService.getCountryListByLanguage()
get countries list by region
externalService.getCountryListByRegion()
*/

function renderFilters() {
  const element = document.createElement('div');
  element.classList.add('filters');

  element.innerHTML = `
  <h1>Countries search</h1>
  <form>
    <fieldset>
      <p>Please choose type of search:</p>
      <div>
        <div>
          <input type="radio" id="radio1" name="type">
          <label for="radio1">By Region</label>
        </div>
        <div>
          <input type="radio" id="radio2" name="type">
          <label for="radio2">By Language</label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <p>Please choose search query:</p>
      <select id="select" disabled>
        <option value="default">select option</option>
      </select>
    </fieldset>
  </form>
  <div class="output"></div>
  `;

  appRoot.append(element);
}

renderFilters();

function renderSelectOptions(data) {
  let select = document.querySelector('#select');
  select.innerHTML = `<option value="default">select option</option>`;

  data.forEach(element => {
    select.removeAttribute('disabled');
    select.value = 'default';
    document.querySelector('.output').textContent = 'No results, please choose another option';
    let option = document.createElement('option');
    option.value = element;
    option.textContent = element;
    select.append(option);
  });
}

let radios = document.querySelectorAll('input[type=radio]');

let data = [];
let showByRegion = false;
let showByRegionshowByLanguage = false;

radios.forEach(el => el.addEventListener('change', () => {
  if (document.querySelector('#table')) {
    document.querySelector('#table').classList.add('hidden');
  }

  if (document.querySelector('#radio1').checked) {
    renderSelectOptions(externalService.getRegionsList());
    showByRegion = true;
    showByRegionshowByLanguage = false;
  } if (document.querySelector('#radio2').checked) {
    renderSelectOptions(externalService.getLanguagesList());
    showByRegion = false;
    showByRegionshowByLanguage = true;

  }
}));

function selectData() {
  if (showByRegion) {
    data = externalService.getCountryListByRegion(select.value);
  } else if (showByRegionshowByLanguage) {
    data = externalService.getCountryListByLanguage(select.value);
  }
  return data;
}

function renderTable(data) {
  document.querySelector('.output').textContent = '';

  if (document.querySelector('#table')) {
    document.querySelector('#table').classList.remove('hidden');
  }

  if (!document.querySelector('#table')) {
    let table = document.createElement('table');
    table.classList.add('table');
    table.setAttribute('id', 'table');
    table.innerHTML = `
  <thead>
    <th class="name">Country name 
      <button id="sort-by-name" type="button">&#x2195;</button>
    </th>
    <th><p>Capital</p></th>
    <th>World Region</th>
    <th>Languages</th>
    <th class="area">Area
      <button id="sort-by-area" type="button">&#x2195;</button>
    </th>
    <th>Flag</th>
  </thead>
  <tbody></tbody>
  `;

    appRoot.append(table);
  }

  document.querySelector('#table tbody').innerHTML = '';

  data.forEach(item => {
    let { name, flagURL, region, area, capital, languages } = item;
    let tr = document.createElement('tr');
    let img = document.createElement('IMG');
    img.src = flagURL;
    let imgTd = document.createElement('td');
    imgTd.append(img);

    tr.innerHTML = `
    <td>${name}</td>
    <td>${capital}</td>
    <td>${region}</td>
    <td>${Object.values(languages).join(', ')}</td>
    <td>${area}</td>
`;

    tr.append(imgTd);

    document.querySelector('#table tbody').append(tr);
  });
}

function selectChangeHandler() {
  let countries = selectData();
  renderTable(countries);

  let nameBtn = document.querySelector('#sort-by-name');
  let areaBtn = document.querySelector('#sort-by-area');

  let isOrderedByName = false;
  let isOrderedByArea = false;

  nameBtn.addEventListener('click', (evt) => {
    if (isOrderedByName) {
      let countries = selectData();
      countries = countries.sort((a, b) => (a.name > b.name) ? 1 : -1).reverse();
      renderTable(countries);
      nameBtn.innerHTML = '&#8595;';
    } else {
      let countries = selectData();
      countries = countries.sort((a, b) => (a.name < b.name) ? -1 : 1);
      renderTable(countries);
      nameBtn.innerHTML = '&#x2191;';
    }
    isOrderedByName = !isOrderedByName;
    isOrderedByArea = false;
    areaBtn.innerHTML = '&#x2195;';
  });

  areaBtn.addEventListener('click', (evt) => {
    if (isOrderedByArea) {
      let countries = selectData();
      countries = countries.sort((a, b) => (a.area > b.area) ? 1 : -1).reverse();
      renderTable(countries);
      areaBtn.innerHTML = '&#8595;';
    } else {
      let countries = selectData();
      countries = countries.sort((a, b) => (a.area < b.area) ? -1 : 1);
      renderTable(countries);
      areaBtn.innerHTML = '&#x2191;';
    }
    isOrderedByArea = !isOrderedByArea;
    isOrderedByName = false;
    nameBtn.innerHTML = '&#x2195;';
  });
}

let select = document.querySelector('select');
select.addEventListener('change', selectChangeHandler);

const API_KEY = '5ed59fc53af04d8eab4931014a323e5b';
const choicesElem = document.querySelector('.js-choice');
const formSearch = document.querySelector('.form-search');
const newsList = document.querySelector('.news-list');
const title = document.querySelector('.title');
const titleEndArr = ['новость', 'новости', 'новостей'];


const getTitleEnding = (n, titles) => {
  return titles[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  ];
}

const choices = new Choices(choicesElem, {
  allowHTML: true,
  searchEnabled: false,
  itemSelectText: '',
})

const getData = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY
    }
  });
  const data = await response.json();
  return data;
}

const getFormattedDate = (isoDate) => {
  const date = new Date(isoDate);

  const fullDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const fullTime = date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric'
  });

  return `<span class="news-date">${fullDate}</span> ${fullTime}`;
}

const getImage = (url) => new Promise((resolve, reject) => {
    const image = new Image(270, 200);
    
    image.addEventListener('load', () => {
      resolve(image);
    });

    image.addEventListener('error', () => {
      image.src = url || './image/nophoto.png';
      resolve(image);
    })

    image.src = url || './image/nophoto.png';
    image.className = 'news-image';        
    return image;
})

const renderCard = (data) => {
  newsList.textContent = "";
  data.forEach(async (news) => {
    const {urlToImage, title, url, description, publishedAt, author, source} = news;
    const card = document.createElement("li");
    card.className = "news-item";

    const image = await getImage(urlToImage);
    image.alt = title;
    card.append(image);

    card.insertAdjacentHTML('beforeend', `
      <h3 class="news-title">
        <a class="news-link" href="${url}" target="_blank">${title}</a>
      </h3>
      <p class="news-description">${description != null ? description : ''}</p>
      <div class="news-footer">
        <time class="news-datetime" datetime="${publishedAt}">
          ${getFormattedDate(publishedAt)}
        </time>
        <div class="news-author">${author !== null ? author : source.name}</div>
      </div>
    `);
    newsList.append(card);
  });
};

const loadNews = async (country) => {
  const preload = document.createElement('li');
  preload.className = 'preload';  
  newsList.append(preload);

  if (!country) country = localStorage.getItem('country') || 'ru';
  title.classList.add('hide');
  choices.setChoiceByValue(country);
  const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}&category=science`);
  renderCard(data.articles);
}

const loadSearch = async (search) => {
  const data = await getData(`https://newsapi.org/v2/everything?q=${search}`);
  title.classList.remove('hide');
  title.textContent = `По вашему запросу "${search}" ${data.articles.length === 1 ? 'найдена' : найдено} ${data.articles.length} ${getTitleEnding(data.articles.length, titleEndArr)}`;
  choices.setChoiceByValue('');
  if (data) { renderCard(data.articles); }
}

choicesElem.addEventListener('change', (event) => {
  const country = event.detail.value;
  loadNews(country);
  localStorage.setItem('country', country);
})

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  loadSearch(formSearch.search.value);
  formSearch.reset();
})

loadNews();
const API_KEY = '5ed59fc53af04d8eab4931014a323e5b';
const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');

const choices = new Choices(choicesElem, {
  allowHTML: true,
  searchEnabled: false,
  itemSelectText: '',
});

const getData = async (url) => {
  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY
    }
  });
  const data = await response.json();

  return data;
}

const renderCard = (data) => {
  newsList.textContent = "";
  data.forEach((news) => {
    const card = document.createElement("li");
    card.className = "news-item";
    card.innerHTML = `
      <img src="${news.urlToImage}" alt="${news.title}" class="news-image">
      <h3 class="news-title">
        <a class="news-link" href="${news.url}" target="_blank">${news.title}</a>
      </h3>
      <p class="news-description">${news.description}</p>
      <div class="news-footer">
        <time class="news-datetime" datetime="${news.publishedAt}">
          <span class="news-date">${news.publishedAt}</span> 11:06
        </time>
        <div class="news-author">${news.author !== null ? news.author : news.source.name}</div>
      </div>
    `;
    newsList.append(card);
  });
};

const loadNews = async () => {
  const data = await getData('https://newsapi.org/v2/top-headlines?country=ru');
  renderCard(data.articles);
}

loadNews();
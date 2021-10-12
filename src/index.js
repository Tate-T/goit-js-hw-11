import refs from './js/refs';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.list.addEventListener('click', onPictureClick);
window.addEventListener('scroll', trackScroll);
refs.goTopBtn.addEventListener('click', backToTop);

let page = 1;

function onFormSubmit(e) {
    e.preventDefault();
    const value = e.currentTarget.elements.query.value;
    if (!value) {
        refs.loadMoreBtn.classList.add('is-hidden');
        return refs.list.innerHTML = '';
    }
    const BASE_URL = 'https://pixabay.com/api/';
    const queryParam = new URLSearchParams({
        key: '23821952-b78db636c6ddcde4f5e93d8a9',
        image_type: 'photo',
        q: value,
        orientation: 'horizontal',
        safesearch: true,
        // page: 1,
        per_page: 40,
    });

    fetch(`${BASE_URL}?${queryParam}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            renderCard(data);
            refs.loadMoreBtn.classList.remove('is-hidden');
        });

    function renderCard({ hits }) {
        refs.list.innerHTML = cardMarkup(hits);
    }
}

function cardMarkup(hits) {
    hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<li class="item">
<div class="photo-card">
  <img src="${webformatURL}" data-large-img=${largeImageURL} alt="${tags}" class="card-img"/>

  <div class="stats js-starts">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
      ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</div>
</li>`).join('');
}

function incrementPage() {
    page += 1;
};

function onLoadMoreBtnClick() {
    incrementPage();
    const BASE_URL = 'https://pixabay.com/api/';
    const queryParam = new URLSearchParams({
        key: '23821952-b78db636c6ddcde4f5e93d8a9',
        image_type: 'photo',
        q: refs.form.elements.query.value,
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
    });

    fetch(`${BASE_URL}?${queryParam}&page=${page}`)
        .then(res => res.json())
        .then(data => {
            renderCard(data);
            refs.loadMoreBtn.classList.remove('is-hidden');
            handleButtonClick();
        });

    function renderCard({ hits }) {
        const markup = cardMarkup(hits);
        refs.list.insertAdjacentHTML('beforeend', markup);

    }
}

const hiddenElement = refs.loadMoreBtn;
const btn = refs.formBtn;

function handleButtonClick() {
    hiddenElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function onPictureClick(e) {
    if (!e.target.classList.contains('card-img')) {
        return;
    }

    const instance = simplelightbox.create(`
    <img src="${e.target.dataset.largeImg}" width="800" height="600">
  `);
    instance.show();
}

function trackScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
        refs.goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < coords) {
        refs.goTopBtn.classList.remove('back_to_top-show');
    }
}

function backToTop() {
    if (window.pageYOffset > 0) {
        window.scrollBy(0, -80);
        setTimeout(backToTop, 0);
    }
}
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('.search-form'),
    formBtn: document.querySelector('.js-form-btn'),
    list: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    goTopBtn: document.querySelector('.back_to_top')
}

refs.form.addEventListener('submit', onFormSubmit);
refs.list.addEventListener('click', onPictureClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.goTopBtn.addEventListener('click', backToTop);
window.addEventListener('scroll', trackScroll);

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
        page: 1,
        per_page: 40,
    });

    fetch(`${BASE_URL}?${queryParam}&page=${page}&per_page=40`)
        .then(res => res.json())
        .then(data => {
            renderCard(data);
            refs.loadMoreBtn.classList.remove('is-hidden');
        });

    function renderCard({ hits }) {
        refs.list.innerHTML = cardMarkup(hits).join('');
    }
}

function cardMarkup(hits) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="item">
<div class="photo-card">
  <img src="${webformatURL}" data-large-img=${largeImageURL} alt="${tags}" class="card-img"/>

  <div class="stats js-starts">
    <p class="info-item">
      <b>Likes:</b>${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${downloads}
    </p>
  </div>
</div>
</div>`)
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

    const instance = SimpleLightbox.create(`
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
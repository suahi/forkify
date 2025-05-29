import icons from 'url:../../img/icons.svg';

class SearchView {
  #parentEl = document.querySelector('.search');
  #searchField = document.querySelector('.search__field');
  #data;

  addHandleSearch(handler) {
    // console.log('registering');

    this.#parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler(this.#searchField.value);
      this.#clearInput();
    });

    // console.log('registered');
  }

  #clearInput() {
    this.#searchField.value = '';
  }
}

export default new SearchView();

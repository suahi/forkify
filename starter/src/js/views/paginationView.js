import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { REN_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandleRenderPerPage(handle) {
    this._parentEl.addEventListener('click', e => {
      const pagBtn = e.target.closest('.btn--inline');
      // console.log(pagBtn);
      if (!pagBtn) return;

      const pageGoto = +pagBtn.dataset.goto;
      // const pageGoto = this._data.page;
      // console.log('goto page is:', pageGoto);
      handle(pageGoto);
    });
  }

  _generateMarkup() {
    const totalPageNum = Math.ceil(this._data.result.length / REN_PER_PAGE);
    const crtPageNum = this._data.page;
    // console.log(totalPageNum);
    // console.log('current page is:', crtPageNum);

    // 1. 当前是第一页，后面还有其他页
    if (crtPageNum == 1 && totalPageNum > 1)
      // prettier-ignore
      return `
            <button data-goto="${crtPageNum + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${crtPageNum + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button> `;
    // 2. 当前是最后一页
    if (crtPageNum === totalPageNum && totalPageNum > 1)
      // prettier-ignore
      return `
            <button data-goto="${totalPageNum-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${totalPageNum-1}</span>
            </button>
    `;
    // 3. 当前是中间页
    if (crtPageNum < totalPageNum)
      // prettier-ignore
      return `
            <button data-goto="${crtPageNum-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${crtPageNum-1}</span>
            </button>
            <button data-goto="${crtPageNum + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${crtPageNum + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
    `;
    // 4. 当前是第一页，后面没有其他页

    return '';
  }
}

export default new PaginationView();

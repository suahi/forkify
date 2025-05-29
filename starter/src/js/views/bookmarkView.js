import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet, Find a nice recipe and bookmark it ;)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarkView();

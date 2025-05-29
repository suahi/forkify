import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import personalView from './views/personalView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const searchRecipe = async function (keyword) {
  try {
    resultsView.renderSpinner();
    // console.log(`keyword is ${keyword}`);
    if (!keyword) return;
    // prettier-ignore
    await model.searchRecipe(keyword)
    // if (model.state.search.result == []) throw Error('nnn');
    // console.log(model.state.search.result);
    renderSlideRecipe();
  } catch (err) {
    resultsView.renderError(err);
  }
};

const renderSlideRecipe = function (page = 1) {
  resultsView.render(model.getSearchResultPage(page));
  paginationView.render(model.state.search);
};

const showRecipe = async function () {
  try {
    const hashId = window.location.hash.slice(1);
    // console.log(hashId);
    if (!hashId) return;
    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    // debugger;
    // 1）Load apis
    recipeView.renderSpinner();
    // prettier-ignore
    // const res = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
    await model.loadRecipe(hashId)
    const { recipe } = model.state;
    // 2) Render recipes
    recipeView.render(recipe);
    // 3) update bookmarks
    // debugger;
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlServing = function (newServings) {
  // console.log(model.state);
  // 1. 依据传入份数更新model.state
  model.updateServings(newServings);
  // 2. 依据model.state再次渲染recipeView.js
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.addBookmark(model.state.recipe);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUploadRecipe = async function (data) {
  // console.log(data);
  try {
    // 0)加载器
    personalView.renderSpinner();
    // 1)上传菜单并赋值给state.recipe
    await model.uploadRecipe(data);
    // 2)渲染当前的菜单
    recipeView.render(model.state.recipe);
    // 3)渲染成功后显示成功信息
    personalView.renderMessage();

    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // 4)成功信息2.5s后自动关闭
    setTimeout(function () {
      personalView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💔', err);
    personalView.renderError(err.message);
  }
};

const init = function () {
  model.loadLocalBookmarks();
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandleSearch(searchRecipe);
  paginationView.addHandleRenderPerPage(renderSlideRecipe);
  personalView.addHandlerUpload(controlUploadRecipe);
};

init();

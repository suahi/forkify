import { async } from 'regenerator-runtime';
import { API_URL, REN_PER_PAGE, KEY } from './config.js';
import { getJson, sendJson } from './helpers.js';
import personalView from './views/personalView.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// 把原始代码中的，加载recipe业务逻辑代码放入model，记录state状态变化。
export const loadRecipe = async function (hashId) {
  try {
    const data = await getJson(`${API_URL}/${hashId}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === hashId))
      state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (keyword) {
  try {
    state.search.query = keyword;
    const res = await getJson(`${API_URL}?search=${keyword}&key=${KEY}`);
    // console.log(res);
    state.search.result = res.data.recipes.map(entry => {
      return {
        id: entry.id,
        title: entry.title,
        publisher: entry.publisher,
        image: entry.image_url,
        ...(entry.key && { key: entry.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * REN_PER_PAGE;
  const end = page * REN_PER_PAGE;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (state.bookmarks.some(bookmark => bookmark.id === recipe.id)) {
    state.recipe.bookmarked = false;
    const index = state.bookmarks.findIndex(
      bookmark => bookmark.id === recipe.id
    );
    state.bookmarks.splice(index, 1);
    persistBookmark();
  } else {
    state.bookmarks.push(recipe);
    if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
    persistBookmark();
  }
};

export const loadLocalBookmarks = function () {
  const localBookmark = JSON.parse(localStorage.getItem('bookmark'));
  if (!localBookmark) return;
  // console.log(localBookmark);
  state.bookmarks = localBookmark;
  console.log(state);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    // 1) 把用户创建的菜单对象中的Ingredinets整合为一个对象
    const ingredients = Object.entries(newRecipe)
      .filter(ent => ent[0].startsWith('ingredient') && ent[1] !== '')
      .map(ing => {
        const newIng = ing[1].replaceAll(' ', '').split(',');
        if (newIng.length !== 3)
          throw Error('菜单输入格式不规范，请参考提示重新输入');
        const [quantity, unit, description] = newIng;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipeUpload = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients: ingredients,
    };

    // 2) 将整合完的数据进行'POST'模式请求数据
    const data = await sendJson(`${API_URL}?key=${KEY}`, recipeUpload);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);

    // 3) 添加书签、key等信息
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

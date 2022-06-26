import { defHttp } from '/@/utils/http/axios'
import {
  SingleArticleModel,
  ArticleParams,
  ArticleListModel,
  ArticleListParams,
  ArticleListByPageModel,
} from './model/articleModel'
import { ErrorMessageMode } from '/#/axios'

enum Api {
  getSingleArticle = '/article',
  editSingleArticle = '/article',
  createSingleArticle = '/article',
  delSingleArticle = '/article/del',
  getAllArticles = '/article/listAll',
  getArticlesByLimit = '/article/list/page',
}

/**
 * @description: get single article
 */

export function getSingleArticle(articleId: number, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<SingleArticleModel>(
    {
      url: `${Api.getSingleArticle}/${articleId}`,
    },
    {
      errorMessageMode: mode,
    }
  )
}

/**
 * @description: edit single article
 */
export function editSingleArticle(
  articleId: number,
  article: ArticleParams,
  mode: ErrorMessageMode = 'modal'
) {
  return defHttp.put(
    {
      url: `${Api.editSingleArticle}/${articleId}`,
      params: article,
    },
    {
      errorMessageMode: mode,
    }
  )
}

/**
 * @description: create single article
 */
export function createSingleArticle(article: ArticleParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.createSingleArticle,
      params: article,
    },
    {
      errorMessageMode: mode,
    }
  )
}

/**
 * @description: delete single article
 */

export function deleteSingleArticle(articleId: number, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: `${Api.delSingleArticle}/${articleId}`,
    },
    {
      errorMessageMode: mode,
    }
  )
}
/**
 * @description: get all articles
 */

export function getAllArticles(mode: ErrorMessageMode = 'modal') {
  return defHttp.get<ArticleListModel[]>(
    {
      url: Api.getAllArticles,
    },
    {
      errorMessageMode: mode,
    }
  )
}

/**
 * @description: get articles by pagination
 */

export function getArticlesByLimit(params: ArticleListParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<ArticleListByPageModel>(
    {
      url: Api.getArticlesByLimit,
      params,
    },
    {
      errorMessageMode: mode,
    }
  )
}

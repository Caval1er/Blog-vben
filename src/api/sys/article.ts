import { defHttp } from '/@/utils/http/axios'
import {
  SingleArticleModel,
  ArticleParams,
  ArticleListModel,
  ArticleListParams,
  ArticleListByPageModel,
  TagsModel,
  TagModel,
  TagParams,
} from './model/articleModel'
import { ErrorMessageMode } from '/#/axios'

enum Api {
  getSingleArticle = '/admin/article/single',
  getArticlesByLimit = '/admin/article/list',
  getAllTag = '/admin/tag/all',
  addTag = '/admin/tag/add',
  editSingleArticle = '/article/edit',
  createSingleArticle = '/article/create',
  delSingleArticle = '/article/del',
  getAllArticles = '/article/listAll',
}

/**
 * @description: get single article
 */

export function getSingleArticle(articleId: string, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<SingleArticleModel>(
    {
      url: `${Api.getSingleArticle}`,
      params: { id: articleId },
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
  return defHttp.post<ArticleListByPageModel>(
    {
      url: Api.getArticlesByLimit,
      params,
    },
    {
      errorMessageMode: mode,
    }
  )
}

export function getAlltag(mode: ErrorMessageMode = 'modal') {
  return defHttp.get<TagsModel>(
    {
      url: Api.getAllTag,
    },
    {
      errorMessageMode: mode,
    }
  )
}

export function addTag(params: TagParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<TagModel>(
    {
      url: Api.addTag,
      params,
    },
    {
      errorMessageMode: mode,
    }
  )
}

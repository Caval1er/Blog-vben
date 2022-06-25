/**
 * @description: Login interface parameters
 */

export interface SingleArticleModel {
  title: string
  publish: string
  author: string
  content: string
}

export interface ArticleParams {
  title: string
  content: string
  author: string
  publish: string
}

export interface ArticleListModel {
  id: number
  title: string
  author: string
  content: string
  publish: string
}

/**
 * @description: Article
 */

export type Tags = Tag[]
export interface Tag {
  _id: string
  name: string
  color?: string
}
export interface TagModel {
  _id: string
  name: string
  color: string
}
export interface TagsModel {
  tags: Tags
  count: number
}
export interface TagParams {
  _id?: string
  name: string
  color?: string
}
export interface SingleArticleModel {
  _id: string
  title: string
  createdAt?: string
  updatedAt?: string
  author: string
  content: string
  tags: Tags
  summary
}

export interface ArticleParams {
  title: string
  content: string
  author: string
}

export interface ArticleListModel {
  id: number
  title: string
  author: string
  content: string
  publish: string
}

export interface ArticleListParams {
  page?: number
  pageSize?: number
}

export interface ArticleListByPageModel {
  list: ArticleListModel[]
  total: number
}

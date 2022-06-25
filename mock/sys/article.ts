import { MockMethod } from 'vite-plugin-mock'
import { resultSuccess } from '../_util'
import dayjs from 'dayjs'
const articleInfo = {
  title: '我的第一个markdown',
  content: '## test',
  publish: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  author: 'zjh',
}

const articleList = [
  {
    id: 1,
    title: 'article1',
    author: '西门吹雪',
    content: '这是一段内容1',
    publish: '2022-06-25 21:00:35',
  },
  {
    id: 2,
    title: 'article2',
    author: '西门吹雪',
    content: '这是一段内容2',
    publish: '2022-06-25 21:00:35',
  },
  {
    id: 3,
    title: 'article3',
    author: '西门吹雪',
    content: '这是一段内容3',
    publish: '2022-06-25 21:00:35',
  },
  {
    id: 4,
    title: 'article4',
    author: '西门吹雪',
    content: '这是一段内容4',
    publish: '2022-06-25 21:00:35',
  },
]

export default [
  {
    url: '/basic-api/article/1',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(articleInfo)
    },
  },
  {
    url: '/basic-api/article/1',
    timeout: 200,
    method: 'put',
    response: ({ body }) => {
      console.log(body)
      return resultSuccess(null, { message: '编辑文章成功' })
    },
  },
  {
    url: '/basic-api/article',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      console.log(body)
      return resultSuccess(null, { message: '创建文章成功' })
    },
  },
  {
    url: '/basic-api/article/listAll',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(articleList, { message: '获取所有文章列表' })
    },
  },
] as MockMethod[]

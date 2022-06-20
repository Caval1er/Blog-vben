import { MockMethod } from 'vite-plugin-mock'
import { resultSuccess } from './_util'
import dayjs from 'dayjs'
const userInfo = {
  title: '我的第一个markdown',
  content: '## test',
  publish: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  author: 'zjh',
}

export default [
  {
    url: '/basic-api/article/1',
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess(userInfo)
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
] as MockMethod[]

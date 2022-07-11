import { defHttp } from '/@/utils/http/axios'

enum Api {
  // The address does not exist
  Error = '/markdown/html',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => defHttp.post({ url: Api.Error })

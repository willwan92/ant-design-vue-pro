import { axios } from '@/utils/request'

const api = {
	test: 'polls/test/'
}

export function getTestData (parameter) {
  return axios({
    url: api.test,
    method: 'get',
    params: parameter
  })
}

import { ref, toRefs, reactive, onMounted } from 'vue';

interface IFetchDataParams {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any>
  contentType?: 'application/json'
  submodule?: string | null
  parameter?: string | number | null
  token?: string | null
}

type TApiResponseData = string[]

export function useFetch() {

  const activeHttpRequests = ref<AbortController[]>([])
  
  const state = reactive({
    error: '',
    fetching: false
  })

  const fetchData = async (
    { url, method = 'GET', body, token, contentType = 'application/json' }: IFetchDataParams
  ): Promise<TApiResponseData | null> => {
    const currentAbortCtrl = new AbortController()

    const options: RequestInit = {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        ...(token && {'Authorization': `bearer ${token}`}),
      },
      method,
      signal: currentAbortCtrl.signal,
      ...(body && { body: JSON.stringify(body) })
    }
    clearError()
    state.fetching = true
    activeHttpRequests.value.push(currentAbortCtrl)
    try {
      const res = await fetch(url, options)
      const resData = await res.json()
      activeHttpRequests.value = activeHttpRequests.value.filter(el => el !== currentAbortCtrl)
      return resData
    } catch (errors) {
      state.error = errors as string
      return null
    } finally {
      state.fetching = false
    }
  }

  onMounted(() => {
    activeHttpRequests.value.forEach(el => el.abort())
  })

  function clearError() {
    if (state.error) state.error = ''
  }
  
  return {...toRefs(state), fetchData, clearError}
}
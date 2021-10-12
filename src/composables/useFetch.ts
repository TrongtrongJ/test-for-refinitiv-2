import { ref, toRefs, reactive, onMounted } from 'vue';

interface IFetchDataParams {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, any>
  contentType?: 'application/json'
  submodule?: string | null
  parameter?: string | number | null
  token?: string | null
}

type TApiResponseData = {
  
}

export function useFetch() {

  const activeHttpRequests = ref<AbortController[]>([])
  
  const state = reactive({
    error: '',
    fetching: false
  })

  const fetchData = async (
    { method = 'GET', body, token, contentType = 'application/json' }: IFetchDataParams
  ): Promise<TApiResponseData | null> => {
    const url = 'https://api.publicapis.org/categories'
    const currentAbortCtrl = new AbortController()

    const options: RequestInit = {
      headers: {
        'Content-Type': contentType,
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
import { ref, computed, watch } from 'vue'
import { useFetch } from '../composables'

const staticApi = 'https://api.publicapis.org/categories'

const fallbackData = ["Animals","Anime","Anti-Malware","Art \u0026 Design","Authentication","Blockchain","Books","Business","Calendar","Cloud Storage \u0026 File Sharing","Continuous Integration","Cryptocurrency","Currency Exchange","Data Validation","Development","Dictionaries","Documents \u0026 Productivity","Environment","Events","Finance","Food \u0026 Drink","Games \u0026 Comics","Geocoding","Government","Health","Jobs","Machine Learning","Music","News","Open Data","Open Source Projects","Patent","Personality","Phone","Photography","Science \u0026 Math","Security","Shopping","Social","Sports \u0026 Fitness","Test Data","Text Analysis","Tracking","Transportation","URL Shorteners","Vehicle","Video","Weather"]

const { fetchData, fetching, error } = useFetch()
export {
  fetching as isLoading,
  error as httpError
}

watch(error, (err) => {
  alert(String(err))
})


const categoriesData = ref<string[]>([])

export async function initializeStore() {
  try {
    const res = await fetchData({ url: staticApi })
    categoriesData.value = res || fallbackData
  } catch(err) {
    categoriesData.value = fallbackData
  }
}

export const searchInput = ref<string>('')

export const filteredCategoriesData = computed(() => 
  categoriesData.value.filter(c => c.includes(searchInput.value))
)


<script setup>
import { supabase } from '@/config/supabaseConfig.js'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const people = ref([])
const loading = ref(true)
const error = ref(null)
const columns = ['person_id','wiki_url',  'name', 'category', 'upvote', 'downvote', 'sigma', 'delta', 'pi', 'eta', 'gamma']
const colTitles = ['Name','Category',  'Upvotes', 'Downvotes', 'Sigma', 'Delta', 'Pi', 'Eta', 'Gamma']

const selectedPerson = ref(null)
const buttonDisabled = ref(true)
const alteredPeople = ref([])

let initialTimeout = null
let minuteTimer = null
const searchQuery = ref('')
const selectedCategory = ref('All')
const sortBy = ref('gamma')
const sortOptions = ref([
  { text: 'Gamma', value: 'gamma' },
  { text: 'Name', value: 'name' },
  { text: 'Upvotes', value: 'upvote' },
  { text: 'Downvotes', value: 'downvote' },
  { text: 'Sigma', value: 'sigma' },
  { text: 'Delta', value: 'delta' },
  { text: 'Pi', value: 'pi' },
  { text: 'Eta', value: 'eta' },
])

async function saveVotes() {
  if (alteredPeople.value.length === 0) {
    console.log('No changes to save.')
    return
  }

  const votesToSave = alteredPeople.value.map(
    ({ person_id, upvote, downvote }) => ({person_id,upvote,downvote,})
  )

  const { error: insertError } = await supabase.from('vote').insert(votesToSave)

  if (insertError) {
    console.error('Error saving votes:', insertError)
  } else {
    selectedPerson.value.upvote = 0
    selectedPerson.value.downvote = 0
    alteredPeople.value = [selectedPerson.value]
  }
}

async function runMinuteTasks() {
  await saveVotes()
  await getPeople()
}

// add search function or something
async function getPeople() {
  try {
    loading.value = true
    const { data, error: fetchError } = await supabase
      .from('person')
      .select(columns.join(','))
      .order(sortBy.value, { ascending: sortBy.value === 'name' })

    if (fetchError) {throw fetchError}
    if (data) {people.value = data}
  } 
  catch (e) {error.value = e} 
  finally {loading.value = false}
}

onMounted(() => {
  getPeople()
  setTimeout(() => buttonDisabled.value = false, 1000)

  const now = new Date()
  const delayUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()

  initialTimeout = setTimeout(() => {
    runMinuteTasks() // Run once at the top of the minute
    minuteTimer = setInterval(runMinuteTasks, 60000) // Then run every minute after
  }, delayUntilNextMinute)
})

onUnmounted(() => {
  clearInterval(minuteTimer)
  clearTimeout(initialTimeout)
})

function selectPerson(person){
  
  let altered = alteredPeople.value.find((p) => p.person_id === person.person_id)
  console.log(altered)
  if (altered){
    selectedPerson.value = altered
  }
  else{
      selectedPerson.value = {
      person_id:person.person_id, upvote:0, downvote:0,
      name:person.name, wiki_url:person.wiki_url
    }
    alteredPeople.value.push(selectedPerson.value)
  }
}


function handlePM(amount) {
  if (buttonDisabled.value) return
  if (!selectedPerson.value) return

  buttonDisabled.value = true
  setTimeout(() => buttonDisabled.value = false, 1000)

  if (amount ===1){
    selectedPerson.value.upvote++
  }
  else if (amount === -1){
    selectedPerson.value.downvote++
  }
}

const filteredPeople = computed(() => {
  let result = people.value;

  if (selectedCategory.value && selectedCategory.value !== 'All') {
    result = result.filter(person => person.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    result = result.filter(person => person.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }

  return result;
})

const categories = computed(() => {
  const allCategories = people.value.map(p => p.category).filter(Boolean);
  return ['All', ...new Set(allCategories)];
})

watch(sortBy, () => {
  getPeople()
})

</script>

<template>
  <main class="home-view-wrapper">


    <div class="table-container">

      <div v-if="alteredPeople.length > 0" class="altered-table-container">
        <h1 class="altered-title">Pending</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Upvotes</th>
              <th>Downvotes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in alteredPeople" :key="person.person_id">
              <td>{{ person.name }}</td>
              <td>{{ person.upvote }}</td>
              <td>{{ person.downvote }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="altered-table-container">
        <h1 class="altered-title">Pending</h1>
        <p>No changes pending.</p>
      </div>



      <!-- should be people.value.length but that breaks it, idk why -->
      <div class="table-header">
        <h1>People</h1>
        <div class="controls">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name..."
            class="search-bar"
          />
          <div class="sort-container">
            <label for="filter-by-category" class="sort-label">Category:</label>
            <select id="filter-by-category" v-model="selectedCategory" class="sort-dropdown">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="sort-container">
            <label for="sort-by" class="sort-label">Sort by:</label>
            <select id="sort-by" v-model="sortBy" class="sort-dropdown">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error">Error fetching data: {{ error.message }}</div>
      <table v-else-if="filteredPeople.length > 0">
        <thead>
          <tr>
            <th v-for="title in colTitles" :key="title">{{ title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="person in filteredPeople"
            :key="person.person_id"
            @click="selectPerson(person)"
            :class="{ 'selected-row': selectedPerson && selectedPerson.person_id === person.person_id }"
          >
            <td class="cell-name">{{ person.name }}</td>
            <td class="cell-category">{{ person.category }}</td>
            <td class="cell-plus">{{ person.upvote }}</td>
            <td class="cell-minus">{{ person.downvote }}</td>
            <td class="cell-total">{{ person.sigma }}</td>
            <td class="cell-alpha">{{ person.delta }}</td>
            <td class="cell-beta">{{ person.pi.toFixed(4) }}</td>
            <td class="cell-eta">{{ person.eta.toFixed(2) }}</td>
            <td class="cell-gamma">{{ person.gamma.toFixed(4) }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>No people found matching your search.</div>

      
    </div>

    
    <div class="details-container">
      <div v-if="selectedPerson" class="details-content">
        <h2>
          <a :href="'https://en.wikipedia.org/wiki/'+selectedPerson.wiki_url" target="_blank" rel="noopener noreferrer">
            {{ selectedPerson.name }}
          </a>
        </h2>
        
        <div class="actions">
          <div class="action-row">
            <button @click="handlePM(1)" class="action-btn plus-btn" :disabled="buttonDisabled">+</button>
            <div class="counter-display">
              <span>Plus</span>
              <span class="count-value">{{ selectedPerson.upvote }}</span>
            </div>
          </div>
          <div class="action-row">
            <button @click="handlePM(-1)" class="action-btn minus-btn" :disabled="buttonDisabled">-</button>
            <div class="counter-display">
              <span>Minus</span>
              <span class="count-value">{{ selectedPerson.downvote }}</span>
            </div>
          </div>

        </div>
      </div>
      <div v-else class="details-placeholder">
        <p>Select a person from the table to see details and actions.</p>
      </div>
    </div>


  </main>
</template>

<style scoped>
.home-view-wrapper {
  display: flex;
  height: calc(100vh - 60px); /* Full height minus navbar */
}

.table-container {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.details-container {
  flex-basis: 400px;
  border-left: 1px solid #e2e8f0;
  padding: 1.5rem;
  background-color: #f8fafc;
}

.details-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #718096;
  text-align: center;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.sort-dropdown {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #fff;
  width: 180px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search-bar {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 250px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-bar:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.altered-table-container {
  margin-top: 2.5rem;
}

.altered-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.details-content h2 a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s;
}

.details-content h2 a:hover {
  color: #2b6cb0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

thead th {
  background-color: #f8fafc;
  font-weight: 600;
  text-align: center;
}

/* Right-align numeric columns */
.cell-plus,
.cell-minus,
.cell-total,
.cell-alpha,
.cell-beta,
.cell-eta,
.cell-gamma {
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}

tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

tbody tr:hover {
  background-color: #f7fafc;
}

.selected-row {
  background-color: #ebf8ff;
  color: #2c5282;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background-color: #f8fafc;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s, border-color 0.2s;
}
.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #e2e8f0;
}

.action-btn:hover {
  background-color: #e2e8f0;
}

.plus-btn {
  color: #2f855a;
  border-color: #9ae6b4;
}

.plus-btn:hover {
  background-color: #c6f6d5;
}

.minus-btn {
  color: #c53030;
  border-color: #feb2b2;
}

.minus-btn:hover {
  background-color: #fed7d7;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.counter-display {
  display: flex;
  flex-direction: column;
}

.counter-display span:first-child {
  font-size: 0.8rem;
  color: #718096;
  text-transform: uppercase;
}

.count-value {
  font-weight: 600;
  font-size: 1.75rem;
  line-height: 1.2;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
</style>

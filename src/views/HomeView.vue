<script setup>
import { supabase } from '@/config/supabaseConfig.js'
import { ref, onMounted } from 'vue'
const topSigma = ref([])
const topUpvote = ref([])
const topPi = ref([])
const topEta = ref([])
const topDelta = ref([])
const topGamma = ref([])
const loading = ref(true)
const error = ref(null)

async function getTopRankings() {
  try {
    loading.value = true
    error.value = null

    const fetchTop5 = async (category) => {
      const { data, error } = await supabase
        .from('person')
        .select(`person_id, name, ${category}`)
        .order(category, { ascending: false })
        .limit(5)
      if (error) throw error
      return data
    }

    const [sigmaData, deltaData, gammaData] = await Promise.all([
      fetchTop5('sigma'),
      fetchTop5('delta'),
      fetchTop5('gamma')
    ])

    const [upvoteData, piData, etaData] = await Promise.all([
      fetchTop5('upvote'),
      fetchTop5('pi'),
      fetchTop5('eta')
    ])

    topSigma.value = sigmaData
    topDelta.value = deltaData
    topGamma.value = gammaData
    topUpvote.value = upvoteData
    topPi.value = piData
    topEta.value = etaData

  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTopRankings()
})
</script>

<template>
  <main class="home-view-wrapper">
    <div v-if="loading" class="status-message">Loading rankings...</div>
    <div v-else-if="error" class="status-message error">
      Error fetching data: {{ error.message }}
    </div>
    <div v-else class="rankings-container">
      <div class="ranking-grid">
        <div class="ranking-category">
          <h2>Top 5 by Sigma (Σ)</h2>
          <p class="category-description">Upvotes + Downvotes</p>
          <ol class="ranking-list">
            <li v-for="person in topSigma" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.sigma.toLocaleString() }}</span>
            </li>
          </ol>
        </div>
        <div class="ranking-category">
          <h2>Top 5 by Delta (Δ)</h2>
          <p class="category-description">Upvotes - Downvotes</p>
          <ol class="ranking-list">
            <li v-for="person in topDelta" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.delta.toLocaleString() }}</span>
            </li>
          </ol>
        </div>
        <div class="ranking-category">
          <h2>Top 5 by Gamma (γ)</h2>
          <p class="category-description">Delta / Sigma</p>
          <ol class="ranking-list">
            <li v-for="person in topGamma" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.gamma.toFixed(3) }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="ranking-grid">
        <div class="ranking-category">
          <h2>Top 5 by Upvotes</h2>
          <p class="category-description">Total Upvotes</p>
          <ol class="ranking-list">
            <li v-for="person in topUpvote" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.upvote.toLocaleString() }}</span>
            </li>
          </ol>
        </div>
        <div class="ranking-category">
          <h2>Top 5 by Pi (π)</h2>
          <p class="category-description">Upvote Percentage</p>
          <ol class="ranking-list">
            <li v-for="person in topPi" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.pi.toFixed(3) }}</span>
            </li>
          </ol>
        </div>
        <div class="ranking-category">
          <h2>Top 5 by Eta (η)</h2>
          <p class="category-description">Upvotes / Downvotes</p>
          <ol class="ranking-list">
            <li v-for="person in topEta" :key="person.person_id">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-score">{{ person.eta.toFixed(3) }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-view-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  min-height: calc(100vh - 60px); /* Full height minus navbar */
  background-color: #f8fafc;
}

.status-message {
  font-size: 1.25rem;
  color: #4a5568;
}

.error {
  color: #c53030;
}

.rankings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1600px;
}

.ranking-grid {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.ranking-category {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.ranking-category h2 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.category-description {
  font-style: italic;
  color: #718096;
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
}

.ranking-list {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0;
}

.ranking-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 1rem;
}

.ranking-list li:last-child {
  border-bottom: none;
}

.person-name {
  color: #2d3748;
}

.person-score {
  font-weight: 600;
  color: #4a5568;
}
</style>

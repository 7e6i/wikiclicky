<script setup>
import { ref } from 'vue'
import { supabase } from '@/config/supabaseConfig.js'

const requestUrl = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const wikiUrlRegex = /^https:\/\/en\.wikipedia\.org\/wiki\/[^ ]+$/
  if (!wikiUrlRegex.test(requestUrl.value)) {
    errorMessage.value = 'Please enter a valid English Wikipedia URL (e.g., https://en.wikipedia.org/wiki/...).'
    loading.value = false
    return
  }

  try {
    const urlParts = requestUrl.value.split('/');
    const article = urlParts[urlParts.length - 1];
    const name = article.replace(/_/g, ' ');

    const { error } = await supabase
      .from('request')
      .insert([{ name: name, wiki_url: article }])

    if (error) {
      throw error
    }

    successMessage.value = 'Request submitted successfully! It will be reviewed shortly.'
    requestUrl.value = ''
  } catch (error) {
    errorMessage.value = `Error submitting request: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <div class="about-container">
    <div class="about-content">
      <section class="about-section">
        <h1>The Modern Popularity Contest</h1>
        <p>Auto-clickers encouraged! No accounts, no cookies, no tracking - just a simple web app.</p>
      </section>

      <section class="about-section">
        <h2>The Idea is Simple</h2>
        <p>Upvote the people you like, downvote the people you don't.</p>
        <p>You only get one vote per person per second, so make it count.</p>
      </section>

      <section class="about-section">
        <h2>Types of Rankings</h2>
        <div class="ranking-definitions">

          <div class="ranking-item">
            <h3>Upvotes ⬆️</h3>
            <p><em>Good ol' fashioned voting.</em> The cumulative number of upvotes a person has recieved.</p>
          </div>
          <div class="ranking-item">
            <h3>Downvotes ⬇️</h3>
            <p><em>Doing what YouTube won't.</em> The cumulative number of downvotes a person has recieved.</p>
          </div>

          <div class="ranking-item">
            <h3>Sigma (Σ)</h3>
            <p><em>All press is good press.</em> The sum of all votes a person has received.</p>
          </div>
          <div class="ranking-item">
            <h3>Delta (Δ)</h3>
            <p><em>Good press is good, bad press isn't.</em> The number of upvotes minus the number of downvotes.</p>
          </div>
          <div class="ranking-item">
            <h3>Pi (π)</h3>
            <p><em>Percentage of upvotes.</em> The ratio of upvotes to the total number of votes.</p>
          </div>
          <div class="ranking-item">
            <h3>Eta (η)</h3>
            <p><em>Ratio of votes.</em> The ratio of upvotes to downvotes.</p>
          </div>
          <div class="ranking-item">
            <h3>Gamma (γ)</h3>
            <p><em>Basically pi.</em> The ratio of delta to sigma.</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Request a Person</h2>
        <p>Don't see someone you're looking for? Paste their Wikipedia URL below to request they be added.<br>Requests for non-human pages will be deleted.</p>
        <form @submit.prevent="handleSubmit" class="request-form">
          <input
            type="url"
            v-model="requestUrl"
            placeholder="https://en.wikipedia.org/wiki/..."
            required
            class="request-input"
            :disabled="loading"
          />
          <button type="submit" class="request-button" :disabled="loading">
            {{ loading ? 'Submitting...' : 'Submit Request' }}
          </button>
        </form>
        <div v-if="successMessage" class="message success-message">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="message error-message">
          {{ errorMessage }}
        </div>
      </section>
    </div>
  </div>
</template>




<style scoped>

.about-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 60px);
  background-color: #f8fafc;
}

.about-content {
  max-width: 800px;
  width: 100%;
}

.about-section {
  margin-bottom: 2.5rem;
}

.about-section h1, .about-section h2 {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.about-section h1 {
  font-size: 2.25rem;
}

.about-section h2 {
  font-size: 1.75rem;
}

.about-section p {
  line-height: 1.6;
  color: #4a5568;
}

.ranking-item {
  margin-bottom: 1.5rem;
}

.ranking-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.ranking-item p {
  margin-left: 1rem;
  }

.request-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.request-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.request-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.request-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: #2d3748;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.request-button:hover:not(:disabled) {
  background-color: #4a5568;
}

.request-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 6px;
}
.success-message {
  background-color: #c6f6d5;
  color: #22543d;
}
.error-message {
  background-color: #fed7d7;
  color: #822727;
}
</style>

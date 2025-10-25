<script setup>
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
            <p><em>Doing what YouTube won't.</em> This cumulative number of downvotes a person has recieved.</p>
          </div>

          <div class="ranking-item">
            <h3>Sigma (Σ)</h3>
            <p><em>All press is good press.</em> This is the sum of all votes a person has received.</p>
          </div>
          <div class="ranking-item">
            <h3>Delta (Δ)</h3>
            <p><em>Good press is good, bad press isn't.</em> This is the number of upvotes minus the number of downvotes.</p>
          </div>
          <div class="ranking-item">
            <h3>Pi (π)</h3>
            <p><em>Percentage of upvotes.</em> This is the ratio of upvotes to the total number of votes.</p>
          </div>
          <div class="ranking-item">
            <h3>Eta (η)</h3>
            <p><em>Ratio of votes.</em> This is the ratio of upvotes to downvotes.</p>
          </div>
          <div class="ranking-item">
            <h3>Gamma (γ)</h3>
            <p><em>Basically pi.</em> This is the ratio of delta to sigma.</p>
          </div>
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

</style>

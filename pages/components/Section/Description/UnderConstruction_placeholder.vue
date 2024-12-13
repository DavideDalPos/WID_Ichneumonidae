<style scoped>
.under-construction {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height for vertical centering */
  background-color: #f7f7f7; /* Light gray background for subtle contrast */
}

.content {
  text-align: center;
  font-size: 2rem; /* Base font size */
  color: #d9534f; /* Red color for visibility */
  background-color: #fff; /* White background behind the content */
  padding: 20px;
  border: 2px solid #d9534f; /* Solid border for emphasis */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.symbol {
  font-size: 4rem; /* Large symbol size */
  margin-bottom: 10px; /* Space between the symbol and text */
}

.text {
  font-size: 2rem; /* Slightly smaller text size */
  font-weight: bold;
}
</style>


<template>
  <div class="under-construction">
    <div class="content">
      <div class="symbol">🚧</div>
      <div class="text">Under Construction</div>
    </div>
  </div>
</template>


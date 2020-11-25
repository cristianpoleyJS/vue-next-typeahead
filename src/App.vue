<template>
  <div id="app">
    <VueNextTypeahead
      v-model:input="inputSearch"
      :api-url="`http://openlibrary.org/search.json${inputSearch ? `?title=${inputSearch}` : ''}`"
      :title="'Encuentra libros que te gusten'"
      :placeholder="'Busca un libro...'"
      :items="results"
      :key-item="'title'"
      :loading-parent-component="loading"
      @response="getResponse"
      @reset="resetComponent()"
      @hit="selectItem" />
      <p v-if="itemSelected">Item selected: {{ itemSelected }}</p>
  </div>
</template>

<script>
import VueNextTypeahead from '@/components/VueNextTypeahead.vue'

export default {
  name: 'App',
  data () {
    return {
      results: [],
      loading: false,
      inputSearch: '',
      itemSelected: {}
    }
  },
  components: {
    VueNextTypeahead
  },
  methods: {
    async getResponse (responseJson) {
      this.loading = true
      const response = await responseJson.json()
      this.results = response.docs
      this.loading = false
    },

    selectItem (item) {
      this.itemSelected = item
    },

    resetComponent () {
      this.results = []
    }
  }
}
</script>

<style lang="scss">
  @font-face {
    font-family: "AvenirNext Regular";
    src: url("https://es.habcdn.com/static/font/AvenirNext/AvenirNextLTPro-Regular.woff") format("woff");
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
  }
  @font-face {
    font-family: "AvenirNext Demi";
    src: url("https://es.habcdn.com/static/font/AvenirNext/AvenirNextLTPro-Demi.woff") format("woff");
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
  }
  @font-face {
    font-family: "AvenirNext Bold";
    src: url("https://es.habcdn.com/static/font/AvenirNext/AvenirNextLTPro-Bold.woff") format("woff");
    font-weight: 700;
    font-style: normal;
    font-stretch: normal;
  }
  * {
    font-family: "AvenirNext Regular";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  }
</style>

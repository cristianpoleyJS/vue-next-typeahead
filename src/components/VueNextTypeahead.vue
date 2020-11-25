<template>
  <span
    class="vue-next-typeahead"
    :class="[className]">
    <span
      v-if="title && showTitle"
      class="vue-next-typeahead__title">
      {{ title }}
    </span>
    <div
      class="vue-next-typeahead__wrapper-input"
      :class="{
        'vue-next-typeahead__wrapper-input--focusing': focusing
      }">
      <input
        type="text"
        autocomplete="false"
        :placeholder="placeholder"
        :value="dataInput"
        @keyup.esc="reset()"
        @input="changeInput($event)"
        @paste="changeInput($event)"
        @focus="onFocusin()"
        @blur="onFocusout()">
      <i class="ico-search" v-if="!searching && !loadingParentComponent" />
      <i class="ico-loader" v-else />
    </div>
    <ul
      v-if="dataInput.length && !searching && !loadingParentComponent && showDropdown"
      class="vue-next-typeahead__dropdown">
      <template v-if="items.length">
        <li
          v-for="(item, ix) in items"
          :key="ix"
          @click="clickItem(item)">
          <span v-html="keyItem ? highlight(item[keyItem], dataInput) : item" />
        </li>
      </template>
      <li v-else class="li-no-results">
        <slot name="no-results">{{ noResultsText }}</slot>
      </li>
    </ul>
  </span>
</template>

<script>
export default {
  name: 'VueNextTypeahead',
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    input: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: null
    },
    className: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    },
    keyItem: {
      type: String,
      default: null
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Qué necesitas...'
    },
    noResultsText: {
      type: String,
      default: 'No existen resultados para esa búsqueda...'
    },
    minChars: {
      type: Number,
      default: 2,
      validator: (value) => {
        return value > 0
      }
    },
    delay: {
      type: Number,
      default: 500
    },
    loadingParentComponent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searching: false,
      focusing: false,
      showDropdown: true,
      timeout: '',
      dataInput: ''
    }
  },
  watch: {
    'input' (newVal) {
      this.dataInput = newVal
    }
  },
  mounted () {
    // Reset component when click outside.
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.reset()
      }
    })
  },
  methods: {

    /**
     * Main method to make the query of the URL received as a prop.
     * The parent component is in charge of processing that first response.
     */
    search () {
      try {
        this.searching = true

        clearTimeout(this.timeout)

        this.timeout = setTimeout(async () => { // Begin timeout
          const response = await fetch(this.apiUrl)
          this.$emit('response', response)
          clearTimeout(this.timeout) // Clean interval
          this.showDropdown = true
          this.searching = false
        }, this.delay)
      } catch (error) {
        this.$emit('error', error)
        this.searching = false
        console.error('Check your API URL you have introduced.')
        throw error
      }
    },

    /**
     * Emit value input each time you write.
     * It is only triggered if it has a value and if it meets the minimum number of characters.
     * When you write here the search event is triggered.
     */
    changeInput (event) {
      if (event.target && event.target.value && event.target.value.length >= this.minChars) {
        this.search()
        this.$emit('update:input', event.target.value)
      }
      if (event.target && event.target.value.length === 0) {
        this.reset()
      }
    },

    /**
     * When active focus input.
     */
    onFocusin () {
      this.focusing = true
    },

    /**
     * When remove focus input.
     */
    onFocusout () {
      this.focusing = false
      this.searching = false
    },

    /**
     * Emit event when select one option in list.
     */
    clickItem (item) {
      this.$emit('hit', item)
      this.reset()
    },

    /**
     * Highlight in bold the text that matches our search.
     * Case insensitive.
     */
    highlight (text, term) {
      if (text && term) {
        var index = text.toLowerCase().indexOf(term.toLowerCase())
        if (index >= 0) {
          text = `${text.substring(0, index)}<span style="font-weight: 600;">${text.substring(index, index + term.length)}</span>${text.substring(index + term.length)}`
        }
      }
      return text
    },

    reset () {
      this.$emit('reset')
      this.searching = false
      this.dataInput = ''
      this.showDropdown = false
    }
  }
}
</script>

<style scoped lang="scss">
  .vue-next-typeahead {
    width: 460px;
    display: block;
    position: relative;

    &__title {
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: left;
      display: block;
      margin-bottom: 8px;
    }

    &__wrapper-input {
      height: 48px;
      background: #FFFFFF;
      border: 1px solid #D2D2D2;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 0 15px 0 16px;
      position: relative;

      > input {
        height: 48px;
        border-radius: 0;
        border: 0;
        outline: none;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: left;
        margin-right: 8px;
        width: calc(100% - 32px);
        padding: 0;
        max-height: 100%;
        color: #404040;
        background: transparent;

        &::placeholder {
          color: #D2D2D2;
        }
      }

      .ico-search,
      .ico-loader {
        vertical-align: middle;
        background-size: cover;
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      .ico-search {
        background-image: url('../assets/search.svg');
      }
      .ico-loader {
        background-image: url('../assets/loader-orange.svg');
        -webkit-animation:spin 4s linear infinite;
        -moz-animation:spin 4s linear infinite;
        animation:spin 4s linear infinite;
      }
      @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
      @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
      @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

      // Hover state
      &:hover:not(.vue-next-typeahead__wrapper-input--focusing) {
        background: #FAFAFA;
        border: 1px solid #9B9B9B;

        > input::placeholder {
          color: #9B9B9B;
        }
      }

      // Focus state
      &--focusing {
          box-shadow: 0px 0px 8px 0px #FF7300 20%;
          border: 1px solid #FF7300;
          box-sizing: border-box;
          box-shadow: 0px 0px 8px rgba(255, 115, 0, 0.2);
          .ico-search {
            background-image: url('../assets/search-orange.svg');
          }
      }
    }

    &__dropdown {
      background: #FFFFFF;
      border: 1px solid #D2D2D2;
      list-style: none;
      margin: 0px;
      width: calc(100% - 2px);
      padding: 16px 0 0;
      margin-top: -14px;
      max-height: 336px;
      overflow-y: auto;

      > li {
        min-height: 42px;
        padding: 0 16px;
        font-size: 16px;
        font-style: normal;
        letter-spacing: 0px;
        text-align: left;
        cursor: pointer;

        &:hover {
          background: #FAFAFA;
        }

        > span {
          line-height: 42px;
        }

        &.li-no-results {
          line-height: 42px;
          cursor: auto;
        }
      }

      /** SCSS Para el scroll */
      &::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 5px;
          height: 6px;
      }

      &::-webkit-scrollbar-thumb {
          border-radius: 12px;
          border: 4px solid rgba(255, 255, 255, 0);
          background-color: #bdbdbd;
      }

      &::-webkit-scrollbar-corner {
          background-color: transparent;
      }
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
</style>

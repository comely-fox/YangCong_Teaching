import { createStore, StoreOptions, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

type Ids = {
  subject: number
  stage: number
  publisher: number
  semester: number
}

interface S {
  books: Ids
}

const options: StoreOptions<S> = {
  state: () => {
    return {
      books: {
        subject: 0,
        stage: 0,
        publisher: 0,
        semester: 0
      }
    }
  },

  mutations: {
    setData(state: S, payload: Ids) {
      state.books = payload
    }
  },

  plugins: [createPersistedState({
    paths: ['books'],
    key: 'yc'
  })]
}

const store: Store<S> = createStore<S>(options)

export { store as default }

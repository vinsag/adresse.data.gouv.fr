import React from 'react'
import Router from 'next/router'
import debounce from 'debounce'
import FaSearch from 'react-icons/lib/fa/search'

import {_get} from '../../lib/fetch'

import Section from '../section'
import SearchInput from '../search-input'
import Notification from '../notification'
import renderCommune from '../search-input/render-commune'

class Explorer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      results: [],
      loading: false,
      error: null
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.handleSearch = debounce(this.handleSearch, 200)
  }

  update() {
    this.setState({results: [], loading: true, error: null})
    const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'

    this.setState(state => {
      state.query = `communes?nom=${state.input}&${fields}&boost=population`
      this.handleSearch()
    })
  }

  handleSelect(item) {
    this.setState({input: item.nom})
    this.update()
    const href = `/explore/commune?codeCommune=${item.code}`
    const as = `/explore/commune/${item.code}`
    Router.push(href, as)
  }

  handleInput(input) {
    this.setState({input})
    this.update()
  }

  async handleSearch() {
    const {query} = this.state
    const url = 'https://geo.api.gouv.fr/' + query

    try {
      const results = await _get(url)
      this.setState({
        results: results.splice(0, 5) || []
      })
    } catch (err) {
      this.setState({
        results: [],
        error: err
      })
    }
    this.setState({loading: false})
  }

  render() {
    const {input, results, loading, error} = this.state

    return (
      <Section background='color'>
        <h2><FaSearch /> Chercher une commune</h2>
        <SearchInput
          value={input}
          results={results}
          loading={loading}
          placeholder='Rechercher une commune…'
          onSelect={this.handleSelect}
          onSearch={this.handleInput}
          renderItem={renderCommune}
          getItemValue={item => item.nom} />

        {error &&
          <div className='error'>
            <Notification message={error.message} type='error' />
          </div>
          }

        <style jsx>{`
            .error {
              margin: 1em 0;
            }
          `}</style>
      </Section>
    )
  }
}

export default Explorer

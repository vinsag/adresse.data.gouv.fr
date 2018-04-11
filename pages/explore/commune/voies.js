import React from 'react'
import PropTypes from 'prop-types'

import Page from '../../../layouts/main'

import {_get} from '../../../lib/fetch'

import withErrors from '../../../components/hoc/with-errors'

import Section from '../../../components/section'

import Head from '../../../components/explorer/voie/head'
import Voie from '../../../components/explorer/voie'
import MapContainer from '../../../components/explorer/voie/map-container'

const title = 'Voie'
const description = 'Consulter les voies de cette commune'

class VoiesPage extends React.Component {
  render() {
    const {commune, voie, addresses, selected} = this.props

    return (
      <Page title={title} description={description}>
        <Section>
          <Head commune={commune} voie={voie} />
          <Voie voie={voie} />
          <MapContainer addresses={addresses} selected={selected} />
        </Section>
      </Page>
    )
  }
}

VoiesPage.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    codesPostaux: PropTypes.array.isRequired,
    departement: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    region: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    centre: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired
    }).isRequired,
    contour: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired
    }).isRequired,
    population: PropTypes.number.isRequired,
    surface: PropTypes.number.isRequired
  }),
  voie: PropTypes.object,
  addresses: PropTypes.array,
  selected: PropTypes.object
}

VoiesPage.defaultProps = {
  commune: null,
  voie: null,
  addresses: null,
  selected: null
}

VoiesPage.getInitialProps = async ({query}) => {
  const {codeCommune, codeVoie} = query
  const geoApi = 'https://geo.api.gouv.fr'
  const exploreApi = 'https://sandbox.geo.api.gouv.fr/explore'
  const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'

  const [commune, voies, addresses] = await Promise.all([
    _get(`${geoApi}/communes/${codeCommune}?${fields}&boost=population`),
    _get(`${exploreApi}/${codeCommune}`),
    _get(`${exploreApi}/${codeCommune}/${codeVoie}`)
  ])

  return {
    commune,
    voie: voies.find(voie => voie.codeVoie === query.codeVoie),
    addresses,
    selected: query.numero ? addresses.find(address => address.numero === query.numero) : null
  }
}

export default (withErrors(VoiesPage))

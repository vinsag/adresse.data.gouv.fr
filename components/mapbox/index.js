/* eslint react/no-danger: off, react/style-prop-object: off */
import React from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl from 'react-mapbox-gl'

import bbox from '@turf/bbox'

// eslint-disable-next-line new-cap
const Map = ReactMapboxGl({})

const fullscreenStyle = {
  height: '100vh',
  width: '100vw'
}

const containerStyle = {
  height: '100%',
  width: '100%',
  boxShadow: '0 1px 4px #C9D3DF'
}

class Mapbox extends React.Component {
  constructor(props) {
    super(props)

    this.bbox = bbox(props.data)
  }

  componentDidMount() {
    this.bbox = null
  }

  componentWillReceiveProps(props) {
    if (props.data !== this.props.data) {
      this.bbox = bbox(props.data)
    }
  }

  getBounds = () => {
    const {bbox} = this

    if (bbox) {
      return [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]]
      ]
    }
  }

  render() {
    const {fullscreen, children} = this.props

    return (
      <Map
        style='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        fitBounds={this.getBounds()}
        fitBoundsOptions={{padding: 20, linear: true}}
        containerStyle={fullscreen ? fullscreenStyle : containerStyle}>
        {children}
      </Map>
    )
  }
}

Mapbox.propTypes = {
  data: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  fullscreen: PropTypes.bool
}

Mapbox.defaultProps = {
  fullscreen: false
}

export default Mapbox

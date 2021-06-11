import React from 'react'
import PropTypes from 'prop-types'
import {Clipboard} from 'react-feather'

import Button from '@/components/button'

function CoordinatesCopy({lat, lon, setCopyError, setIsCopySucceded, setIsCopyAvailable, isMobile, isSafariBrowser}) {
  const href = isSafariBrowser ? 'http://maps.apple.com/?address=' : 'geo:'

  const handleClick = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${lat},${lon}`)
        setIsCopySucceded(true)
      } catch (error) {
        setCopyError(error)
      }
    } else {
      setIsCopyAvailable(false)
    }

    const copyAlertElement = document.querySelector('#copy-alert')

    if (copyAlertElement) {
      setTimeout(() => {
        copyAlertElement.scrollIntoView({
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  return (
    <div>
      {isMobile ? (
        <div className='mobile-button'>
          <a className='text-button' href={`${href}${lat},${lon}`}>
            <Button
              type='button'
              style={{marginRight: 1, borderRadius: '3px 0 0 3px', width: '99.5%'}}
            >
              Ouvrir dans le GPS
            </Button>
          </a>

          <Button
            type='button'
            size='small'
            style={{borderRadius: '0 3px 3px 0'}}
            onClick={handleClick}
          >
            <Clipboard />
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          size='small'
          style={{width: '100%'}}
          onClick={handleClick}
        >
          Copier la position GPS
        </Button>
      )}
      <style jsx>{`
        .mobile-button {
          display: flex;
          justify-content: space-between;
        }

        .text-button {
          flex-grow: 1
        }
      `}</style>
    </div>
  )
}

CoordinatesCopy.defaultProps = {
  isMobile: false
}

CoordinatesCopy.propTypes = {
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  setCopyError: PropTypes.func.isRequired,
  setIsCopySucceded: PropTypes.func.isRequired,
  setIsCopyAvailable: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  isSafariBrowser: PropTypes.bool.isRequired
}

export default CoordinatesCopy

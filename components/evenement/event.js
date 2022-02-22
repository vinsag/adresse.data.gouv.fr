import {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {MapPin} from 'react-feather'

import theme from '@/styles/theme'

import ButtonLink from '../button-link'
import Button from '../button'

const formatTag = tag => {
  tag.replace(/[^\w\s]/gi, ' ')

  return `#${tag.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Event({event, background, isPassed, id, isOpen, isAllClose, handleOpen}) {
  const ref = useRef(null)
  const {title, address, description, date, href, tags, type, startHour, endHour, target, isOnlineOnly, instructions} = event
  const {nom, numero, voie, codePostal, commune} = address

  const sanitizedDate = new Date(date).toLocaleDateString('fr-FR')

  useEffect(() => {
    const handleOutsideClick = event => {
      if (isOpen && ref.current && !ref.current.contains(event.target)) {
        handleOpen(null)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, handleOpen])

  return (
    <div id={id} className='event-container' ref={ref}>
      <div className='event-top-infos'>
        <div className={`header ${type}`}>
          <Image src={`/images/icons/event-${type}.svg`} height={50} width={50} />
        </div>
        <div className='general-infos'>
          <h5>{title}</h5>
          <div className='date-container'>
            <div className='date'>{`le ${sanitizedDate}, de ${startHour} à ${endHour}`}</div>
          </div>

          {isOnlineOnly ? (
            <div>🖥️ <br />Évènement en ligne</div>
          ) : (
            <div><MapPin strokeWidth={3} size={14} style={{marginRight: 5}} />{nom}, {numero} {voie} - {codePostal} {commune}</div>
          )}
        </div>

        <div className='display-info-container'>
          {isOpen ? (
            <Button onClick={() => handleOpen(id)}>Masquer les informations</Button>
          ) : (
            <Button onClick={() => handleOpen(id)}>Afficher les informations</Button>
          )}
        </div>
      </div>

      <div className={isOpen ? 'event-bottom-infos' : 'hidden'}>
        {target ? (
          <div className='target'>Cet événement est à destination des {target}.</div>
        ) : (
          <div className='target'>Cet événement est à destination de tous.</div>
        )}

        <p>
          {description}
        </p>

        {!isPassed && instructions && (
          <div className='instructions'>{instructions}</div>
        )}

        <div className='tags'>
          {tags.map(tag => <div key={tag}>&nbsp;{formatTag(tag)}</div>)}
        </div>

        {!isPassed && href && (
          <div className='subscribe'>
            <ButtonLink href={href} isExternal>
              S’inscrire à l’évènement
            </ButtonLink>
          </div>
        )}
      </div>

      <style jsx>{`
        .event-container, .general-infos, .event-bottom-infos {
          display: flex;
          flex-direction: column;
        }

        .event-container {
          width: 320px;
          height: fit-content;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
          border-radius: ${theme.borderRadius};
          font-size: 14px;
          position: relative;
          z-index: ${isOpen ? 1 : 0};
          filter:${isOpen || isAllClose ? '' : 'blur(2px)'};
          position: relative;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          text-align: center;
        }

        .adresselab {
          background: ${theme.colors.lightPink};
        }

        .formation {
          background: ${theme.colors.lightEmeraude};
        }

        .partenaire {
          background: ${theme.colors.lightCyan};
        }

        .general-infos {
          padding: 1em;
          text-align: center;
          gap: 1em;
        }

        h5 {
          font-size: 13px;
          margin: 0;
        }

        .date-container {
          pointer-events: ${isOpen || isAllClose ? '' : 'none'}
        }

        .date {
          font-weight: bold;
          color: ${theme.primary};
        }

        .event-bottom-infos {
          gap: 5px;
          padding: 0 1em 10px 1em;
          position: absolute;
          top: 100%;
          background: ${background === 'grey' ? theme.colors.white : theme.colors.lighterGrey};
        }

        .display-info-container {
          width: 100%;
          display: grid;
          padding: 10px 1em;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          color: ${theme.primary};
          font-style: italic;
          font-size: 12px;
        }

        .subscribe {
          text-align: center;
        }

        .target {
          font-weight: bold;
          font-style: italic;
          font-size: 12px;
        }

        .hidden {
          display: none;
        }

        .instructions {
          font-weight: bold;
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Event.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.object,
    description: PropTypes.string,
    date: PropTypes.string,
    href: PropTypes.string,
    tags: PropTypes.array,
    type: PropTypes.string,
    startHour: PropTypes.string,
    endHour: PropTypes.string,
    target: PropTypes.string,
    isOnlineOnly: PropTypes.bool,
    instructions: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  handleOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isAllClose: PropTypes.bool.isRequired,
  background: PropTypes.oneOf([
    'white',
    'grey'
  ]),
  isPassed: PropTypes.bool
}

Event.defaultProps = {
  background: 'white',
  isPassed: false
}

export default Event

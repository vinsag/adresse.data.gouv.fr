import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'

import theme from '@/styles/theme'

import ActionButtonNeutral from '@/components/action-button-neutral'

class SwitchMapStyle extends React.Component {
  static propTypes = {
    isVector: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  render() {
    const {isVector, handleChange} = this.props
    const src = `/images/preview-${isVector ? 'ortho' : 'vector'}.png`
    const style = isVector ? 'Satellite' : 'Vectoriel'

    return (
      <div className='switch-style'>
        <ActionButtonNeutral label={isVector ? 'Passer en vue satellite' : 'Passer en vue vectoriel'} onClick={handleChange}>
          <Image
            width={90}
            height={90}
            src={src}
            alt=''
          />
        </ActionButtonNeutral>
        <div className='text'>{style}</div>
        <style jsx>{`
          .switch-style {
            width: 90px;
            height: 90px;
            border: 2px solid #fff;
            box-shadow: 0 1px 4px 0 ${theme.boxShadow};
          }

          .switch-style:hover {
            cursor: pointer;
          }

          .text {
            position: relative;
            bottom: 35px;
            left: 5px;
            background: ${theme.colors.almostBlack};
            color: ${theme.colors.white};
            border-radius: 10px;
            text-align: center;
            width: fit-content;
            padding: 0 5px;
          }
          `}</style>
      </div>
    )
  }
}

export default SwitchMapStyle

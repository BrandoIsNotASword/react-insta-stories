import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import SeeMore from './SeeMore'
import Bookend from './Bookend'
import CTAButton from './CTAButton'
import globalStyle from './../styles.css'

export default class Story extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
    this.getStoryContent = this.getStoryContent.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (this.props.story !== prevProps.story) {
      this.pauseId && clearTimeout(this.pauseId)
      this.pauseId = setTimeout(() => {
        this.setState({loaded: false})
      }, 300)
      this.props.action('pause', true)
      this.vid && this.vid.addEventListener('waiting', () => {
        this.props.action('pause', true)
      })
      this.vid && this.vid.addEventListener('playing', () => {
        this.props.action('play', true)
      })
    }
    if (this.vid && (this.props.playState !== prevProps.playState) && !this.props.bufferAction) {
      if (this.props.playState) {
        this.vid.pause()
      } else {
        this.vid.play().catch(e => console.log(e))
      }
    }
  }
  toggleMore = show => {
    this.setState({ showMore: show })
  }
  imageLoaded = () => {
    try {
      if (this.pauseId) clearTimeout(this.pauseId)
      this.setState({loaded: true})
      this.props.action('play', true)
    } catch (e) {
      console.log(e)
    }
  }
  videoLoaded = () => {
    try {
      this.props.getVideoDuration(this.vid.duration)
      this.vid && this.vid.play().then(() => {
        this.imageLoaded()
      }).catch(e => {
        this.props.action('pause')
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }

  getStoryContent() {
    let source = typeof this.props.story === 'object' ? this.props.story.url : this.props.story
    let storyContentStyles = this.props.story.styles || this.props.storyContentStyles || styles.storyContent
    let type = this.props.story.type === 'video' ? 'video' : 'image'    
    return (
      type === 'image' ? <img
          style={{...storyContentStyles, width: '100%', height: '100%', objectFit: 'cover'}}
          src={source}
          onLoad={this.imageLoaded}
        /> : (type === 'video' ? <video ref={r => { this.vid = r }} style={storyContentStyles} src={source} controls={false} onLoadedData={this.videoLoaded} autoPlay /> : null)
    )
  }
  render() {
    let isHeader = typeof this.props.story === 'object' && this.props.story.header
    return (
      <div style={{...styles.story, width: this.props.width, height: this.props.height}}>
        {this.getStoryContent()}
        {isHeader && <div style={{position: 'absolute', left: 12, top: 20, zIndex: 19}}>
          {this.props.header ? () => this.props.header(this.props.story.header) : <Header heading={this.props.story.header.heading} subheading={this.props.story.header.subheading} profileImage={this.props.story.header.profileImage} />}
        </div>}
        <div style={{background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.7))', width: '100%', height: '100%', position: 'absolute'}} />
        {!this.state.loaded && <div style={{width: this.props.width, height: this.props.height, position: 'absolute', left: 0, top: 0, background: 'rgba(0, 0, 0, 0.9)', zIndex: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ccc'}}>{this.props.loader || <div className={globalStyle.spinner} />}</div>}
        {this.props.story.seeMore &&
        <div style={{position: 'absolute', margin: 'auto', bottom: 0, zIndex: 9999, width: '100%'}}>
          <SeeMore action={this.props.action} toggleMore={this.toggleMore} showContent={this.state.showMore} seeMoreContent={this.props.story.seeMore} />
        </div>}
        <div style={{position: 'absolute', filter: 'drop-shadow(rgba(0, 0, 0, 0.9) 0px 0px 3px)', margin: 'auto', pointerEvents: 'none', padding: '0 15px', boxSizing: 'border-box', zIndex: 9999, bottom: 125, width: '100%', display: 'flex', flexDirection: 'column'}}>
          <span className={globalStyle.storyTitle}>{this.props.story.title}</span>
          <span className={globalStyle.storyContent}>{this.props.story.contentText}</span>
        </div>
        {this.props.cta &&
        <div style={{position: 'absolute', margin: 'auto', bottom: 0, zIndex: 9999, width: '100%'}}>
          <CTAButton action={this.props.action} text={this.props.cta.text} link={this.props.cta.link} />
        </div>}
        {this.props.isStoriesDone &&
        <div style={{position: 'absolute', margin: 'auto', bottom: 0, zIndex: 99999, width: '100%', height: '100%'}}>
          <Bookend reset={this.props.reset} link={this.props.cta.link} />
        </div>}
      </div>
    )
  }
}

const styles = {
  story: {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  },
  storyContent: {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto'
  }
}

Story.propTypes = {
  story: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  isStoriesDone: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number,
  action: PropTypes.func,
  reset: PropTypes.func,
  loader: PropTypes.element,
  header: PropTypes.element,
  playState: PropTypes.bool,
  getVideoDuration: PropTypes.func,
  bufferAction: PropTypes.bool,
  cta: PropTypes.cta,
  storyContentStyles: PropTypes.object
}

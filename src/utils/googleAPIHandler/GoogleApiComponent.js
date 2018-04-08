import React, { PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import { unmountComponentAtNode } from "react-dom"

import cache from './ScriptCache'
import GoogleApi from './GoogleApi'

const defaultMapConfig = {}
export const wrapper = (options) => (WrappedComponent) => {
  const apiKey = options.apiKey;
  const libraries = options.libraries || ['places'];

  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.state = {
        loaded: false,
        map: null,
        google: null,
        scriptCache: null,
      }
    }

    componentDidMount() {
      console.log("windowgoogle ", window.google)
      const refs = this.refs;

        
      
      console.log("cahe ", this.state.scriptCache)
      this.state.scriptCache.google.onLoad((err, tag) => {
        const maps = window.google.maps;
        const props = Object.assign({}, this.props, {
          loaded: this.state.loaded
        });

        const mapRef = refs.map;

        const node = ReactDOM.findDOMNode(mapRef);
        let center = new maps.LatLng(this.props.lat, this.props.lng)

        let mapConfig = Object.assign({}, defaultMapConfig, {
          center, zoom: this.props.zoom
        })

        this.map = new maps.Map(node, mapConfig);

        this.setState({
          loaded: true,
          map: this.map,
          google: window.google
        })
      });
  
    }

    componentWillMount() {
      
      this.setState({scriptCache: cache({
        google: GoogleApi({
          apiKey: apiKey,
          libraries: libraries
        })
        // google: 'https://maps.googleapis.com/maps/api/js?v=3.31&key=AIzaSyBOMmzOiZa0TPrMEqGZOh0SxdM-lEO0BHU'
      })
      })
      console.log("window will ", window.google)

    }

    render() {
      console.log("render ", this.state.google)
      
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        map: this.state.map,
        google: this.state.google,
        mapComponent: this.refs.map
      })      

      return (
        <div>
          <WrappedComponent {...props} />
          <div ref='map' />
        </div>
      )
    }
  }

  return Wrapper
}

export default wrapper
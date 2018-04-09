import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {withRouter} from 'react-router-dom'
import gql from 'graphql-tag'
import axios from 'axios'
import moment from 'moment'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Select from 'material-ui/Select'
import Switch from 'material-ui/Switch'
import Input, { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl, FormControlLabel } from 'material-ui/Form'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { GigFragments, UserFragments } from '../../constants/gqlFragments'

import GeoAutocompleteContainer from '../Geo/GeoAutocompleteContainer'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    padding: 20,
    marginTop: 20,
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
})

class UpdateGig extends Component {
  constructor(props) {
    super(props)
    
    const { gig } = props 
    const { location } = gig 

    this.state = {
      id: gig.id,
      type: gig.type,
      title: gig.title,
      text: gig.text,  
      startDateTime: gig.startDateTime,
      endDateTime: gig.endDateTime,
      locationId: location.id,
      location: {
          lat: location.lat,
          lng: location.lng,
        },
      addressName: location.name,
      address: location.address,
      directions: location.directions,
      addDateTime: true,
    }
  }
  
  render() {
    const { classes } = this.props
    const { addDateTime } = this.state

    const gigTypes = [
      {name: 'Creative', value: 'CREATIVE'}, 
      {name: 'Crew', value: 'CREW'}, 
      {name: 'Event', value: 'EVENT'}, 
      {name: 'Labor', value: 'LABOR'}, 
      {name: 'Talent', value: 'TALENT'}, 
      {name: 'Technical', value: 'TECHNICAL'}, 
      {name: 'Writing', value: 'WRITING'}, 
      {name: 'Other', value: 'OTHER'}, 
    ]
    const start = moment().format('YYYY-MM-DD[T]hh:mm').toString()
    const end = moment().add(2, 'hours').format('YYYY-MM-DD[T]hh:mm').toString()
    
    const $dateTimeForm = (<FormControl fullWidth className={classes.margin} disabled>
            <TextField
              id='datetime-start'
              label='Start Date & Time'
              type='datetime-local'
              defaultValue={start}
              className={classes.textField}
              onChange={e => this.setState({ startDateTime: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id='datetime-end'
              label='End Date & Time'
              type='datetime-local'
              defaultValue={end}
              className={classes.textField}
              onChange={e => this.setState({ endDateTime: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>)

    return (
      <form className={this.props.container} noValidate autoComplete="off">
        <FormControl fullWidth className={classes.margin}>
          <InputLabel htmlFor="gig-type">Type</InputLabel>
          <Select
            value={this.state.type}
            onChange={e => this.setState({ type: e.target.value })}
            inputProps={{
              name: 'type',
              id: 'gig-type',
            }}
          >
          {gigTypes.map((type, index) => 
            <MenuItem value={type.value} key={index}>{type.name}</MenuItem>
          )}
          </Select>
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id="title"
            label="Title"
            className={this.props.textField}
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.addDateTime}
                onChange={this._handleDateTimeOn('addDateTime')}
                value="addDateTime"
                color="primary"
              />
            }
            label="Add Date & Time"
          />
        </FormControl>
        {addDateTime && $dateTimeForm}
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id="text"
            label="Description"
            multiline={true}
            rows={5}
            rowsMax={8}
            className={this.props.textField}
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            margin="normal"
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          Current Address: {this.state.addressName} {this.state.address} <br/>
          Search for Different Address: <GeoAutocompleteContainer onSearchGeo={this._handleGeo}/>
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='text'
            label='Directions'
            multiline={true}
            rows={5}
            rowsMax={8}
            className={this.props.textField}
            value={this.state.directions}
            onChange={e => this.setState({ directions: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._updateGig()}>
            Edit
        </Button>
      </form>
    )
  }
  
  _handleDateTimeOn = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  _formatFilename = filename => {
    const date = moment().format('YYYYMMDD')
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    console.log(cleanFileName)
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };

  _uploadToS3 = async (file, signedRequest) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    await axios.put(signedRequest, file, options)
  }

  _updateGig = async () => {
    const { 
      id,
      title, 
      text, 
      type, 
      location,
      locationId,
      startDateTime,
      endDateTime,
      addressName,
      address,
      directions, } = this.state

    const lat = location.lat,
          lng = location.lng 
    
    console.log("gig ", id, title, text)

    await this.props.updateGigMutation({
      variables: {
        id,
        type,
        title,
        text,
        startDateTime,
        endDateTime,
        locationId,
        lat,
        lng,
        addressName,
        address,
        directions,
      },
      update: (store, { data: { updateGig }}) => {
        console.log("update", updateGig)
        this.props.history.push(`/g/${updateGig.id}`)
      }
    })
  }
  
  _handleGeo = (places) => {
    if (places.length === 0 || !places) return
    const place = places[0]

    this.setState({
      addressName: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    })
  }

  _onDrop = async files => {
    this.setState({ file: files[0] })
  }

  _handleImageFile = (e) => {
    const reader = new FileReader()
    const file = e.target.files[0]
      
    reader.onload = (upload) => {
      this.setState({
        image_uri: upload.target.result,
        // filename: file.name,
        // filetype: file.type
      })
    }

    reader.readAsDataURL(file)
  }
}

const UPDATE_GIG_MUTATION = gql`
  mutation UpdateGigMutation(
      $id: String!,
      $type: GIG_TYPE, 
      $title: String, 
      $text: String,
      $startDateTime: DateTime, 
      $endDateTime: DateTime, 
      $locationId: String,
      $addressName: String, 
      $lat: Float, 
      $lng: Float, 
      $address: String, 
      $directions: String
    ) {
    updateGig(
      id: $id,
      type:$type, 
      title: $title, 
      text: $text
      startDateTime: $startDateTime, 
      endDateTime: $endDateTime, 
      locationId: $locationId,
      addressName: $addressName, 
      lat: $lat, 
      lng: $lng, 
      address: $address, 
      directions: $directions,
      ) {
      ...GigBasic
      postedBy {
        ...Avatar
      }
      location {
        ...Location
      }
    }
  }
  ${GigFragments.gigBasic}
  ${GigFragments.location}
  ${UserFragments.avatar}
`

const S3_SIGN_MUTATION = gql`
  mutation S3SignMutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`

export default withStyles(styles)(compose(
  graphql(UPDATE_GIG_MUTATION, {name: 'updateGigMutation'}),
  graphql(S3_SIGN_MUTATION, {name: 's3SignMutation'})
)(withRouter(UpdateGig)))
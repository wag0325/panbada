import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { FormControl, FormHelperText, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'

import { UserFragments } from '../../constants/gqlFragments'
import { USER_QUERY } from './UserDetails'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
})

class CreateExperience extends Component {
  constructor(props) {
    super(props)
    
    let id = '',
        title = '',
        company = '',
        start = '',
        end = '',
        untilPresent = true,
        location = '',
        description = '',
        edit = false
    
    const { experience } = props
    
    console.log("props experience ", props)
    
    if (experience) {
      console.log("experience", experience)
      id = experience.id
      title = experience.title
      company = experience.company
      start = experience.start
      end = experience.end
      location = experience.location
      description = experience.description
      edit = true 

      if (end !== '' || !end) untilPresent = false
    }
    
    this.state = {
      id,
      userId: props.id,
      title,
      company,
      start,
      end,
      untilPresent,
      location,
      description,
      edit,
    }
  }
    
  render() {
    const { classes } = this.props
    const { untilPresent, start, end, edit } = this.state
    const startDate = moment().format('YYYY-MM-DD').toString()
    const endDate = moment().format('YYYY-MM-DD').toString()

    return (
      <form className={this.props.container} noValidate autoComplete='off'>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='title'
            label='Title'
            className={this.props.textField}
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='company'
            label='Company'
            className={this.props.textField}
            value={this.state.company}
            onChange={e => this.setState({ company: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin} disabled>
          <TextField
            id='datetime-start'
            label='Start Date'
            type='date'
            defaultValue={startDate}
            className={classes.textField}
            onChange={e => this.setState({ start: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.untilPresent}
                onChange={this._handleUntilPresent('untilPresent')}
                value='untilPresent'
                color='primary'
              />
            }
            label='Present'
          />
          {!untilPresent && (<TextField
            id='datetime-end'
            label='End Date & Time'
            type='date'
            defaultValue={endDate}
            className={classes.textField}
            onChange={e => this.setState({ end: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />)}
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='location'
            label='Location'
            className={this.props.textField}
            value={this.state.location}
            onChange={e => this.setState({ location: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='description'
            placeholder='Write a description...'
            className={this.props.textField}
            multiline={true}
            rows={5}
            rowsMax={8}
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            margin='normal'
          />
        </FormControl>
          <Button variant='raised' color='primary' className={this.props.button} onClick={() => this._confirm()}>
            {edit ? 'Edit' : 'Post' }
          </Button>
      </form>
    )
  }
  
  _handleUntilPresent = name => event => {
    this.setState({ [name]: event.target.checked })
  }

  _confirm = async () => {
    const { 
        id,
        title,
        company,
        location, 
        description,
        userId,
        edit } = this.state
    
    const start = moment(this.state.start).format('YYYY-MM-DD HH:mm')
    const end = moment(this.state.end).format('YYYY-MM-DD HH:mm')
    console.log("create ", title,
        company,
        location,
        start,
        end,
        description,)
    
    if(edit) {
      await this.props.updateExperienceMutation({
        variables: {
          id,
          title,
          company,
          location,
          description,
        }, 
        update: (store, { data: { updateExperience }}) => {
          
          const data = store.readQuery({ query: USER_QUERY, variables: { id: userId } })
          
          console.log("data user ", data)
          data.user.experiences.map((experience, index) => {
            if (experience.id === updateExperience.id)
              data.user.experiences[index] = { ...updateExperience, _typename: 'Experience' }
          })
          console.log("data user ", data)

          store.writeQuery({
            query: USER_QUERY,
            data,
            variables: { id: userId },
          })
        }
      })
    } else {
      await this.props.createExperienceMutation({
        variables: {
          title,
          company,
          location,
          description,
        }, 
        update: (store, { data: { createExperience }}) => {
          
          const data = store.readQuery({ query: USER_QUERY, variables: { id: userId } })
          
          console.log("data user ", data)
          data.user.experiences.splice(0, 0, { ...createExperience, _typename: 'Experience', } )
          console.log("data user ", data)

          store.writeQuery({
            query: USER_QUERY,
            data,
            variables: { id: userId },
          })
        }
      })
    }

    this.props.handleClose()
  }
}

const CREATE_EXPERIENCE_MUTATION = gql`
  mutation CreateExperienceMutation(
    $title: String!, 
    $company: String, 
    $location: String,
    $start: DateTime,
    $end: DateTime,
    $description: String,
    ) {
    createExperience(
      title: $title,
      company: $company,
      location: $location,
      start: $start,
      end: $end,
      description: $description
    ) {
      ...Experience
    }
  }
  ${UserFragments.experience}
`

const UPDATE_EXPERIENCE_MUTATION = gql`
  mutation UpdateExperienceMutation(
    $id: ID!,
    $title: String!, 
    $company: String, 
    $location: String,
    $start: DateTime,
    $end: DateTime,
    $description: String,
    ) {
    updateExperience(
      id: $id,
      title: $title,
      company: $company,
      location: $location,
      start: $start,
      end: $end,
      description: $description
    ) {
      ...Experience
    }
  }
  ${UserFragments.experience}
`

export default withStyles(styles)(compose(
  graphql(CREATE_EXPERIENCE_MUTATION, {name: 'createExperienceMutation'}),
  graphql(UPDATE_EXPERIENCE_MUTATION, {name: 'updateExperienceMutation'}),
)(CreateExperience))
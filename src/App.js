import React, { Component, Fragment } from 'react';
import { Paper, Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import Artist from './components/Artist';
import Tracklist from './components/Tracklist';

class App extends Component {
  state = {
    artists: [],
    currentPosition: 0,
  }
  orderByLikeCount = (trackA, trackB) => trackB.likeCount - trackA.likeCount;

  componentWillMount() {
    fetch('https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=bf70ca5a70d643d398b9c06827137ab0&format=json')
      .then(response => response.json())
      .then(({ artists: { artist } }) => Promise.all(artist
        .map(({ image, name }) => fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${name}&api_key=bf70ca5a70d643d398b9c06827137ab0&format=json`)
          .then(response => response.json())
          .then(({ toptracks: { track } }) => ({
            name,
            photo: image[3]['#text'],
            tracklist: track
              .map(({ name, playcount }) => ({ name, likeCount: parseInt(playcount) }))
              .sort(this.orderByLikeCount)
          })))
      ))
      .then(artists => {
        this.setState({
          artists
        })
      })
  }

  updateCurrentPosition = (value) => {
    this.setState({
      currentPosition: this.state.currentPosition + value
    })
  }

  updateLikeCount = (trackIndex, value) => {
    const { artists, currentPosition } = this.state;
    this.setState({
      artists: artists.map((artist) => {
        if (artists[currentPosition] === artist) artist.tracklist[trackIndex].likeCount += value
        return artist
      })
    })
  }

  render() {
    return (
      <Fragment>
        <header>
          <Typography variant='h2' align='center' color='primary' gutterBottom>
            Ranking songs
          </Typography>
        </header>
        <main>
          <Grid container justify='center'>
            {
              this.state.artists.length
                ? (
                  <Grid item xs={12} sm={9} md={6} lg={5}>
                    <Paper elevation={0}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Grid container direction='row' alignItems='center' justify='space-around'>
                            <Grid item>
                              <Button
                                mini
                                variant='fab'
                                color='primary'
                                aria-label='Before'
                                onClick={() => this.updateCurrentPosition(-1)}
                                disabled={this.state.currentPosition ? false : true}
                              >
                                <NavigateBefore />
                              </Button>
                            </Grid>
                            <Grid item xs={6}>
                              <Artist
                                currentArtist={this.state.artists[this.state.currentPosition].name}
                                currentPhoto={this.state.artists[this.state.currentPosition].photo}
                              />
                            </Grid>
                            <Grid item>
                              <Button
                                mini
                                variant='fab'
                                color='primary'
                                aria-label='Next'
                                onClick={() => this.updateCurrentPosition(1)}
                                disabled={
                                  this.state.currentPosition === (this.state.artists.length - 1)
                                    ? true
                                    : false
                                }
                              >
                                <NavigateNext />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Tracklist
                            currentTracklist={this.state.artists[this.state.currentPosition].tracklist}
                            updateLikeCount={this.updateLikeCount}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )
                : <CircularProgress color='secondary' />
            }
          </Grid>
        </main>
      </Fragment>
    );
  }
}

export default App;

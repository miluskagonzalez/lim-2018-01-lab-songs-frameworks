import React, { Fragment } from 'react';
import { Card, CardMedia, Typography } from '@material-ui/core'

const Artist = ({ currentArtist, currentPhoto }) => (
  <Fragment>
    <Card>
      <CardMedia
        component='img'
        alt={currentArtist}
        image={currentPhoto}
      />
    </Card>
    <Typography align='center' gutterBottom variant="h5" component="h2">
      {currentArtist}
    </Typography>
  </Fragment>
)

export default Artist
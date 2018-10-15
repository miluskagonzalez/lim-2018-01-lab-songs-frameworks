import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography } from '@material-ui/core';
import { Favorite, ThumbDownSharp } from '@material-ui/icons'

const Tracklist = ({ currentTracklist, updateLikeCount }) => (
  <List>
    {
      currentTracklist
        .map(({ name, likeCount }, index) => (
          <ListItem key={name}>
            <ListItemText>{name}</ListItemText>
            <IconButton
              color='primary'
              type='button'
              onClick={() => updateLikeCount(index, 1)}>
              <Favorite />
            </IconButton>
            <IconButton
              color='secondary'
              type='button'
              disabled={likeCount ? false : true}
              onClick={() => updateLikeCount(index, -1)}>
              <ThumbDownSharp />
            </IconButton>
            <Typography variant='body2'>{likeCount}</Typography>
          </ListItem>
        ))
    }
  </List>
)

export default Tracklist
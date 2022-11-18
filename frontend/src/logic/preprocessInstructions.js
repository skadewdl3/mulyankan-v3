export const rotate = (angle, id = 'all') => {
  if (typeof angle !== 'number') return
  if (typeof id !== 'string') return
  return {
    type: 'rotate',
    angle,
    id // all means all pages were rotated, whereas specific id means page of that id was rotated
  }
}

export const del = id => {
  if (typeof id !== 'string') return
  return {
    type: 'delete',
    id
  }
}

export const switchPlaces = (id1, id2) => {
  if (typeof id1 !== 'string' || typeof id2 !== 'string') return
  return {
    type: 'switch',
    switch: [id1, id2]
  }
}

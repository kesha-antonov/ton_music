export const parseTracks = (data) => {
  return data && data.tracks && data.tracks.map((track) => {
    return {
      ...track,
      imageUrl: `https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/170x170.jpg`
    }
  }) || []
}

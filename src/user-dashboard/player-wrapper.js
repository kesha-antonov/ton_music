import React, { useEffect, useRef, useState } from 'react'
import Player from './player'
import payments from '../utils/payments'

let Napster

export default function PlayerWrapper ({ track }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [playerMounted, setPlayerMounted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const lastTimeRef = useRef(0)
  const currentTimeRef = useRef(0)

  useEffect(() => {
    if (track && playerMounted) {
      Napster.player.play(track.id)
      setPlaying(true)
      setCurrentTrackId(track.id)
    }
  }, [track, playerMounted])

  useEffect(() => {
    Napster = window.Napster
    Napster.player.on('playsessionexpired', () => {
      setPlaying(false)
      Napster.player.pause()
      setCurrentTime(0)
    })
    Napster.player.on('playevent', (e) => {
      if (e.data.code === 'Paused') {
        setPlaying(false)
        if (currentTimeRef.current - lastTimeRef.current > 0) {
          payments.payForListening(currentTimeRef.current - lastTimeRef.current)
          console.log('payments.payForListening', currentTimeRef.current - lastTimeRef.current)
          lastTimeRef.current = +currentTimeRef.current
        }
      }

      if (e.data.code === 'PlayComplete') {
        setPlaying(false)
        Napster.player.pause()
      }
    })
    Napster.player.on('playtimer', e => {
      setCurrentTime(e.data.currentTime)
      setTotalTime(e.data.totalTime)
      currentTimeRef.current = e.data.currentTime

      if (e.data.currentTime - lastTimeRef.current > 5) {
        payments.payForListening(currentTimeRef.current - lastTimeRef.current)
        console.log('payments.payForListening', currentTimeRef.current - lastTimeRef.current)
        lastTimeRef.current = e.data.currentTime
      }

      // if (this.state.repeat) {
      //     if (Math.floor(this.state.currentTime) === this.state.totalTime) {
      //         Napster.player.play(this.state.selectedTrack.id);
      //     }
      // }
      // if (this.state.autoplay && Object.keys(this.state.selectedTrack).length !== 0) {
      //     if (Math.floor(this.state.currentTime) === this.state.totalTime) {
      //         const index = this.state.queue.map(q => q.id).indexOf(this.state.selectedTrack.id);
      //         if (index !== 9) {
      //             this.songMovement(this.state.queue[index + 1]);
      //             this.currentTrack(this.state.selectedTrack.id);
      //             Napster.player.play(this.state.queue[index + 1].id);
      //         } else {
      //             this.songMovement(this.state.queue[0]);
      //             this.currentTrack(this.state.selectedTrack.id);
      //             Napster.player.play(this.state.queue[0].id);
      //         }
      //     }
      // }
    })

    setPlayerMounted(true)
  }, [])

  return (
    <Player
      selectedTrack={track}
      playing={playing}
        // shuffle={this.state.shuffle}
        // updateQueue={this.updateQueue}
        // songMovement={this.songMovement}
        // queue={this.state.queue}
        // queueHolder={this.state.queueHolder}
        // showQueue={this.showQueue}
      isPlaying={setPlaying}
        // isShuffled={this.isShuffled}
        // isShowing={this.state.isShowing}
      currentTime={currentTime}
      totalTime={totalTime}
      currentTrackId={currentTrackId}
      currentTrack={setCurrentTrackId}
    />
  )
}

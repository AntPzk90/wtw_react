import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import { formatPlayerTime } from '@/utils/time'

import type { Film } from '@/types'

type VideoPlayerProps = Pick<Film, 'id' | 'videoLink' | 'name' | 'posterImage'>

export const VideoPlayer = ({ id, videoLink, name, posterImage }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const progress = duration ? (currentTime / duration) * 100 : 0
  const timeLeft = duration ? duration - currentTime : 0

  const playerEl = useRef<HTMLDivElement>(null)
  const videoEl = useRef<HTMLVideoElement>(null)
  const wasPlayingRef = useRef(false)

  const onPlayPauseBtnClick = () => {
    const video = videoEl.current
    if (!video) return

    if (video.paused) {
      video.play().catch(() => toast.error('Could not play the video'))
    } else {
      video.pause()
    }
  }

  const onFullScreenBtnClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      playerEl.current?.requestFullscreen().catch(() => toast.error('Full screen is not available'))
    }
  }

  const syncTime = (video: HTMLVideoElement) => {
    setCurrentTime(video.currentTime)
    setDuration(video.duration)
  }

  const seekTo = (clientX: number, bar: HTMLElement) => {
    const video = videoEl.current
    if (!video || !duration) return

    const { left, width } = bar.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - left) / width, 0), 1)
    video.currentTime = ratio * duration
  }

  return (
    <div className="player" ref={playerEl}>
      <video
        ref={videoEl}
        src={videoLink}
        className="player__video"
        poster={posterImage}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(evt) => syncTime(evt.currentTarget)}
        onTimeUpdate={(evt) => syncTime(evt.currentTarget)}
      ></video>

      <Link to={`/films/${id}`} className="player__exit">
        Exit
      </Link>

      <div className="player__controls">
        <div className="player__controls-row">
          <div
            className="player__time"
            onPointerDown={(evt) => {
              const video = videoEl.current
              if (!video) return

              evt.currentTarget.setPointerCapture(evt.pointerId)
              wasPlayingRef.current = !video.paused
              video.pause()
              seekTo(evt.clientX, evt.currentTarget)
            }}
            onPointerMove={(evt) => {
              if (evt.currentTarget.hasPointerCapture(evt.pointerId))
                seekTo(evt.clientX, evt.currentTarget)
            }}
            onLostPointerCapture={() => {
              if (wasPlayingRef.current) {
                videoEl.current?.play().catch(() => toast.error('Could not play the video'))
              }
            }}
          >
            <progress className="player__progress" value={progress} max="100"></progress>
            <div className="player__toggler" style={{ left: `${progress}%` }}>
              Toggler
            </div>
          </div>
          <div className="player__time-value">{formatPlayerTime(timeLeft)}</div>
        </div>

        <div className="player__controls-row">
          <button type="button" className="player__play" onClick={onPlayPauseBtnClick}>
            {isPlaying ? (
              <>
                <svg viewBox="0 0 14 21" width="14" height="21">
                  <use href="#pause" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 19 19" width="19" height="19">
                  <use href="#play-s" />
                </svg>
                <span>Play</span>
              </>
            )}
          </button>
          <div className="player__name">{name}</div>

          <button type="button" className="player__full-screen" onClick={onFullScreenBtnClick}>
            <svg viewBox="0 0 27 27" width="27" height="27">
              <use href="#full-screen" />
            </svg>
            <span>Full screen</span>
          </button>
        </div>
      </div>
    </div>
  )
}

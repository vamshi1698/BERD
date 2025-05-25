import React, { useState, useRef } from 'react'
import { PhoneCall, AlertTriangle } from 'lucide-react'
import Button from '../common/Button'

interface SOSButtonProps {
  onActivate?: () => void
}

const hazardSoundUrl = '/sounds/hazard.mp3'

const SOSButton: React.FC<SOSButtonProps> = ({ onActivate }) => {
  const [isActivating, setIsActivating] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startActivation = () => {
    setIsActivating(true)
    setCountdown(3)

    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }
          activateSOS()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelActivation = () => {
    setIsActivating(false)
    setCountdown(3)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const activateSOS = () => {
    setIsActivating(false)
    setIsActive(true)

    if (onActivate) {
      onActivate()
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('SOS activated with location:', position.coords)
        },
        error => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const deactivateSOS = () => {
    setIsActive(false)
  }

  return (
    <>
      <audio ref={audioRef} src={hazardSoundUrl} preload="auto" />

      {isActivating ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-error-50 p-4 rounded-lg shadow-lg border-2 border-error-500 flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-error-600 mb-2" />
            <p className="font-bold text-error-700 text-lg mb-2">
              SOS will activate in {countdown}...
            </p>
            <p className="text-error-600 text-sm mb-4">Press cancel to stop</p>
            <Button variant="outline" onClick={cancelActivation} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      ) : isActive ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-error-50 p-4 rounded-lg shadow-lg border-2 border-error-500 animate-pulse flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-error-600 mb-2" />
            <p className="font-bold text-error-700 text-lg mb-2">SOS ACTIVE</p>
            <p className="text-error-600 text-sm mb-4">
              Emergency services have been notified
            </p>
            <div className="flex space-x-2 w-full">
              <Button
                variant="primary"
                leftIcon={<PhoneCall className="h-4 w-4" />}
                className="flex-1"
                onClick={() => window.open('tel:112')}
              >
                Call
              </Button>
              <Button variant="outline" onClick={deactivateSOS} className="flex-1">
                Cancel SOS
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="danger"
            size="lg"
            emergency
            className="rounded-full h-16 w-16 shadow-lg"
            onClick={startActivation}
          >
            <span className="sr-only">SOS</span>
            <AlertTriangle className="h-8 w-8" />
          </Button>
        </div>
      )}
    </>
  )
}

export default SOSButton

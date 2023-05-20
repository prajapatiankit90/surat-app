// import { Device } from '@capacitor/device'
import { Device } from '@ionic-native/device';
import { useEffect, useState } from 'react'

export const useDeviceInfo = () => {
  const [DeviceInfo, setDeviceInfo] = useState('')

  useEffect(() => {
    const info = Device.platform    
      setDeviceInfo(info)    
  }, [])

  return { DeviceInfo }
}

import React, { Suspense, lazy, useEffect, useState } from 'react'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
/* Theme variables */
import './theme/variables.css'
import { setupConfig } from '@ionic/core'
import { useIonRouter } from '@ionic/react'

const Routes = lazy(() => import('./routes/Routes'))

setupConfig({
  swipeBackEnabled: false,
  hardwareBackButton: false
})

const App: React.FC = () => {
  const ionRouter = useIonRouter()
  document.addEventListener('ionBackButton', (ev: any) => {
    console.log(ev)
    ev.detail.register(-1, () => {
      if (!ionRouter.canGoBack()) {
        // App.exitApp();
      }
    })
  })
  return (
    <>
      <Suspense
        fallback={
          <div>
            Loading.....
          </div>
        }
      >
        <Routes />
      </Suspense>
    </>
  )
}

export default App

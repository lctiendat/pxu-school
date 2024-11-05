import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useDispatch } from 'react-redux';
import { useUser } from './hook/useUser';
import { useEffect } from 'react';
import Profile from './pages/Profile';

setupIonicReact();

const routerAuth = ['/login']

const App: React.FC = () => {

  const dispatch = useDispatch();
  const { loadUser } = useUser()

  useEffect(() => {

    if (!routerAuth.includes(window.location.pathname)) {
      loadUser()
      if (!loadUser().isLogin) {
        window.location.href = '/login'
      }
    }
  }, [dispatch])

  return (<IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
       
        <Route path="/login" component={Login} exact />
        <Route path="/profile" component={Profile} exact />
        <Route path="/dashboard" component={Dashboard} exact />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
}

export default App;

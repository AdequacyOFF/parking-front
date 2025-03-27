import {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import "react-multi-carousel/lib/styles.css";
import './styles/globals.scss';
import App from './App';
import {ThemeProvider, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';
import {BrowserRouter} from 'react-router-dom';
import {Provider as StoreProvider} from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StoreProvider store={store}>
    <ThemeProvider theme="light">
      <ToasterProvider>
        <BrowserRouter>
          <Suspense fallback="...Loading">
            <App />
          </Suspense>
        </BrowserRouter>
        <ToasterComponent className="toaster" />
      </ToasterProvider>
    </ThemeProvider>
  </StoreProvider>,
);

import React, { useEffect } from 'react';

//import Scss 
import './assets/scss/themes.scss';
import "./assets/scss/config/galaxy/app.scss"

//imoprt Route
import Route from './Routes'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'context/AuthContext';
import { ChatProvider } from 'context/ChatContext';
import { TenantProvider } from 'context/TenantContext';
import { TenantBootstrap } from 'context/Tenantbootstrap';
import { useProfile } from 'components/Hooks/UserHooks';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantBootstrap>
        <TenantProvider>
          <React.Fragment>
            <AuthProvider> 
              <ChatProvider> 
                <Route />
              </ChatProvider>
            </AuthProvider>
          </React.Fragment>
        </TenantProvider>
    </TenantBootstrap>
    </QueryClientProvider>
  );
}



export default App;




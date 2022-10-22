import { Provider } from 'react-redux'
import { RouterProvider } from "react-router-dom"

import Store from '@store'
import Router from '@/Router'

const App = () => (
    <Provider store={Store}>
        <RouterProvider router={Router} />
    </Provider>
)

export default App
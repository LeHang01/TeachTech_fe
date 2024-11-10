// src/App.js
import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { mainRouters } from './router';

function App() {
  return (
    <Routes>
      {mainRouters.map((item, key) => {
        const Page = item.component;
        const Layout = item.layout !== undefined ? item.layout : Fragment; // Dùng Fragment nếu layout là null hoặc undefined

        return (
          <Route
            key={key}
            path={item.path}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;

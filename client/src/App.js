import React,{ useState,useEffect } from "react";
import "./App.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import {authContext} from "./AuthContext";

function App() {
  const {authToken} = React.useContext(authContext)


  return (
    <div className="container">
      <h1>Basic routing Example alongwith basic Mern Authenitication </h1>
        <p>
          This example demonstrates some of the core features of React Router
          including nested <code>&lt;Route&gt;</code>s,{" "}
          <code>&lt;Outlet&gt;</code>s, <code>&lt;Link&gt;</code>s, and using a
          "*" route (aka "splat route") to render a "not found" page when someone
          visits an unrecognized URL.
        </p>
<Routes>
      <Route path="/" element={<Layout/>} >
        <Route index element={<Home />} />
        {!authToken && <Route path="login" element={<Login/>} />}
        <Route path="dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
                {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        <Route path="*" element={<NoMatch />} />
  </Route>
</Routes>
       

    {/* Routes nest inside one another. Nested route paths build upon
      parent route paths, and nested route elements render inside
      parent route elements. See the note about <Outlet> below. */}


    
    </div>
  );
}

export default App;


function Layout() {
  const {authToken} = React.useContext(authContext)

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!authToken && <li>
           <Link to="/login">Login</Link>
          </li>}
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
       <Outlet /> 
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Auth Example</h1>

<p>
  This example demonstrates a simple login flow with three pages: a public
  page, a protected page, and a login page. In order to see the protected
  page, you must first login. Pretty standard stuff.
</p>

<p>
  First, visit the public page. Then, visit the protected page. You're not
  yet logged in, so you are redirected to the login page. After you login,
  you are redirected back to the protected page.
</p>

<p>
  Notice the URL change each time. If you click the back button at this
  point, would you expect to go back to the login page? No! You're already
  logged in. Try it out, and you'll see you go back to the page you
  visited just *before* logging in, the public page.
</p>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

import '../styles/global.css'

// top-lvl component which will be common across
// all the different pages, can use to keep state (context??)

// import global css here

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
  }
import { createGlobalStyle } from 'styled-components';
import 'video-react/dist/video-react.css';

const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  .gx-app-sidebar * {
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;
  }

  html {
    font-size: 62.5%;
    height: 100%;
    max-width: 100vw;

    overflow: hidden;
    line-height: 1.6rem;
    font-weight: 500;

    box-sizing: border-box;
  }

  * {
    box-sizing: inherit;
    font-family: 'Quicksand', sans-serif;
  }

  .ant-radio-inner:after {
    margin-top: 0;
    margin-left: 0;
  }


  body {
    padding: 0;
    margin: 0;
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    font-size: 1.6rem !important;
  }


  #app-site {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  #__next {
   height: 100%;
  }

  .ant-switch-checked {
    background-color: #955531;
  }

  .video-react-video {
    border-radius: 10px;
  }
 

/* custom scrollbar */
::-webkit-scrollbar {
  width: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

.rdw-image-modal-url-input {
  background-color: white;
}

.rdw-image-modal-size-input {
  background-color: white;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a8bbbf;
}

.select-popup {
  z-index: 1;
}

.ant-popover.ant-popconfirm.ant-popover-placement-right {
  z-index: 50;
}

`;

export default GlobalStyle;

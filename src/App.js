import 'leaflet/dist/leaflet.css';
import BrowseRouter from "./BrowseRouter";
import Background3D from "./components/Background3D";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

library.add(faInstagram, faFacebookF, faLinkedinIn);

function App() {
  return (
    <div>
      <Background3D />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <BrowseRouter></BrowseRouter>
      </div>
    </div>
  );
}


export default App;

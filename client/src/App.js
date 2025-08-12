import { Route, Routes } from 'react-router-dom';
import Home from './components/Main/Home';
import About from './components/Main/about';
import PersonalAreaLogin from './components/Main/PersonalAreaLogin';
import PersonalArea from './components/Main/PersonalArea';
import LoginManager from './components/Main/LoginManager';
import OrdersOnline from './components/Main/OrdersOnline';
import Gallery from './components/Main/Gallery';
import Contact from './components/Main/contact';
import SystemManagerHome from './components/SystemManager/SystemManagerHome';
import NewOrders from './components/SystemManager/NewOrders';
import EventCalendar from './components/SystemManager/EventCalendar';
import Inventory from './components/SystemManager/Inventory';
import KitchenOrder from './components/SystemManager/KitchenOrder';
import OnlineOrdersSystem from './components/SystemManager/OnlineOrdersSystem';
import OrderDetails from './components/SystemManager/OrderDetails';
import UserManagement from './components/SystemManager/UserManagement'; 
import OrderManagement from './components/SystemManager/OrderManagement';
import OrderManagementDetails from './components/SystemManager/OrderManagementDetails';
import ContactManager from './components/SystemManager/ContactManager';
import ImageUploadManager from './components/SystemManager/ImageUploadManager';
import TextMove from './components/Main/textMove';
import ProtectedRoute from './components/ProtectedRoute'; 
import MainCourse from './components/Main/MainCourse';
//-------------------------------------------------------
import OffersSection from './components/Main/Offers/OffersSection';
import WeddingOffer from './components/Main/Offers/WeddingOffer';
import BritOffer from './components/Main/Offers/BritOffer';
import EngagementOffer from './components/Main/Offers/EngagementOffer';
import BarMitzvahOffer from './components/Main/Offers/BarMitzvahOffer';

import GenericOrder from './components/Main/OrdersOffer/GenericOrder'
import FAQAccordion from './components/Main/FAQAccordion';


function App() {
  return (
    <div>
      <header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/loginManager' element={<LoginManager />} />
          <Route path='/PersonalAreaLogin' element={<PersonalAreaLogin />} />
          <Route path='/PersonalArea' element={<PersonalArea />} />
          <Route path='/Gallery' element={<Gallery />} />
          <Route path='/About' element={<About />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/textMove' element={<TextMove />} />
          <Route path='/MainCourse' element={<MainCourse />} />
          <Route path='/FAQAccordion' element={<FAQAccordion />} />
        

<Route path='/OffersSection' element={<OffersSection />} />
<Route path='/BarMitzvahOffer' element={<BarMitzvahOffer />} />
<Route path='/WeddingOffer' element={<WeddingOffer />} />
<Route path='/BritOffer' element={<BritOffer />} />
<Route path='/EngagementOffer' element={<EngagementOffer />} />


<Route path="/GenericOrder" element={<GenericOrder />} />


         

         
          <Route path='/OrderDetails' element={<OrderDetails />} />
          <Route path='/OrdersOnline' element={<OrdersOnline />} />
    

          
          {/* דפים שמוגנים בעזרת אימות */} 
          <Route path='/OnlineOrdersSystem' element={<ProtectedRoute><OnlineOrdersSystem /></ProtectedRoute>} />
          <Route path='/SystemManagerHome'element={<ProtectedRoute><SystemManagerHome /></ProtectedRoute>} />         
          <Route path='/NewOrders' element={<ProtectedRoute> <NewOrders /></ProtectedRoute> } />        
          <Route path='/EventCalendar' element={<ProtectedRoute><EventCalendar /></ProtectedRoute>} />       
          <Route path='/Inventory' element={ <ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path='/KitchenOrder' element={ <ProtectedRoute><KitchenOrder /></ProtectedRoute>} />    
          <Route path='/UserManagement' element={  <ProtectedRoute><UserManagement /></ProtectedRoute>} />     
          <Route path='/OrderManagement' element={ <ProtectedRoute><OrderManagement /></ProtectedRoute>} />         
          <Route path='/OrderManagementDetails' element={<ProtectedRoute><OrderManagementDetails /></ProtectedRoute>} />    
          <Route path='/ContactManager' element={<ProtectedRoute><ContactManager /></ProtectedRoute>} />
          <Route path='/ImageUploadManager' element={<ProtectedRoute><ImageUploadManager /></ProtectedRoute>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;

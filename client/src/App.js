import { Route ,Routes } from 'react-router-dom';

import Home from './components/Main/Home';
import About from './components/Main/about';
import PersonalArea from './components/Main/Personal-area';
import LoginManager from './components/Main/LoginManager';
import OrdersOnline from './components/Main/ordersOnline';
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
function App() {
  return (
    <div>
      <header >
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/loginManager' element={<LoginManager/>}/>
          <Route path='/personal-area' element={<PersonalArea/>}/>
          <Route path='/SystemManagerHome' element={<SystemManagerHome/>}/>
          <Route path='/NewOrders' element={<NewOrders/>}/>
          <Route path='/About' element={<About/>}/>
          <Route path='/Contact' element={<Contact/>}/>
          <Route path='/Gallery' element={<Gallery/>}/>

          <Route path='/EventCalendar' element={<EventCalendar/>}/>
          <Route path='/Inventory' element={<Inventory/>}/>
          <Route path='/KitchenOrder' element={<KitchenOrder/>}/>
          <Route path='/OrdersOnline' element={<OrdersOnline/>}/>
          <Route path='/OnlineOrdersSystem' element={<OnlineOrdersSystem/>}/>
          <Route path='/OrderDetails' element={<OrderDetails/>}/>
          <Route path='/UserManagement' element={<UserManagement/>}/>
          <Route path='/OrderManagement' element={<OrderManagement/>}/>
          <Route path='/OrderManagementDetails' element={<OrderManagementDetails/>}/>
          <Route path='/ContactManager' element={<ContactManager/>}/>
      

        </Routes>
      </header>
    </div>
  );
}

export default App;

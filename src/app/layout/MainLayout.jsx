import { Outlet } from 'react-router-dom';
import Header from '../../Components/Other/Header';

export default function MainLayout() {
    return (
        <div className="layout">
            <Header/>
            <Outlet />
        </div>
    );
}

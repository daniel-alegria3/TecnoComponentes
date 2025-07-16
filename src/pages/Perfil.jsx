import { useNavigate} from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate()
    const email = localStorage.getItem('userEmail') || '';
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-violet-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-violet-900 mb-2">Mi Perfil</h1>
            <p className="text-violet-600">Administra tu información personal</p>
          </div>
  
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-violet-600 to-violet-400"></div>
  
            {/* Profile Info */}
            <div className="px-6 pb-8 relative">
              <div className="flex justify-center -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  <img 
                    src="https://www.boredpanda.com/blog/wp-content/uploads/2024/06/sigma-face-6.jpg" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center mb-6">
                <p className="text-violet-600">{email}</p>
              </div>
  
              {/* Stats */}
              <div className="grid grid-cols-2 divide-x divide-violet-200 border border-violet-200 rounded-lg mb-6">
                <button onClick={() => navigate("/ordenes")} className="py-4 text-center">
                  <p className="text-sm text-violet-500">Pedidos</p>
                </button>
                <button onClick={() => navigate("/cart")} className="py-4 text-center">
                  <p className="text-sm text-violet-500">En Carrito</p>
                </button>
              </div>
  
              {/* Actions */}
              {/* <div className="flex justify-center space-x-4">
                <button className="px-6 py-2 bg-violet-600 text-white font-medium rounded-lg shadow hover:bg-violet-700 transition-colors">
                  Editar Perfil
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
import { useNavigate } from "react-router-dom";

export default function Perfil() {
    const navigate = useNavigate()
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
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
  
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-violet-900">María González</h2>
                <p className="text-violet-600">@mariagonzalez</p>
              </div>
  
              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-violet-200 border border-violet-200 rounded-lg mb-6">
                <div className="py-4 text-center">
                  <p className="text-2xl font-bold text-violet-700">2</p>
                  <p className="text-sm text-violet-500">Pedidos</p>
                </div>
                <button onClick={() => navigate("/")} className="py-4 text-center">
                  <p className="text-2xl font-bold text-violet-700">3</p>
                  <p className="text-sm text-violet-500">Direcciones</p>
                </button>
                <button onClick={() => navigate("/cart")} className="py-4 text-center">
                  <p className="text-2xl font-bold text-violet-700">4</p>
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
import Card from "../../components/AdminCard"; // Tarjeta personalizada para mostrar estadísticas

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título del dashboard */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total de Productos" value="120" />
        <Card title="Pedidos Pendientes" value="5" />
        <Card title="Clientes Nuevos" value="20" />
      </div>

      {/* Gráfico o información adicional */}
      <div className="mt-12">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Estadísticas Generales</h2>
        {/* Aquí puedes agregar un gráfico o más información */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-center text-gray-600">Aquí va el gráfico o más detalles</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

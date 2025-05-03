function Card({ title, value }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-2xl text-blue-500">{value}</p>
      </div>
    );
  }
  
  export default Card;
  
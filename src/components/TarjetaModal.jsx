import { useState } from 'react';

const Modal = ({ isOpen, onClose, onSave }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    ownerName: ''
  });
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    ownerName: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Limpieza de errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Formateo especial para ciertos campos
    let formattedValue = value;
    if (name === 'cardNumber') {
      // Eliminar todos los espacios y luego agregar cada 4 dígitos
      const cleanedValue = value.replace(/\s/g, '');
      formattedValue = cleanedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'expiryDate') {
      // Formato MM/AA
      const cleanedValue = value.replace(/[^0-9]/g, '');
      if (cleanedValue.length > 2) {
        formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
      } else {
        formattedValue = cleanedValue;
      }
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateCardNumber = (number) => {
    // Eliminar espacios y validar que sean solo números
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d+$/.test(cleaned)) return 'Solo se permiten números';
    if (cleaned.length < 16) return 'Debe tener 16 dígitos';
    
    // Validación básica con algoritmo de Luhn
    let sum = 0;
    for (let i = 0; i < cleaned.length; i++) {
      let digit = parseInt(cleaned[i]);
      if ((cleaned.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    return sum % 10 === 0 ? '' : 'Número de tarjeta inválido';
  };

  const validateExpiryDate = (date) => {
    if (!date) return 'Ingrese fecha de vencimiento';
    
    const [month, year] = date.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return 'Formato MM/AA requerido';
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryMonth = parseInt(month);
    const expiryYear = parseInt(year);
    
    if (expiryMonth < 1 || expiryMonth > 12) return 'Mes inválido';
    if (expiryYear < currentYear || 
        (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return 'Tarjeta vencida';
    }
    
    return '';
  };

  const validateCVV = (cvv) => {
    if (!cvv) return 'Ingrese el CVV';
    if (!/^\d+$/.test(cvv)) return 'Solo números permitidos';
    if (cvv.length !== 3) return 'CVV debe tener 3 dígitos';
    return '';
  };

  const validateOwnerName = (name) => {
    if (!name.trim()) return 'Ingrese el nombre del propietario';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return 'Solo letras permitidas';
    return '';
  };

  const handleSubmit = () => {
    const newErrors = {
      cardNumber: validateCardNumber(cardData.cardNumber),
      expiryDate: validateExpiryDate(cardData.expiryDate),
      cvv: validateCVV(cardData.cvv),
      ownerName: validateOwnerName(cardData.ownerName)
    };
    
    setErrors(newErrors);
    
    // Verificar si hay errores
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    
    // Formatear datos antes de enviar
    const cleanedCardNumber = cardData.cardNumber.replace(/\s/g, '');
    const [expMonth, expYear] = cardData.expiryDate.split('/');
    
    onSave({
      ownerName: cardData.ownerName.trim(),
      lastFourDigits: cleanedCardNumber.slice(-4),
      cardBrand: getCardBrand(cleanedCardNumber),
      expiryMonth: expMonth,
      expiryYear: expYear
    });
    
    onClose();
  };

  // Función para detectar la marca de la tarjeta
  const getCardBrand = (cardNumber) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^5[1-5][0-9]{14}$/;
    const amexRegex = /^3[47][0-9]{13}$/;
    
    if (visaRegex.test(cardNumber)) return 'Visa';
    if (mastercardRegex.test(cardNumber)) return 'Mastercard';
    if (amexRegex.test(cardNumber)) return 'American Express';
    return 'Otra';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Agregar Nueva Tarjeta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Número de tarjeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de la tarjeta*
            </label>
            <input 
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength={19} // 16 dígitos + 3 espacios
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>
          
          {/* Fecha vencimiento y CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha vencimiento (MM/AA)*
              </label>
              <input 
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="MM/AA"
                maxLength={5}
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV*
              </label>
              <input 
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errors.cvv ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>
          
          {/* Nombre del propietario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del propietario*
            </label>
            <input 
              type="text"
              name="ownerName"
              value={cardData.ownerName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.ownerName ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Nombre como aparece en la tarjeta"
            />
            {errors.ownerName && (
              <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
            )}
          </div>
          
          {/* Nota sobre campos obligatorios */}
          <p className="text-xs text-gray-500">* Campos obligatorios</p>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
          >
            Guardar Tarjeta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
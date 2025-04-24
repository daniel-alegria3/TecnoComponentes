import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function DeleteProductModal({ isOpen, onClose, product, onDelete }) {
  if (!product) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                ¿Estás seguro de eliminar este producto?
              </Dialog.Title>
              <p className="mt-2 text-gray-600">
              <strong>{product.name}</strong> será eliminado permanentemente.
              </p>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDelete(product.id);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

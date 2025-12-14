// src/components/SkeletonCard.jsx (Crea este archivo nuevo)

export default function SkeletonCard() {
  // Nota: Los valores de 'h-48', 'w-full', 'min-h-[56px]'
  // coinciden con los de tu ItemCard.jsx para que el esqueleto se vea idéntico.
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-pulse border border-gray-200 dark:border-gray-700">
      {/* 1. Área de la Imagen (h-48 igual que tu ItemCard) */}
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>

      <div className="p-4 flex flex-col justify-between h-auto">
        <div>
          {/* 2. Nombre del Producto (simulado) */}
          <div className="h-6 bg-gray-400 dark:bg-gray-600 w-3/4 mb-3 rounded min-h-[56px]"></div>

          {/* 3. Precio (simulado) */}
          <div className="h-4 bg-gray-400 dark:bg-gray-600 w-1/4 mt-2 rounded"></div>
        </div>

        <div className="mt-4 flex flex-col space-y-2">
          {/* 4. Botón Añadir al Carrito (simulado) */}
          <div className="h-10 bg-pink-300 dark:bg-pink-600 rounded-lg"></div>

          {/* 5. Contenedor de Botones CRUD (simulado) */}
          <div className="flex justify-between space-x-1 mt-4">
            <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

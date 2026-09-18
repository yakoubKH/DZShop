

import { useCart } from '../context/CartContext';

function CartPage() {

  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    total
  } = useCart();

  if (cartItems.length === 0) {

    return (
      <div className="container py-5">

        <h1>Panier</h1>

        <p>
          Ton panier est vide pour l'instant.
        </p>

      </div>
    );

  }

  return (
    <div className="container py-5">

      <h1>Panier</h1>

      {cartItems.map(function (item) {

        return (
          <div
            key={item._id}
            className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
          >

            <div>

              <h5>
                {item.nom}
              </h5>

              <p className="mb-1">
                Prix : {item.prix} DA
              </p>

              <p className="mb-0">
                Sous-total : {item.prix * item.quantity} DA
              </p>

            </div>

            <div className="d-flex align-items-center gap-2">

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={function () {
                  decreaseQuantity(item._id);
                }}
              >
                −
              </button>

              <span>
                {item.quantity}
              </span>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={function () {
                  addToCart(item);
                }}
              >
                +
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={function () {
                  removeFromCart(item._id);
                }}
              >
                Retirer
              </button>

            </div>

          </div>
        );

      })}

      <h2 className="mt-4">
        Total : {total} DA
      </h2>

    </div>
  );
}

export default CartPage;



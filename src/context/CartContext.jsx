
import { createContext, useContext, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  // Ajouter un produit au panier
  function addToCart(product) {

    setCartItems(function (prev) {

      const existant = prev.find(function (item) {
        return item._id === product._id;
      });

      if (existant) {

        return prev.map(function (item) {

          if (item._id === product._id) {

            return {
              ...item,
              quantity: item.quantity + 1
            };

          }

          return item;

        });

      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1
        }
      ];

    });

  }

  // Diminuer la quantité
  function decreaseQuantity(id) {

    setCartItems(function (prev) {

      return prev
        .map(function (item) {

          if (item._id === id) {

            return {
              ...item,
              quantity: item.quantity - 1
            };

          }

          return item;

        })
        .filter(function (item) {

          return item.quantity > 0;

        });

    });

  }

  // Supprimer complètement un produit
  function removeFromCart(id) {

    setCartItems(function (prev) {

      return prev.filter(function (item) {

        return item._id !== id;

      });

    });

  }

  // Nombre total d'articles
  const nbItems = cartItems.reduce(function (sum, item) {

    return sum + item.quantity;

  }, 0);

  // Prix total
  const total = cartItems.reduce(function (sum, item) {

    return sum + item.prix * item.quantity;

  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        nbItems,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );

}

export function useCart() {

  return useContext(CartContext);

}



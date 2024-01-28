import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "sending ...",
        message: "sending cart data ...",
      })
    );
    const sendRequest = async () => {
      const response = await fetch(
        "https://redux-34ebf-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );
      if (!response.ok) throw new Error("Could not save data");
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "success",
          message: "sent cart data successfully!",
        })
      );
    } catch (Error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "failed to send data !",
        })
      );
    }
  };
};

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://redux-34ebf-default-rtdb.firebaseio.com/cart.json"
      );
      if (!response.ok) {
        throw new Error("could not fetch cart data !");
      }
      const data = await response.json();
      return data;
    };
    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (Error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "failed to fetch data !",
        })
      );
    }
  };
};
